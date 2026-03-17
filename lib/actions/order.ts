'use server';

import { redirect } from "next/navigation";
import { OrderService } from "../services/order_service";
import supabase from "../supabase/client";

/**
 * List of available vegetables that can be included in an order.
 */
export const AVAILABLE_VEGETABLES = [
    "Spinach",
    "Carrots",
    "Potatoes",
    "Tomatoes",
    "Onions",
    "Broccoli",
    "Peppers",
    "Lettuce",
    "Cabbage"
];

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

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        errorData.message = "You must be logged in to place an order.";
        return errorData;
    }

    const address = formData.get('address') as string;
    if (!address) {
        errorData.errors = { ...errorData.errors, address: "Address is required" };
    }

    const vegetables = formData.getAll('vegetables') as string[];
    if (vegetables.length === 0) {
        errorData.errors = { ...errorData.errors, vegetables: "Select at least one vegetable" };
    }

    if (errorData.errors) {
        return errorData;
    }

    // Mocking lat/lon for now since we don't have a map picker yet
    const lat = -26.2041;
    const lon = 28.0473;

    const result = await OrderService.create({
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
