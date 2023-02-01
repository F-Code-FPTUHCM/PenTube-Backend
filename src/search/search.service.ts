import { SearchRepository } from './search.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
    constructor(private readonly searchRepository: SearchRepository) {}
}
