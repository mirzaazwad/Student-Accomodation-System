const Apartment = require("../models/appartment.model");
const { getUserById } = require("../controllers/user.controller");
const { toMongoID } = require("../utils/Helper");

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
      amenities,
      images,
    });
    await apartment.save();
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
    const images = req.files.map((file) => file.path);
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
      findOptions.$or = [
        { title: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
        { "landlord.username": { $regex: search, $options: "i" } },
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

    // Count the total matching documents
    const total = await Apartment.countDocuments(findOptions);

    // Respond with the results
    res.json({ success: true, apartments, total });
  } catch (error) {
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
      "username email"
    );
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    const bookings = apartment.bookings;
    apartment.availabilityStatus = "Available";
    if (bookings.length > 0) {
      const today = new Date();
      for (const booking of bookings) {
        if (booking.status === "Approved") {
          if (today >= booking.checkIn && today <= booking.checkOut) {
            apartment.availabilityStatus = "Occupied";
            break;
          }
        }
      }
    }
    return res.status(200).json(apartment);
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

    const apartment = await Apartment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

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
};
