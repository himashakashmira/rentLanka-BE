import { Request, Response } from "express";
import { supabase, SUPABASE_BUCKET } from "../config/supabase";

// upload image to supabase storage bucket
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!supabase) {
      res.status(500).json({ success: false, message: "Supabase storage is not configured." });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "No image file provided." });
      return;
    }

    // make unique filename
    const fileExt = file.originalname.split(".").pop() || "jpg";
    const cleanExt = fileExt.replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${cleanExt}`;
    const filePath = `items/${fileName}`;

    // upload file buffer to supabase storage
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype || "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage upload error:", error);
      throw error;
    }

    // get public url from supabase
    const { data: urlData } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully to Supabase",
      imageUrl: urlData.publicUrl,
      path: filePath,
    });
  } catch (err: any) {
    console.error("Upload controller exception:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to upload image to Supabase Storage",
    });
  }
};
