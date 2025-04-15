import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryModel } from './category.schema';
import { CategoryDto } from './dto/category.dto';
import { Model } from 'mongoose';
import { CategoryRespone } from './model/category.respone';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { CategoryMessage } from 'src/category/enums/category-message.enum';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(CategoryModel.name) private readonly categoryModel: Model<CategoryModel>
    ) { }

    async createCategory(categoryDto: CategoryDto): Promise<CategoryRespone> {
        const newCategory = await this.categoryModel.create(categoryDto);

        const tranformedCategory = transformMongoData(newCategory.toObject(), CategoryRespone);

        return tranformedCategory
    }

    async getCategoriesByClub(clubId: string): Promise<CategoryRespone[]> {
        const categories = await this.categoryModel.find({ club: clubId }).lean();

        const transformedCategories = transformMongoArray(categories);

        return transformedCategories
    }

    async getCategoryById(categoryId: string): Promise<CategoryRespone> {
        const category = await this.categoryModel.findById(categoryId).lean()

        if (!category) {
            throw new HttpException(CategoryMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const tranformedCategory = transformMongoData(category, CategoryRespone);

        return tranformedCategory
    }

    async updateCategory(categoryId: string, categoryDto: CategoryDto): Promise<CategoryRespone> {
        const category = await this.categoryModel.findByIdAndUpdate(categoryId, categoryDto, { new: true });

        if (!category) {
            throw new HttpException(CategoryMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const tranformedCategory = transformMongoData(category, CategoryRespone);

        return tranformedCategory
    }

    async deleteCategory(categoryId: string): Promise<any> {
        const category = await this.categoryModel.findByIdAndDelete(categoryId);

        if (!category) {
            throw new HttpException(CategoryMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: CategoryMessage.DELETED };
    }
}
