import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AssetsService } from "./assets.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CreateMapDto } from "./dto/create-map.dto";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { successResponse } from "../../common/dto/response.dto";

@ApiTags("Assets")
@Controller("assets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("bearerAuth")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get("maps")
  @ApiOperation({ summary: "모든 맵 리스트 조회" })
  @ApiResponse({ status: 200, description: "맵 리스트 반환" })
  async getMaps() {
    const maps = await this.assetsService.getMaps();
    return successResponse("성공적으로 맵 리스트를 가져왔습니다.", maps);
  }

  @Post("maps")
  @ApiOperation({ summary: "새 맵 생성" })
  @ApiResponse({ status: 200, description: "맵 생성 성공" })
  async createMap(@Body() createMapDto: CreateMapDto) {
    const map = await this.assetsService.createMap(createMapDto);
    return successResponse("성공적으로 맵을 생성했습니다.", map);
  }

  @Get("characters")
  @ApiOperation({ summary: "모든 캐릭터 리스트 조회" })
  @ApiResponse({ status: 200, description: "캐릭터 리스트 반환" })
  async getCharacters() {
    const characters = await this.assetsService.getCharacters();
    return successResponse(
      "성공적으로 캐릭터 리스트를 가져왔습니다.",
      characters
    );
  }

  @Post("characters")
  @ApiOperation({ summary: "새 캐릭터 생성" })
  @ApiResponse({ status: 200, description: "캐릭터 생성 성공" })
  async createCharacter(@Body() createCharacterDto: CreateCharacterDto) {
    const character = await this.assetsService.createCharacter(
      createCharacterDto
    );
    return successResponse("성공적으로 캐릭터를 생성했습니다.", character);
  }
}
