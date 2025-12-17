import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";

const storage = multer.memoryStorage();

export const profileUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

const bucket = "interverse-user-profile-images";

export const profileUploadToR2 = async (file: Express.Multer.File) => {
  const key = `profiles/${Date.now()}_${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await r2.send(command);

  return `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
};

export const deleteProfileFromR2 = async (profileUrl: string) => {
  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  if (!publicDomain || !profileUrl.startsWith(publicDomain)) {
    return;
  }

  const key = profileUrl.replace(`${publicDomain}/`, "");

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await r2.send(command);
};
