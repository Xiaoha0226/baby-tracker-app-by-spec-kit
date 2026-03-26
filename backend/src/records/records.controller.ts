import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { RecordFilterDto } from './dto/record-filter.dto';
import { RecordType } from './entities/baby-record.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('记录管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({ summary: '创建记录' })
  async create(@Body() dto: CreateRecordDto, @Request() req) {
    const userId = req.user.userId;
    return this.recordsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取记录列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量' })
  @ApiQuery({ name: 'type', required: false, enum: RecordType, description: '记录类型' })
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期 (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期 (YYYY-MM-DD)' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: '排序方式' })
  async findAll(
    @Request() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) filterDto: RecordFilterDto,
  ) {
    const userId = req.user.userId;
    return this.recordsService.findAll({
      userId,
      page: filterDto.page,
      limit: filterDto.limit,
      type: filterDto.type,
      startDate: filterDto.startDate ? new Date(filterDto.startDate) : undefined,
      endDate: filterDto.endDate ? new Date(filterDto.endDate) : undefined,
      sortOrder: filterDto.sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单条记录' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新记录' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateRecordDto>,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.recordsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除记录' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.userId;
    return this.recordsService.remove(userId, id);
  }
}
