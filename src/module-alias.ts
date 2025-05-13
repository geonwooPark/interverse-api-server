import { addAliases } from "module-alias";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

// 기준 디렉토리 (빌드 후엔 __dirname이 dist 기준임)
const baseDir = isProd ? path.resolve(__dirname, "..") : __dirname;

addAliases({
  "@controllers": path.join(baseDir, "controllers"),
  "@db": path.join(baseDir, "db"),
  "@dto": path.join(baseDir, "dto"),
  "@errors": path.join(baseDir, "errors"),
  "@middlewares": path.join(baseDir, "middlewares"),
  "@models": path.join(baseDir, "models"),
  "@routers": path.join(baseDir, "routers"),
  "@utils": path.join(baseDir, "utils"),
});
