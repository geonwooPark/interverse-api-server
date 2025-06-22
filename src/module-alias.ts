import { addAliases } from "module-alias";
import path from "path";

addAliases({
  "@controllers": path.join(__dirname, "controllers"),
  "@db": path.join(__dirname, "db"),
  "@dto": path.join(__dirname, "dto"),
  "@errors": path.join(__dirname, "errors"),
  "@middlewares": path.join(__dirname, "middlewares"),
  "@models": path.join(__dirname, "models"),
  "@routers": path.join(__dirname, "routers"),
  "@utils": path.join(__dirname, "utils"),
});
