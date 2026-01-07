import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { RoomsService } from "./rooms.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { User } from "../../common/decorators/user.decorator";
import { CreateRoomDto } from "./dto/create-room.dto";
import { CheckPasswordDto } from "./dto/check-password.dto";
import { successResponse } from "../../common/dto/response.dto";

@ApiTags("Rooms")
@Controller("rooms")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("bearerAuth")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: "사용자가 참여한 방 리스트 조회" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 6 })
  @ApiResponse({ status: 200, description: "참여한 방 리스트 반환" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  async getRooms(
    @User() user: any,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const pageNum = parseInt(page || "1") || 1;
    const limitNum = parseInt(limit || "6") || 6;
    const result = await this.roomsService.getRooms(user.id, pageNum, limitNum);
    return successResponse("참여한 방 리스트입니다.", result);
  }

  @Get(":roomId")
  @ApiOperation({ summary: "특정 방의 정보 조회" })
  @ApiResponse({ status: 200, description: "방 정보 조회 성공" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 404, description: "방을 찾을 수 없음" })
  async getSingleRoom(@Param("roomId") roomId: string, @User() user: any) {
    const room = await this.roomsService.getSingleRoom(roomId, user.id);
    return successResponse(`${roomId}방 정보입니다.`, room);
  }

  @Post()
  @ApiOperation({ summary: "방 생성" })
  @ApiResponse({ status: 201, description: "방 생성 성공" })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  async createRoom(@Body() createRoomDto: CreateRoomDto, @User() user: any) {
    const room = await this.roomsService.createRoom(createRoomDto, user.id);
    return successResponse(
      "함께할 준비 되셨나요? 새로운 방이 시작됐어요!",
      room
    );
  }

  @Post(":roomId/join")
  @ApiOperation({ summary: "방 입장" })
  @ApiResponse({ status: 200, description: "방 입장 성공" })
  @ApiResponse({ status: 404, description: "방을 찾을 수 없음" })
  async joinRoom(@Param("roomId") roomId: string, @User() user: any) {
    const room = await this.roomsService.joinRoom(roomId, user.id);
    return successResponse("방에 입장했습니다.", room);
  }

  @Delete(":roomId")
  @ApiOperation({ summary: "방 삭제" })
  @ApiResponse({ status: 200, description: "방 삭제 성공" })
  @ApiResponse({ status: 403, description: "삭제 권한 없음" })
  @ApiResponse({ status: 404, description: "방 없음" })
  async deleteRoom(@Param("roomId") roomId: string, @User() user: any) {
    await this.roomsService.deleteRoom(roomId, user.id);
    return successResponse("방이 성공적으로 삭제되었습니다.", true);
  }

  @Post(":roomId/check-password")
  @ApiOperation({ summary: "방 비밀번호 확인" })
  @ApiResponse({ status: 200, description: "비밀번호 확인 성공" })
  @ApiResponse({ status: 404, description: "방 없음" })
  @ApiResponse({ status: 409, description: "비밀번호 불일치" })
  async checkPassword(
    @Param("roomId") roomId: string,
    @Body() dto: CheckPasswordDto
  ) {
    await this.roomsService.checkPassword(roomId, dto);
    return successResponse("비밀번호가 일치합니다.", true);
  }
}
