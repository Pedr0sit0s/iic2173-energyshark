import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryHistoryDto } from './dto/query-history.dto';
import { History } from './history.entity';
import { HistoryPage, HistoryService } from './history.service';
import { InternalTokenGuard } from './internal-token.guard';

@Controller()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(InternalTokenGuard)
  create(@Body() dto: CreateEventDto): Promise<History> {
    return this.historyService.create(dto);
  }

  @Get('history')
  findAll(@Query() query: QueryHistoryDto): Promise<HistoryPage> {
    return this.historyService.findAll(query);
  }

  @Get('history/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<History> {
    return this.historyService.findOne(id);
  }
}
