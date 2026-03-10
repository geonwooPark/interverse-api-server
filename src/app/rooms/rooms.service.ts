import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import * as bcryptjs from "bcryptjs";
import dayjs from "../../utils/dayjs";
import { CreateRoomDto } from "./dto/create-room.dto";
import { CheckPasswordDto } from "./dto/check-password.dto";

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async getRooms(userId: string, page: number = 1, limit: number = 6) {
    const skip = (page - 1) * limit;

    const totalCount = await this.prisma.roomLog.count({
      where: { userId },
    });

    const logs = await this.prisma.roomLog.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            map: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
      skip,
      take: limit,
    });

    return {
      logs,
      metadata: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async getSingleRoom(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        map: true,
      },
    });

    if (!room) {
      throw new NotFoundException("방을 찾을 수 없습니다.");
    }

    const isHost = room.host === userId;

    return {
      ...room,
      isHost,
    };
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        map: true,
      },
    });

    if (!room) {
      throw new NotFoundException("방을 찾을 수 없습니다.");
    }

    const existingLog = await this.prisma.roomLog.findFirst({
      where: { userId, roomId },
    });

    if (existingLog) {
      await this.prisma.roomLog.update({
        where: { id: existingLog.id },
        data: { joinedAt: new Date() },
      });
    } else {
      await this.prisma.roomLog.create({
        data: {
          userId,
          roomId,
          joinedAt: new Date(),
        },
      });
    }

    return room;
  }

  async createRoom(createRoomDto: CreateRoomDto, userId: string) {
    const { title, password, headCount, mapSrc } = createRoomDto;

    const hashedPassword = await bcryptjs.hash(password, 8);

    const map = await this.prisma.map.findFirst({
      where: { mapSrc },
    });

    if (!map) {
      throw new BadRequestException("맵을 찾을 수 없습니다.");
    }

    const newRoom = await this.prisma.room.create({
      data: {
        title,
        headCount,
        mapId: map.id,
        host: userId,
        credential: {
          create: {
            password: hashedPassword,
          },
        },
      },
      include: {
        map: true,
      },
    });

    await this.prisma.roomLog.create({
      data: {
        userId,
        roomId: newRoom.id,
      },
    });

    return newRoom;
  }

  async deleteRoom(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException("해당 방을 찾을 수 없습니다.");
    }

    if (userId !== room.host) {
      throw new ForbiddenException("해당 방을 삭제할 권한이 없습니다.");
    }

    await this.prisma.$transaction([
      this.prisma.room.delete({ where: { id: roomId } }),
      this.prisma.roomCredential.deleteMany({ where: { roomId } }),
      this.prisma.roomLog.deleteMany({ where: { roomId } }),
    ]);

    return true;
  }

  async checkPassword(roomId: string, dto: CheckPasswordDto) {
    const { password } = dto;

    const roomCredential = await this.prisma.roomCredential.findUnique({
      where: { roomId },
    });

    if (!roomCredential) {
      throw new NotFoundException("방을 찾을 수 없습니다.");
    }

    const pwcheck = await bcryptjs.compare(password, roomCredential.password);
    if (!pwcheck) {
      throw new ConflictException("비밀번호가 일치하지 않습니다.");
    }

    return true;
  }

  @Cron("0 0 * * *", { timeZone: "Asia/Seoul" })
  async handleStaleRoomsCron() {
    const sevenDaysAgo = dayjs().subtract(7, "day").toDate();

    const staleRooms = await this.prisma.room.findMany({
      where: { createdAt: { lt: sevenDaysAgo } },
    });

    const toDeleteIds = staleRooms.map((r) => r.id);

    if (toDeleteIds.length === 0) {
      return;
    }

    await this.prisma.room.deleteMany({
      where: { id: { in: toDeleteIds } },
    });

    console.log(
      `[Rooms Cron] Deleted ${toDeleteIds.length} room(s) older than 7 days.`,
    );
  }
}
