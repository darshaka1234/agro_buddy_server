import { Body, Controller, Post } from '@nestjs/common';
import { productInsertSchema } from './product.schema';
import type { createProductDto } from './product.schema';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  async createProduct(@Body() body: createProductDto) {
    const validatedBody = productInsertSchema.parse(body);
    const result = await this.productService.createProduct(validatedBody);
    return result;
  }
}
