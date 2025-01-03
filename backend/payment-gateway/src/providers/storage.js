const cloudinary = require("cloudinary").v2;
// type UploadApiResponse {
//     public_id: string;
//     url: string;
//     secure_url: string;
// }
class StorageService {
  cloudinaryInstance = null;
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.cloudinaryInstance = cloudinary;
  }
  /**
   * Upload file to Cloudinary
   * @param {File} file - The file to upload
   * @returns {Promise<object>} UploadApiResponse - The Cloudinary upload result
   */
  async upload(file) {
    return new Promise((resolve, reject) => {
      file
        .arrayBuffer()
        .then((arrayBuffer) => {
          const fileBuffer = Buffer.from(arrayBuffer);

          const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(new Error(`Cloudinary upload failed: ${error.message}`));
              } else {
                resolve(result);
              }
            }
          );

          uploadStream.end(fileBuffer);
        })
        .catch((error) => {
          reject(
            new Error(`File conversion to buffer failed: ${error.message}`)
          );
        });
    });
  }

  async uploadFromPath(filePath) {
    return new Promise((resolve, reject) => {
      this.cloudinaryInstance.uploader.upload(filePath, (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Generate an optimized URL for a file stored in Cloudinary
   * @param {string} fileKey - The file public ID in Cloudinary
   * @returns {string} - The optimized URL
   */
  getUrlByFileKey = (fileKey) => {
    const optimizeUrl = this.cloudinaryInstance.url(fileKey, {
      fetch_format: "auto",
      quality: "auto",
    });
    return optimizeUrl;
  };

  static getInstance() {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }
}

const StorageClient = StorageService.getInstance();

module.exports = StorageClient;
