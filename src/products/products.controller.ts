import { Controller, Post, Body, Get, Patch, Param, Delete } from '@nestjs/common';
import { Product } from './products.modal';
import { ProductsService } from './products.services';

@Controller('products')
export class ProductsController {
    constructor(private readonly ProductsService: ProductsService) {}
    @Post()
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') prodDes: string,
        @Body('price') prodPrice: number,
    ): Promise<any> {
        const generatedId: string = await this.ProductsService.insertProduct(
            prodTitle,
            prodDes,
            prodPrice,
        );
        return {
            id: generatedId,
        };
    }

    @Get()
    async getAllProducts() {
        const products = await this.ProductsService.getProducts();
        return products;
    }

    @Get(':id')
    async getProduct(@Param('id') prodId: string) {
        return { product: await this.ProductsService.getSingleProduct(prodId) };
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body('title') title: string,
        @Body('description') desc: string,
        @Body('price') price: number,
    ) {
        await this.ProductsService.updateProduct(prodId, title, desc, price);
        return null;
    }

    @Delete(':id')
    async removeProduct(@Param('id') prodId: string) {
        await this.ProductsService.deleteProduct(prodId);
        return null;
    }
}
