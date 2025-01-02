const router = require("express").Router();

const {
  changePassword,
  roommateInformation,
  addProfilePicture,
  addFavoriteAppartment,
  getUser,
  updateProfile,
  removeFromFavorites,
  fetchNotificationCount,
  findRoommates,
} = require("../controllers/user.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");
const { withSingleFile } = require("../middlewares/storage.middleware");
const { validateRequest } = require("../middlewares/validation.middleware");
const { changePasswordSchema } = require("../validation/user.validation");

router.patch(
  "/change-password",
  validateRequest(changePasswordSchema),
  changePassword
);
router.post(
  "/roommate-information",
  roleMiddleware("student"),
  roommateInformation
);
router.post(
  "/add-profile-picture",
  withSingleFile("file", ["image/jpeg", "image/png"]),
  addProfilePicture
);
router.post(
  "/add-favorite-apartment",
  roleMiddleware("student"),
  addFavoriteAppartment
);
router.post(
  "/remove-favorite-apartment",
  roleMiddleware("student"),
  removeFromFavorites
);
router.patch("/update-profile", updateProfile);
router.get("/fetch", getUser);
router.get("/notification-count", fetchNotificationCount);
router.post("/roommates", findRoommates);

module.exports = router;
