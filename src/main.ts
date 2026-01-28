import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import cookieParser from "cookie-parser";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  const allowedOrigins = process.env.FRONTEND_URL;
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Cookie parser
  app.use(cookieParser());

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("INTERVERSE API SERVER V1")
    .setDescription("INTERVERSE API Documentation")
    .setVersion("1.0.0")
    .addServer(process.env.DOMAIN || "http://localhost:8000")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "bearerAuth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
  });
  SwaggerModule.setup("api-docs", app, document);

  // JSON 문서를 /api-docs/.json 경로로 노출
  app.use("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(document);
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.log(`${port}PORT 실행중..`);
  console.log(
    `📘 Swagger UI: ${process.env.DOMAIN || "http://localhost:8000"}/api-docs`
  );
}

bootstrap();
