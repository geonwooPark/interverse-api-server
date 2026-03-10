import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { RoomsModule } from "./rooms/rooms.module";
import { AssetsModule } from "./assets/assets.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "local"}`,
    }),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY"),
        signOptions: { expiresIn: "30m" },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    RoomsModule,
    AssetsModule,
  ],
})
export class AppModule {}
