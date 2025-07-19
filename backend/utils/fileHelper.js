import path from "path";
import fs from "fs";

const UPLOAD_DIR = "public/uploads/";

export const uploadImage = async (file, prefix = "img") => {
  const ext = path.extname(file.name);
  const fileName = `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  await file.mv(filePath);

  return `/uploads/${fileName}`;
};

export const deleteImage = (image_url) => {
  try {
    if (!image_url || typeof image_url !== "string") return;

    // Handle image_url starting with '/'
    const cleanedPath = image_url.startsWith("/") ? image_url.slice(1) : image_url;
    const filePath = path.resolve("public", cleanedPath);

    // console.log("Trying to delete:", filePath);

    if (fs.existsSync(filePath)) {
      const stat = fs.lstatSync(filePath);
      if (stat.isFile()) {
        fs.unlinkSync(filePath);
        // console.log("Deleted image:", filePath);
      } else {
        console.warn("Not a file:", filePath);
      }
    } else {
      console.warn("File not found:", filePath);
    }
  } catch (err) {
    console.warn("Error deleting image:", err.message);
  }
};
