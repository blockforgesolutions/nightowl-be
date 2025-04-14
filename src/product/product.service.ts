import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductResponse } from './model/product.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { ProductMessages } from './enums/product.enum';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(ProductModel.name) private productModel: Model<ProductModel>
    ) { }

    async createProduct(product: CreateProductDto): Promise<ProductResponse> {
        const newProduct = await this.productModel.create(product);

        const transformedProduct = transformMongoData(newProduct, ProductResponse);
        return transformedProduct;
    }

    async getProducts(): Promise<ProductResponse[]> {
        const products = await this.productModel.find().lean();

        const transformedProducts = transformMongoArray<ProductModel, ProductResponse>(products);

        return transformedProducts;
    }

    async getProductById(productId: string): Promise<ProductResponse> {
        const product = await this.productModel.findById(productId);

        if (!product) {
            throw new HttpException(ProductMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const transformedProduct = transformMongoData(product, ProductResponse);

        return transformedProduct
    }

    async getProductsByCategory(category: string): Promise<ProductResponse[]> {
        const products = await this.productModel.find({ category: category });

        const transformedProducts = transformMongoArray<ProductModel, ProductResponse>(products);

        return transformedProducts;
    }

    async getProductsByClub(clubId: string): Promise<ProductResponse[]> {
        const products = await this.productModel.find({ club: clubId });

        const transformedProducts = transformMongoArray<ProductModel, ProductResponse>(products);

        return transformedProducts;
    }

    async updateProduct(productId: string, product: UpdateProductDto): Promise<ProductResponse> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(productId, product, { new: true });

        if (!updatedProduct) {
            throw new HttpException(ProductMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const transformedProduct = transformMongoData(updatedProduct, ProductResponse);

        return transformedProduct
    }

    async deleteProduct(productId: string): Promise<any> {
        const deletedProduct = await this.productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            throw new HttpException(ProductMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return { message: ProductMessages.DELETED };
    }

}