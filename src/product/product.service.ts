import { Injectable } from '@nestjs/common';
import { productInsertSchema } from './product.schema';
import z from 'zod';

@Injectable()
export class ProductService {
  async createProduct(product: z.infer<typeof productInsertSchema>) {
    return product;
  }
}
