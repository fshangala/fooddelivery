import { Package as DbPackage } from "./supabase";

export interface Package extends Omit<DbPackage, 'vegetables'> {
    vegetables: string[];
}

export type CreatePackageState = {
    errors?: {
        name?: string[];
        vegetables?: string[];
        _form?: string[];
    };
    message?: string;
};
