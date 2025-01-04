const Apartment = require("../models/appartment.model");
const Requests = require("../models/requests.model");
const { getUserById } = require("../controllers/user.controller");
const { toMongoID } = require("../utils/Helper");
const NotificationHelper = require("../utils/NotificationClient");
const StorageClient = require("../providers/storage");
const fs = require("fs");
const { omit } = require("lodash");

const createApartment = async (req, res) => {
  try {
    const { title, description, location, roomType, rent, amenities, images } =
      req.body;
    const apartment = new Apartment({
      landlord: req.user.id,
      title,
      description,
      location,
      roomType,
      rent,
      amenities: amenities.split(",").map((amenity) => amenity.trim()),
      images,
    });
    await apartment.save();
    await NotificationHelper.addNotification(
      {
        receiver: apartment.landlord,
        payload: `A new apartment has been listed with the title: ${apartment.title}`,
        type: "New Apartment",
      },
      true
    );
    return res.status(201).json({
      message: "Apartment created successfully",
      apartment,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create apartment: " + error.message,
    });
  }
};

const addImages = async (req, res) => {
  try {
    const { id } = req.params;
    const images = await Promise.all(
      req.files.map(async (file) => {
        const { public_id } = await StorageClient.uploadFromPath(file.path);
        const url = await StorageClient.getUrlByFileKey(public_id);
        fs.unlinkSync(file.path);
        return url;
      })
    );
    const apartment = await Apartment.updateOne(
      { _id: id },
      {
        $set: {
          images: images,
        },
      }
    );

    return res.status(200).json({
      message: "Images added successfully",
      apartment,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to add images: " + error.message,
    });
  }
};

const getApartments = async (req, res) => {
  try {
    const { limit, page, search, minPrice, maxPrice, lat, lng, roomType } =
      req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const skip = (pageNumber - 1) * limitNumber;
    const findOptions = {};

    if (search) {
      const keywords = search
        .split(" ")
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 0 && word !== " ");

      findOptions.$or = [
        { title: { $in: keywords.map((kw) => new RegExp(kw, "i")) } },
        {
          "location.address": {
            $in: keywords.map((kw) => new RegExp(kw, "i")),
          },
        },
        {
          "landlord.username": {
            $in: keywords.map((kw) => new RegExp(kw, "i")),
          },
        },
      ];
    }

    if (minPrice && maxPrice) {
      findOptions.rent = { $gte: minPrice, $lte: maxPrice };
    }
    if (lat && lng) {
      findOptions.location = {
        coordinates: {
          coordinates: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [lat, lng],
              },
              $maxDistance: 5000,
            },
          },
        },
      };
    }
    if (roomType) {
      findOptions.roomType = roomType;
    }
    const apartments = await Apartment.find(findOptions)
      .skip(skip)
      .limit(limitNumber)
      .populate("landlord", "username email");
    const total = await Apartment.countDocuments(findOptions);
    res.json({ success: true, apartments, total });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to fetch apartments: " + error.message,
    });
  }
};

const getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id).populate(
      "landlord",
      "username email profilePicture"
    );
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const user = await getUserById(req.user.id);
    let isFavorite = false;
    if (
      user.userType === "student" &&
      user.favorites.map((fav) => fav.appartmentId.toString()).includes(id)
    ) {
      isFavorite = true;
    }
    let isBooked = false;
    let isBookedByRoommate = false;
    if (user.userType === "student") {
      isBooked = apartment.bookings
        .map((booking) => booking.student.id.toString())
        .includes(user.id);
      isBookedByRoommate = apartment.bookings.find((booking) => {
        const roommates = booking.roommates.map((roommate) =>
          roommate.id.toString()
        );
        return roommates.includes(user.id);
      });
    }
    return res.status(200).json({
      ...apartment._doc,
      isFavorite,
      isBooked,
      isBookedByRoommate: !!isBookedByRoommate,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch apartment: " + error.message,
    });
  }
};

