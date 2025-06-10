// src/scripts/assign-privileges.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoleModel } from 'src/role/role.schema';

@Injectable()
export class PrivilegeAssignerScript implements OnModuleInit {
    constructor(
        @InjectModel(RoleModel.name) private readonly roleModel: Model<RoleModel>,
    ) { }

    async onModuleInit() {
        await this.assignPrivileges();
        console.log('Privileges assigned successfully');
        process.exit(0);
    }

    private async assignPrivileges() {
        const rolePrivilegeMapping = {
            // create privileges        read privileges             update                      delete
            manager: [
                '67ff7100d4e1d95cb10078a9', '67ff7100d4e1d95cb10078ac', '67ff7100d4e1d95cb10078af', '67ff7100d4e1d95cb10078b3', // category
                '67ff7101d4e1d95cb10078c2', '67ff7101d4e1d95cb10078c5', '67ff7102d4e1d95cb10078c8', '67ff7102d4e1d95cb10078cb', // event
                '67ff7102d4e1d95cb10078ce', '67ff7102d4e1d95cb10078d1', "67ff7102d4e1d95cb10078d4", "67ff7102d4e1d95cb10078d7", // order
                '67ff7103d4e1d95cb10078da', '67ff7103d4e1d95cb10078dd', "67ff7103d4e1d95cb10078e0", "67ff7103d4e1d95cb10078e3", // payment
                '67ff7104d4e1d95cb10078f2', '67ff7104d4e1d95cb10078f5', "67ff7104d4e1d95cb10078f8", "67ff7104d4e1d95cb10078fb", // product
                '67ff7104d4e1d95cb10078fe', '67ff7105d4e1d95cb1007901', "67ff7105d4e1d95cb1007904", "67ff7105d4e1d95cb1007907", // qr-code
                '67ff7105d4e1d95cb100790a', '67ff7105d4e1d95cb100790d', "67ff7105d4e1d95cb1007910", "67ff7106d4e1d95cb1007913", // region
                '68075a96196a810e9b34ad63', '68075a96196a810e9b34ad66', "68075a96196a810e9b34ad69", "68075a96196a810e9b34ad6c", // employee

                //coat check
            ],
            waiter: [
                '67ff7102d4e1d95cb10078ce', '67ff7102d4e1d95cb10078d1', '67ff7102d4e1d95cb10078d4', "67ff7102d4e1d95cb10078d7", //order
                "68075a96196a810e9b34ad66", "68075a96196a810e9b34ad69", "68075a96196a810e9b34ad6c", //employee
            ],
            cashier: [
                '67ff7102d4e1d95cb10078ce', '67ff7102d4e1d95cb10078d1', '67ff7102d4e1d95cb10078d4', "67ff7102d4e1d95cb10078d7", //order
                "68075a96196a810e9b34ad66", "68075a96196a810e9b34ad69", "68075a96196a810e9b34ad6c", //employee
                //payment
            ],
            barmen: [
                '67ff7102d4e1d95cb10078ce', '67ff7102d4e1d95cb10078d1', '67ff7102d4e1d95cb10078d4', "67ff7102d4e1d95cb10078d7", //order
                "68075a96196a810e9b34ad66", "68075a96196a810e9b34ad69", "68075a96196a810e9b34ad6c", //employee
            ],
        };

        try {
            for (const [roleName, privilegeIds] of Object.entries(rolePrivilegeMapping)) {
                const role = await this.roleModel.findOne({ name: roleName });
                if (!role) {
                    console.warn(`Rol bulunamadı: ${roleName}`);
                    continue;
                }

                role.privileges = privilegeIds.map(id => new Types.ObjectId(id));

                await role.save();
                console.log(`${roleName} rolüne ${privilegeIds.length} ayrıcalık atandı`);
            }
        } catch (error) {
            console.error('Ayrıcalık atama hatası:', error);
            process.exit(1);
        }
    }
}