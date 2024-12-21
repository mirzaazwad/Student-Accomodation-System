const Apartment = require("../models/appartment.model");
const User = require("../models/user.model");

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
    console.log(apartment);
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
    const apartments = await Apartment.find().populate(
      "landlord",
      "username email"
    );
    return res.status(200).json(apartments);
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
    return res.status(200).json(apartment);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch apartment: " + error.message,
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
      student: req.user._id,
      rating,
      comment,
    };

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

    if (req.user.userType !== "landlord") {
      const student = await User.findById(req.user._id);
      const review = apartment.reviews.find(
        (review) => review._id.toString() === reviewId
      );
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      if (review.student.toString() !== student._id.toString()) {
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
};
