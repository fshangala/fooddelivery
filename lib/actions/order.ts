'use server';

import { redirect } from "next/navigation";
import { OrderService } from "../services/order_service";
import { createClient } from "../supabase/server";

/**
 * State object representing the validation and operation results of the order form.
 */
export type OrderFormState = {
    /** Field-specific validation errors. */
    errors?: {
        /** Error message for the address field. */
        address?: string;
        /** Error message for the vegetables selection. */
        vegetables?: string;
        /** Error message for latitude/longitude. */
        lat?: string;
        lon?: string;
    };
    /** A general status or error message. */
    message?: string;
};

/**
 * Server Action to handle the creation of a new vegetable order.
 * 
 * Validates the authenticated user, address, and vegetable selection.
 * On success, creates the order via OrderService and redirects to the home page.
 * 
 * @param formState - The current state of the order form.
 * @param formData - The form data containing 'address' and 'vegetables'.
 * @returns A promise that resolves to the updated OrderFormState on validation error or failure.
 *          Redirects to '/' upon successful order creation.
 */
export async function createOrder(formState: OrderFormState | undefined, formData: FormData) {
    const errorData: OrderFormState = {};

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        errorData.message = "You must be logged in to place an order.";
        return errorData;
    }

    const address = formData.get('address') as string;
    if (!address) {
        errorData.errors = { ...errorData.errors, address: "Address is required. Please select a location on the map." };
    }

    const vegetables = formData.getAll('vegetables') as string[];
    if (vegetables.length === 0) {
        errorData.errors = { ...errorData.errors, vegetables: "Select at least one vegetable" };
    }

    const latStr = formData.get('lat') as string;
    const lonStr = formData.get('lon') as string;
    
    if (!latStr || !lonStr) {
        errorData.errors = { ...errorData.errors, lat: "Location is required. Please pick a location on the map." };
        return errorData;
    }

    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
        errorData.errors = { ...errorData.errors, lat: "Invalid location data." };
    }

    if (errorData.errors && Object.keys(errorData.errors).length > 0) {
        return errorData;
    }

    const result = await OrderService.create(supabase, {
        customer_id: user.id,
        address,
        lat,
        lon,
        vegetables,
        status: 'PENDING'
    });

    if (!result) {
        errorData.message = "Failed to create order. Please try again.";
        return errorData;
    }

    redirect('/');
}
