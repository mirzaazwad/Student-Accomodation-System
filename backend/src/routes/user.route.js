const router = require("express").Router();

const {
  changePassword,
  roommateInformation,
  addProfilePicture,
  addFavoriteAppartment,
} = require("../controllers/user.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");
const { withSingleFile } = require("../middlewares/storage.middleware");

router.post("/change-password", changePassword);
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
