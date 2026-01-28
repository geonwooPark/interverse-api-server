import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AssetsService } from "./assets.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ResponseMessage } from "../../common/decorators/response-message.decorator";
import { CreateMapDto } from "./dto/create-map.dto";
import { CreateCharacterDto } from "./dto/create-character.dto";
import {
  MapListResponseDto,
  MapWithMessageResponseDto,
} from "./dto/map-list-response.dto";
import {
  CharacterListResponseDto,
  CharacterWithMessageResponseDto,
} from "./dto/character-list-response.dto";

@ApiTags("Assets")
@Controller("assets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("bearerAuth")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get("maps")
  @ApiOperation({ summary: "모든 맵 리스트 조회" })
  @ApiResponse({
    status: 200,
    description: "맵 리스트 반환",
    type: MapListResponseDto,
  })
  @ResponseMessage("성공적으로 맵 리스트를 가져왔습니다.")
  async getMaps() {
    return await this.assetsService.getMaps();
  }

  @Post("maps")
  @ApiOperation({ summary: "새 맵 생성" })
  @ApiResponse({
    status: 200,
    description: "맵 생성 성공",
    type: MapWithMessageResponseDto,
  })
  @ResponseMessage("성공적으로 맵을 생성했습니다.")
  async createMap(@Body() createMapDto: CreateMapDto) {
    return await this.assetsService.createMap(createMapDto);
  }

  @Get("characters")
  @ApiOperation({ summary: "모든 캐릭터 리스트 조회" })
  @ApiResponse({
    status: 200,
    description: "캐릭터 리스트 반환",
    type: CharacterListResponseDto,
  })
  @ResponseMessage("성공적으로 캐릭터 리스트를 가져왔습니다.")
  async getCharacters() {
    return await this.assetsService.getCharacters();
  }

  @Post("characters")
  @ApiOperation({ summary: "새 캐릭터 생성" })
  @ApiResponse({
    status: 200,
    description: "캐릭터 생성 성공",
    type: CharacterWithMessageResponseDto,
  })
  @ResponseMessage("성공적으로 캐릭터를 생성했습니다.")
  async createCharacter(@Body() createCharacterDto: CreateCharacterDto) {
    return await this.assetsService.createCharacter(createCharacterDto);
  }
}
