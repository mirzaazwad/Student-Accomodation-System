const router = require("express").Router();

const {
  changePassword,
  roommateInformation,
  addProfilePicture,
  addFavoriteAppartment,
  getUser,
} = require("../controllers/user.controller");
const { roleMiddleware } = require("../middlewares/role.middleware");
const { withSingleFile } = require("../middlewares/storage.middleware");

router.patch("/change-password", changePassword);
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
router.get("/fetch", getUser);

module.exports = router;