getBookedAppartments = async (req, res) => {
  try {
    const id = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const today = new Date();
    const bookedApartments = await Apartment.aggregate([
      { $match: { landlord: toMongoID(id) } },
      {
        $addFields: {
          activeBookings: {
            $filter: {
              input: "$bookings",
              as: "booking",
              cond: {
                $and: [
                  { $eq: ["$$booking.status", "Approved"] },
                  { $gte: ["$$booking.checkIn", today] },
                  { $lte: ["$$booking.checkOut", today] },
                ],
              },
            },
          },
        },
      },
      { $match: { "activeBookings.0": { $exists: true } } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const countDocuments = await Apartment.aggregate([
      { $match: { landlord: toMongoID(id) } },
      {
        $addFields: {
          activeBookings: {
            $filter: {
              input: "$bookings",
              as: "booking",
              cond: {
                $and: [
                  { $eq: ["$$booking.status", "Approved"] },
                  { $gte: ["$$booking.checkIn", today] },
                  { $lte: ["$$booking.checkOut", today] },
                ],
              },
            },
          },
        },
      },
      { $match: { "activeBookings.0": { $exists: true } } },
      { $count: "total" },
    ]);
    return res.status(200).json({
      appartments: bookedApartments,
      total: countDocuments[0]?.total ?? 0,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch booked apartments: " + error.message,
    });
  }
};

const addBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, roommates } = req.body;
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    if (apartment.availabilityStatus === "Unavailable") {
      return res.status(400).json({
        message: "Apartment is unavailable",
      });
    }
    const isAlreadyBooked = apartment.bookings.find(
      (booking) =>
        booking.status === "Approved" &&
        booking.checkIn <= checkOut &&
        booking.checkOut >= checkIn
    );
    if (isAlreadyBooked) {
      return res.status(400).json({
        message: `Apartment already booked  for ${checkIn} to ${checkOut}`,
      });
    }
    const isAlreadyBookedByUser = apartment.bookings.find(
      (booking) =>
        booking.student.id.toString() === req.user.id &&
        booking.status === "Pending"
    );
    if (isAlreadyBookedByUser) {
      return res
        .status(400)
        .json({ message: "Apartment already booked by user" });
    }
    const booking = {
      student: {
        id: req.user.id,
        username: req.user.username,
      },
      checkIn,
      checkOut,
      status: "Pending",
      roommates,
    };
    apartment.bookings.push(booking);
    await apartment.save();
    const updatedBooking = await Apartment.findById(id)
      .populate("bookings.roommates.id")
      .populate("landlord", "username email");
    const updatedBookingInformation = updatedBooking.bookings.find(
      (booking) => booking.student.id.toString() === req.user.id
    );
    await Promise.all(
      roommates.map(async (roommate) => {
        const request = new Requests({
          requester: req.user.id,
          requestee: roommate.id,
          apartment: id,
          status: "Pending",
          booking: updatedBookingInformation._id,
        });
        await request.save();
      })
    );

    await NotificationHelper.addNotification({
      receiver: apartment.landlord,
      payload: `You have a new booking request on your apartment: ${apartment.title}`,
      type: "Booking",
    });
    return res.status(201).json({
      message: "Booking added successfully",
      booking,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to add booking: " + error.message,
    });
  }
};

getAvailableApartments = async (req, res) => {
  try {
    const id = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    const today = new Date();

    const availableApartments = await Apartment.aggregate([
      { $match: { landlord: toMongoID(id) } },
      {
        $addFields: {
          hasActiveBooking: {
            $anyElementTrue: {
              $map: {
                input: { $ifNull: ["$bookings", []] },
                as: "booking",
                in: {
                  $and: [
                    { $eq: ["$$booking.status", "Approved"] },
                    { $lte: ["$$booking.checkIn", today] },
                    { $gte: ["$$booking.checkOut", today] },
                  ],
                },
              },
            },
          },
        },
      },
      { $match: { hasActiveBooking: false } },
      { $skip: skip },
      { $limit: parseInt(limit, 10) },
    ]);

    const countDocuments = await Apartment.aggregate([
      { $match: { landlord: toMongoID(id) } },
      {
        $addFields: {
          hasActiveBooking: {
            $anyElementTrue: {
              $map: {
                input: { $ifNull: ["$bookings", []] },
                as: "booking",
                in: {
                  $and: [
                    { $eq: ["$$booking.status", "Approved"] },
                    { $lte: ["$$booking.checkIn", today] },
                    { $gte: ["$$booking.checkOut", today] },
                  ],
                },
              },
            },
          },
        },
      },
      { $match: { hasActiveBooking: false } },
      { $count: "total" },
    ]);
    return res.status(200).json({
      appartments: availableApartments,
      total: countDocuments[0]?.total ?? 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: `Failed to fetch available apartments: ${error.message}`,
    });
  }
};

const updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.amenities = updates.amenities
      .split(",")
      .map((amenity) => amenity.trim());

    const apartment = await Apartment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    await NotificationHelper.addNotification(
      {
        receiver: apartment.landlord,
        payload:
          `Listed Apartment updated with the title: ${apartment.title} ` +
          JSON.stringify(updates),
        type: "New Apartment",
      },
      true
    );
    return res.status(200).json({
      message: "Apartment updated successfully",
      apartment,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update apartment: " + error.message,
    });
  }
};

const deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findByIdAndDelete(id);

    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    return res.status(200).json({ message: "Apartment deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete apartment: " + error.message,
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const review = {
      student: {
        id: req.user.id,
        username: req.user.username,
      },
      rating,
      comment,
    };

    const existingReview = apartment.reviews.find(
      (review) => review.student.id.toString() === req.user._id.toString()
    );
    if (existingReview) {
      return res.status(400).json({ message: "Review already exists" });
    }

    apartment.reviews.push(review);
    await apartment.save();
    await NotificationHelper.addNotification({
      receiver: apartment.landlord,
      payload: `You have a new review on your apartment: ${apartment.title}`,
      type: "Review",
    });
    return res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to add review: " + error.message,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id).populate(
      "reviews.student",
      "username email"
    );

    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    return res.status(200).json(apartment.reviews);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch reviews: " + error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { apartmentId, reviewId } = req.params;

    const apartment = await Apartment.findById(apartmentId);

    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const user = await getUserById(req.user.id);
    if (user.userType !== "landlord") {
      const review = apartment.reviews.find(
        (review) => review._id.toString() === reviewId
      );
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      if (review.student.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    apartment.reviews = apartment.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    await apartment.save();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete review: " + error.message,
    });
  }
};

const fetchBookingDetails = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const apartment = await Apartment.findById(apartmentId).populate(
      "bookings.roommates.id"
    );
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const booking = apartment.bookings.find(
      (booking) => booking.student.id.toString() === req.user.id
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const roommates = booking.roommates.map((roommate) => {
      return {
        ...roommate.id.toJSON(),
        id: roommate.id._id.toString(),
        status: roommate.status,
      };
    });
    return res.status(200).json({
      ...booking.toJSON(),
      roommates,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch booking details: " + error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { apartmentId, bookingId } = req.params;
    const { status } = req.body;
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const booking = apartment.bookings.find(
      (booking) => booking._id.toString() === bookingId
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = status;
    await apartment.save();
    return res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update booking: " + error.message,
    });
  }
};

const updateBookingInformation = async (req, res) => {
  try {
    const { apartmentId, bookingId } = req.params;
    const { checkIn, checkOut, roommates } = req.body;
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const booking = apartment.bookings.find(
      (booking) => booking._id.toString() === bookingId
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.checkIn = checkIn;
    booking.checkOut = checkOut;
    const newRoommates = roommates.filter((roommate) => {
      return !booking.roommates.some((rm) => rm.id.toString() === roommate.id);
    });
    booking.roommates = roommates.map((roommate) => {
      return omit(roommate, ["status"]);
    });
    booking.status = "Pending";
    await apartment.save();
    await Promise.all(
      newRoommates.map(async (roommate) => {
        const existingRequest = await Requests.findOne({
          requester: req.user.id,
          requestee: roommate.id,
          apartment: apartmentId,
          booking: bookingId,
        });
        if (existingRequest) {
          existingRequest.status = "Pending";
          await existingRequest.save();
        } else {
          const request = new Requests({
            requester: req.user.id,
            requestee: roommate.id,
            apartment: apartmentId,
            status: "Pending",
            booking: bookingId,
          });
          await request.save();
        }
      })
    );
    return res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to update booking: " + error.message,
    });
  }
};

getBookings = async (req, res) => {
  try {
    let findOptions = {};
    if (req.user.userType === "landlord") {
      findOptions = { landlord: toMongoID(req.user.id) };
    } else {
      findOptions = { "bookings.student.id": toMongoID(req.user.id) };
    }
    const apartments = await Apartment.find(findOptions)
      .populate("bookings.roommates.id")
      .populate("landlord", "username email");
    if (apartments.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    let fetchedBookings = [];
    apartments.forEach((apartment) => {
      const bookings =
        req.user.userType === "student"
          ? apartment.bookings.filter(
              (booking) => booking.student.id.toString() === req.user.id
            )
          : apartment.bookings;

      const modifiedBookings = bookings.map((booking) => {
        const roommates = booking.roommates.map((roommate) => {
          return {
            ...roommate.id.toJSON(),
            id: roommate.id._id.toString(),
            status: roommate.status,
          };
        });
        allRoommatesNotPending = roommates.every(
          (roommate) => roommate.status !== "Pending"
        );
        return {
          ...omit(apartment.toJSON(), ["bookings"]),
          apartmentId: apartment._id.toString(),
          ...booking.toJSON(),
          roomatesConfirmed: allRoommatesNotPending,
          roommates,
        };
      });
      fetchedBookings = [...fetchedBookings, ...modifiedBookings];
    });
    return res.status(200).json(fetchedBookings);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch booking: " + error.message,
    });
  }
};

module.exports = {
  createApartment,
  getApartments,
  getApartmentById,
  updateApartment,
  deleteApartment,
  addReview,
  getReviews,
  deleteReview,
  addImages,
  getAvailableApartments,
  getBookedAppartments,
  addBooking,
  updateBookingStatus,
  fetchBookingDetails,
  updateBookingInformation,
  getBookings,
};
