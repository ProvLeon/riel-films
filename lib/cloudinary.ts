import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use https
});

const CLOUDINARY_UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'riel-films-uploads';

// Function to upload a file buffer using a stream
export const uploadImageStream = (buffer: Buffer, filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_UPLOAD_FOLDER,
        public_id: filename.substring(0, filename.lastIndexOf('.')) || filename, // Use filename without extension as public_id
        overwrite: true, // Overwrite if file with same public_id exists
        // Add any transformations or tags if needed
        // tags: ['website-upload'],
        // transformation: [{ width: 1200, height: 630, crop: "limit" }], // Example transformation
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload failed, no result returned."));
        }
        resolve(result);
      }
    );

    // Pipe the buffer to the upload stream
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export { cloudinary };
