import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMapDto } from './dto/create-map.dto';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async getMaps() {
    return this.prisma.map.findMany();
  }

  async createMap(createMapDto: CreateMapDto) {
    return this.prisma.map.create({
      data: createMapDto,
    });
  }

  async getCharacters() {
    return this.prisma.character.findMany();
  }

  async createCharacter(createCharacterDto: CreateCharacterDto) {
    return this.prisma.character.create({
      data: createCharacterDto,
    });
  }
}

