import { ApiProperty } from "@nestjs/swagger"
import { UserResponse } from "src/user/model/user.response"

export class AuthResponse {
    @ApiProperty({ example:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
    access_token: string

    @ApiProperty({ example:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
    refresh_token: string

    @ApiProperty({type: UserResponse})
    user: UserResponse
}