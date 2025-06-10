import { ApiProperty } from "@nestjs/swagger"
import { EmployeeResponse } from "src/employee/model/employee.response"

export class EmployeeAuthResponse {
    @ApiProperty({ example:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
    access_token: string

    @ApiProperty({ example:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
    refresh_token: string

    @ApiProperty({type: EmployeeResponse})
    employee: EmployeeResponse
}