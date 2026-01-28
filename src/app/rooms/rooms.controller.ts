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
import type { JwtPayload } from "../../common/decorators/user.decorator";
import { ResponseMessage } from "../../common/decorators/response-message.decorator";
import { CreateRoomDto } from "./dto/create-room.dto";
import { CheckPasswordDto } from "./dto/check-password.dto";
import { GetRoomsQueryDto } from "./dto/get-rooms-query-dto";
import { GetRoomsResponseDto } from "./dto/get-rooms-response.dto";
import { RoomWithMessageResponseDto } from "./dto/room-with-message-response.dto";
import { SuccessResponseDto } from "./dto/success-response.dto";

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
  @ApiResponse({
    status: 200,
    description: "참여한 방 리스트 반환",
    type: GetRoomsResponseDto,
  })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ResponseMessage("참여한 방 리스트입니다.")
  async getRooms(@User() user: JwtPayload, @Query() query: GetRoomsQueryDto) {
    return this.roomsService.getRooms(user.id, query.page, query.limit);
  }

  @Get(":roomId")
  @ApiOperation({ summary: "특정 방의 정보 조회" })
  @ApiResponse({
    status: 200,
    description: "방 정보 조회 성공",
    type: RoomWithMessageResponseDto,
  })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ApiResponse({ status: 404, description: "방을 찾을 수 없음" })
  @ResponseMessage("방 정보를 성공적으로 가져왔습니다.")
  async getSingleRoom(
    @Param("roomId") roomId: string,
    @User() user: JwtPayload,
  ) {
    return await this.roomsService.getSingleRoom(roomId, user.id);
  }

  @Post()
  @ApiOperation({ summary: "방 생성" })
  @ApiResponse({
    status: 201,
    description: "방 생성 성공",
    type: RoomWithMessageResponseDto,
  })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiResponse({ status: 401, description: "인증 실패" })
  @ResponseMessage("함께할 준비 되셨나요? 새로운 방이 시작됐어요!")
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @User() user: JwtPayload,
  ) {
    return await this.roomsService.createRoom(createRoomDto, user.id);
  }

  @Post(":roomId/join")
  @ApiOperation({ summary: "방 입장" })
  @ApiResponse({
    status: 200,
    description: "방 입장 성공",
    type: RoomWithMessageResponseDto,
  })
  @ApiResponse({ status: 404, description: "방을 찾을 수 없음" })
  @ResponseMessage("방에 입장했습니다.")
  async joinRoom(@Param("roomId") roomId: string, @User() user: JwtPayload) {
    return await this.roomsService.joinRoom(roomId, user.id);
  }

  @Delete(":roomId")
  @ApiOperation({ summary: "방 삭제" })
  @ApiResponse({
    status: 200,
    description: "방 삭제 성공",
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 403, description: "삭제 권한 없음" })
  @ApiResponse({ status: 404, description: "방 없음" })
  @ResponseMessage("방이 성공적으로 삭제되었습니다.")
  async deleteRoom(@Param("roomId") roomId: string, @User() user: JwtPayload) {
    return await this.roomsService.deleteRoom(roomId, user.id);
  }

  @Post(":roomId/check-password")
  @ApiOperation({ summary: "방 비밀번호 확인" })
  @ApiResponse({
    status: 200,
    description: "비밀번호 확인 성공",
    type: SuccessResponseDto,
  })
  @ApiResponse({ status: 404, description: "방 없음" })
  @ApiResponse({ status: 409, description: "비밀번호 불일치" })
  @ResponseMessage("비밀번호가 일치합니다.")
  async checkPassword(
    @Param("roomId") roomId: string,
    @Body() dto: CheckPasswordDto,
  ) {
    return await this.roomsService.checkPassword(roomId, dto);
  }
}
