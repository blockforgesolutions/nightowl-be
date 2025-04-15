import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/role/role.service';
import { BaseRoles } from '../enums/base-roles.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly roleService: RoleService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission = this.reflector.get<string>(
            'permission',
            context.getHandler(),
        );

        if (!requiredPermission) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) return false;

        if (user.role === BaseRoles.SUPER_ADMIN) {
            return true;
        } else {
            const role = await this.roleService.getRoleByName(user.role);
            console.log(role);

            const userPermissions: string[] = role.privileges.map(p => p.action);

            return userPermissions.includes(requiredPermission);
        }
    }
}
