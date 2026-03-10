import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

export const profileMulterOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
};
