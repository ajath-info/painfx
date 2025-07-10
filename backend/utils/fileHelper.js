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
    const filePath = path.join("public", image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn("Error deleting image:", err.message);
  }
};
