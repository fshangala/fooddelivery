'use server';

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { SubscriptionService } from "../services/subscription_service";
import { PackageService } from "../services/package_service";
import { SubscriptionFormState } from "../definitions/subscription";

export async function createSubscription(formState: SubscriptionFormState, formData: FormData): Promise<SubscriptionFormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "You must be logged in to subscribe." };
    }

    const packageId = formData.get('package_id') as string;
    const address = formData.get('address') as string;
    const latStr = formData.get('lat') as string;
    const lonStr = formData.get('lon') as string;

    const errors: SubscriptionFormState['errors'] = {};

    if (!packageId) {
        errors.package_id = "Please select a package.";
    }

    if (!address) {
        errors.address = "Address is required. Please select a location on the map.";
    }

    if (!latStr || !lonStr) {
        errors.lat = "Location is required.";
    }

    if (Object.keys(errors).length > 0) {
        return { errors, message: "Validation failed." };
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
        return { message: "Invalid location coordinates." };
    }

    // Fetch package details to get vegetables
    const pkg = await PackageService.getById(supabase, packageId);
    if (!pkg) {
        return { message: "Selected package not found or inactive." };
    }

    const result = await SubscriptionService.create(
        supabase,
        user.id,
        packageId,
        address,
        lat,
        lon,
        pkg
    );

    if (!result) {
        return { message: "Failed to create subscription. Please try again." };
    }

    redirect('/');
}
