import { ResponseModal } from './../Response/response.modal';
import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async searchVideo(@Query('content') content: string) {
        const result = await this.searchService.findVideo(content);
        this.searchService.buildTrieByWord('', '63e47000ec74d155d9f84459', 'root', content);
        return new ResponseModal(200, 'success', result);
    }
}
