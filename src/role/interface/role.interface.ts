import { Privilege } from "src/privileges/interface/privilege.interface";


export interface Role {
    name: string,
    privileges: Privilege[]
}
