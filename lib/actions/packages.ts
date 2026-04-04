'use server';

import { revalidatePath } from "next/cache";
import { PackageService } from "../services/package_service";
import { ProfileService } from "../services/profile_service";
import { createClient } from "../supabase/server";
import { CreatePackageState } from "../definitions/packages";

function validatePackageData(formData: FormData) {
    const name = formData.get('name') as string;
    const priceStr = formData.get('price') as string;
    const vegetables = formData.getAll('vegetables') as string[];
    const isActive = formData.get('is_active') === 'on';

    const errors: CreatePackageState['errors'] = {};

    if (!name || name.trim().length === 0) {
        errors.name = ["Package name is required."];
    }

    if (!priceStr || isNaN(parseFloat(priceStr))) {
        errors._form = ["Valid price is required."];
    }

    const mandatory = ["Tomatoes", "Onions", "Peppers"];
    const missing = mandatory.filter(v => !vegetables.includes(v));

    if (missing.length > 0) {
        errors.vegetables = [`Package must include: ${missing.join(', ')}`];
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
        data: {
            name,
            price: parseFloat(priceStr),
            vegetables,
            is_active: isActive,
            image_url: ''
        }
    };
}

export async function createPackage(formState: CreatePackageState, formData: FormData): Promise<CreatePackageState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized: Please log in." };
    }

    const profile = await ProfileService.getProfile(supabase, user.id);

    if (profile?.role !== 'admin') {
        return { message: "Unauthorized: Only admins can create packages." };
    }

    const { errors, isValid, data } = validatePackageData(formData);

    if (!isValid) {
        return { errors, message: "Validation failed." };
    }

    const result = await PackageService.create(supabase, data);

    if (!result) {
        return { message: "Failed to create package. Database error." };
    }

    revalidatePath('/admin/packages');
    return { message: "Package created successfully!" };
}

export async function updatePackage(id: string, formState: CreatePackageState, formData: FormData): Promise<CreatePackageState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized: Please log in." };
    }

    const profile = await ProfileService.getProfile(supabase, user.id);

    if (profile?.role !== 'admin') {
        return { message: "Unauthorized: Only admins can update packages." };
    }

    const { errors, isValid, data } = validatePackageData(formData);

    if (!isValid) {
        return { errors, message: "Validation failed." };
    }

    const result = await PackageService.update(supabase, id, data);

    if (!result) {
        return { message: "Failed to update package. Database error." };
    }

    revalidatePath('/admin/packages');
    return { message: "Package updated successfully!" };
}

export async function deletePackage(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const profile = await ProfileService.getProfile(supabase, user.id);

    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized");
    }

    const result = await PackageService.delete(supabase, id);
    if (result) {
        revalidatePath('/admin/packages');
    }
    return result;
}
