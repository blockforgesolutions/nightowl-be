import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleService } from 'src/role/role.service';

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

        if (user.role === 'super_admin') {
            return true;
        }

        const role = await this.roleService.getRoleByName(user.role);

        const userPermissions: string[] = role.privileges.map(p => p.action);

        return userPermissions.includes(requiredPermission);
    }
}
