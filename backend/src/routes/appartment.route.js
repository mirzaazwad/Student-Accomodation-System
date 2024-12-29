const router = require("express").Router();
const {
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
} = require("../controllers/apartment.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");
const { withMultipleFiles } = require("../middlewares/storage.middleware");

router.post("/create", roleMiddleware("landlord"), createApartment);

router.patch(
  "/images/:id",
  roleMiddleware("landlord"),
  withMultipleFiles("files", ["image/jpeg", "image/png"]),
  addImages
);

router.get("/", getApartments);

router.get("/:id", getApartmentById);

router.put("/:id", roleMiddleware("landlord"), updateApartment);

router.delete("/:id", roleMiddleware("landlord"), deleteApartment);

router.post("/:id/review", roleMiddleware("student"), addReview);

router.get("/:id/reviews", getReviews);

router.delete("/:apartmentId/reviews/:reviewId", deleteReview);

router.get(
  "/fetch/available",
  roleMiddleware("landlord"),
  getAvailableApartments
);
router.get("/fetch/booked", roleMiddleware("landlord"), getBookedAppartments);

module.exports = router;
