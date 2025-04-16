// src/scripts/initialize-privileges.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PermissionAction } from 'src/common/enums/permission.enum';
import { PrivilegesService } from 'src/privileges/privileges.service';

@Injectable()
export class PrivilegeInitializer implements OnModuleInit {
  private readonly models = [
    'category',
    'club',
    'event',
    'order',
    'payment',
    'privilege',
    'product',
    'qr-code',
    'region',
    'role',
    'ticket',
    'user',
  ];

  private readonly actions = ['create', 'read', 'update', 'delete'];
  private readonly createdBy = '67fbb3a11420f5cb2f997780';

  constructor(private readonly privilegeService: PrivilegesService) {}

  async onModuleInit() {
    await this.initializePrivileges();
  }

  private async initializePrivileges() {
    try {
      const privileges = await this.privilegeService.getPrivileges();

      if(privileges.length === this.models.length * this.actions.length) {
        console.log('Privileges already initialized');
      } else {
        for (const model of this.models) {
          for (const action of this.actions) {
            const name = `${action}-${model}`;
            const actionName = `${model}:${action}`;
            const description = `${this.capitalizeFirstLetter(action)} ${model}`;
  
            await this.privilegeService.createPrivilege(this.createdBy, {
              name,
              description,
              action: actionName as PermissionAction,
            });
          }
        }
        console.log('All privileges initialized successfully');
      }

      
    } catch (error) {
      console.error('Error initializing privileges:', error);
    }
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}