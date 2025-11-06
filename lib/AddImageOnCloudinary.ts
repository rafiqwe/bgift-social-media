import cloudinary from "cloudinary";

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: string;
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const AddImageOnCloudinary = async (Image: File) => {
  const bytes = await Image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "bgift-image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );

      uploadStream.end(buffer); // ✅ send Buffer
    }
  );

  return uploadResult.secure_url;
};
