import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmployeeModel } from './employee.schema';
import { Model } from 'mongoose';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { EmployeeResponse } from './model/employee.response';
import { EmployeeMessages } from './enums/employee.enum';
import { hashPassword } from 'src/utils/jwt.util';
import { AuthMessages } from 'src/common/enums/response/messages.enum';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectModel(EmployeeModel.name) private readonly employeeModel: Model<EmployeeModel>,
    ) { }

    async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponse> {
        const employee = await this.employeeModel.findOne({ email: createEmployeeDto.email });

        if (employee) {
            throw new HttpException(EmployeeMessages.EMAIL_ALREADY_REGISTERED, HttpStatus.CONFLICT)
        }

        const hashedPassword = await hashPassword(createEmployeeDto.password);
        createEmployeeDto.password = hashedPassword;
        const newEmployee = await this.employeeModel.create(createEmployeeDto);

        return await this.mapToEmployeeResponse(newEmployee);
    }

    async getClubEmployees(clubId: string): Promise<EmployeeResponse[]> {
        const employees = await this.employeeModel.find({ club: clubId }).lean();

        const transformedEmployees = transformMongoArray<EmployeeModel, EmployeeResponse>(employees);

        return transformedEmployees
    }

    async getEmployeeById(employeeId: string): Promise<EmployeeResponse> {
        const employee = await this.employeeModel.findById(employeeId);

        if (!employee) {
            throw new HttpException(EmployeeMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return await this.mapToEmployeeResponse(employee);
    }

    async getEmployeeByEmail(email: string): Promise<EmployeeResponse> {
        const employee = await this.employeeModel.findOne({ email: email });

        if (!employee) {
            throw new HttpException(EmployeeMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return await this.mapToEmployeeResponse(employee);
    }

    async updateEmployee(employeeId: string, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeResponse> {
        const employee = await this.employeeModel.findByIdAndUpdate(employeeId, updateEmployeeDto, { new: true });

        if (!employee) {
            throw new HttpException(EmployeeMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return await this.mapToEmployeeResponse(employee);
    }

    async deleteEmployee(employeeId: string): Promise<any> {
        const employee = await this.employeeModel.findByIdAndDelete(employeeId);

        if (!employee) {
            throw new HttpException(EmployeeMessages.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return { message: EmployeeMessages.DELETED }
    }



    private async mapToEmployeeResponse(employee: EmployeeModel): Promise<EmployeeResponse> {

        // Populate role and privileges
        const populatedEmployee = await this.employeeModel
            .findById(employee._id)
            .select('-password')
            .populate([
                {
                    path: 'role',
                    select: '_id name'
                },
                {
                    path: 'club',
                    select: 'id name country city district neighborhood street no address zipCode'
                }
            ])
            .lean();

        if (!populatedEmployee || !populatedEmployee.role) {
            throw new NotFoundException(AuthMessages.USER_OR_ROLE_NOT_FOUND);
        }

        const transformedEmployee = transformMongoData(populatedEmployee, EmployeeResponse);

        if (!transformedEmployee) {
            throw new Error('Failed to transform user document');
        }

        return transformedEmployee;
    }
}
