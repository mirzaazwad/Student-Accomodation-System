const { randomBytes } = require("crypto");
const multer = require("multer");
const { ApiError } = require("../utils/ApiError");

const localFileUploadStorage = multer.diskStorage({
  destination: "upload",
  filename(req, file, callback) {
    const extension = file.originalname.split(".").pop();
    const uuid = randomBytes(12).toString("hex");
    const fileName = `file-${uuid}.${extension}`;
    callback(null, fileName);
  },
});

const createFileFilter = (allowedMimeTypes) => {
  return (req, file, callback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new ApiError(
          400,
          `${
            file.mimetype
          } file type is not allowed, please upload a file of type ${allowedMimeTypes.join(
            ", "
          )}`
        )
      );
    }
  };
};

const withSingleFile = (name, allowedMimeTypes) =>
  multer({
    limits: { fileSize: 500 * 1024 * 1024 },
    storage: localFileUploadStorage,
    fileFilter: allowedMimeTypes
      ? createFileFilter(allowedMimeTypes)
      : undefined,
  }).single(name);

const withMultipleFiles = (name, allowedMimeTypes) =>
  multer({
    limits: { fileSize: 500 * 1024 * 1024 },
    storage: localFileUploadStorage,
    fileFilter: allowedMimeTypes
      ? createFileFilter(allowedMimeTypes)
      : undefined,
  }).array(name);

module.exports = { withSingleFile, withMultipleFiles };
