import { Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async searchVideo(@Query('content') content: string) {
        const result = await this.searchService.findVideo(content);
    }
}
