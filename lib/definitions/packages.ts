export interface Package {
    id: string;
    created_at: string;
    name: string;
    image_url?: string;
    price?: number;
    vegetables: string[];
    is_active: boolean;
}

export type CreatePackageState = {
    errors?: {
        name?: string[];
        vegetables?: string[];
        _form?: string[];
    };
    message?: string;
};
