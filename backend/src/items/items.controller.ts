import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  /**
   * Get paginated items
   * Uses PaginationDto for validated query parameters
   * Max limit is 100 to prevent performance issues
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.itemsService.findAll(paginationDto.page, paginationDto.limit);
  }
}
