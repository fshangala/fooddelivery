'use server';

import { redirect } from "next/navigation";
import { PackageService } from "../services/package_service";
import { createClient } from "../supabase/server";
import { CreatePackageState } from "../definitions/packages";

export async function createPackage(formState: CreatePackageState, formData: FormData): Promise<CreatePackageState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== 'admin') {
        return {
            message: "Unauthorized: Only admins can create packages."
        };
    }

    const name = formData.get('name') as string;
    const priceStr = formData.get('price') as string;
    const vegetables = formData.getAll('vegetables') as string[];
    const isActive = formData.get('is_active') === 'on'; // Checkbox

    const errors: CreatePackageState['errors'] = {};

    if (!name || name.trim().length === 0) {
        errors.name = ["Package name is required."];
    }

    if (!priceStr || isNaN(parseFloat(priceStr))) {
        errors._form = ["Valid price is required."];
    }

    // Mandatory vegetables check
    const mandatory = ["Tomatoes", "Onions", "Peppers"];
    const missing = mandatory.filter(v => !vegetables.includes(v));

    if (missing.length > 0) {
        errors.vegetables = [`Package must include: ${missing.join(', ')}`];
    }

    if (Object.keys(errors).length > 0) {
        return { errors, message: "Validation failed." };
    }

    const price = parseFloat(priceStr);

    const newPackage = {
        name,
        price,
        vegetables,
        is_active: isActive,
        image_url: '' // Optional for now
    };

    const result = await PackageService.create(supabase, newPackage);

    if (!result) {
        return { message: "Failed to create package. Database error." };
    }

    redirect('/admin/packages');
}
