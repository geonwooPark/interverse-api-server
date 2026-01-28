import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

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
  // 원본 파일 확장자 추출
  const originalName = file.originalname;
  const extension =
    originalName.substring(originalName.lastIndexOf(".")) || ".jpg";
  const isPng = extension.toLowerCase() === ".png";

  // 이미지 리사이징 및 최적화 (원본 비율 유지)
  const resizedImage = await sharp(file.buffer)
    .resize(400, 400, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat(isPng ? "png" : "jpeg", { quality: 80 })
    .toBuffer();

  const key = `profiles/${uuidv4()}${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: resizedImage,
    ContentType: isPng ? "image/png" : "image/jpeg",
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
