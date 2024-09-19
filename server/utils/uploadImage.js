const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const uploadImage = async (req) => {
  try {
    cloudinary.config({
      cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
      api_key: `${process.env.CLOUDINARY_API_KEY}`,
      api_secret: `${process.ENV.CLOUDINARY_API_SECRET}`,
    });
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        })
        .end(req.files.image.data);
    });
    // uploadResult.secure_url contains unique URL created by cloudinary for the image
    // return uploadResult.secure_url;
    const imageUrl = uploadResult.secure_url;
    return imageUrl;
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = uploadImage;
