'use server';

import { revalidatePath } from "next/cache";
import { PageService } from "../services/page_service";
import { ProfileService } from "../services/profile_service";
import { createClient } from "../supabase/server";
import { PageActionState } from "../definitions/pages";

export async function updatePage(slug: string, formState: PageActionState, formData: FormData): Promise<PageActionState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: "Unauthorized: Please log in." };
    }

    const profile = await ProfileService.getProfile(supabase, user.id);

    if (profile?.role !== 'admin') {
        return { message: "Unauthorized: Only admins can update pages." };
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const errors: PageActionState['errors'] = {};

    if (!title || title.trim().length === 0) {
        errors.title = ["Title is required."];
    }

    if (content === undefined) {
        errors.content = ["Content is required."];
    }

    if (Object.keys(errors).length > 0) {
        return { errors, message: "Validation failed." };
    }

    const result = await PageService.upsert(supabase, {
        slug,
        title,
        content
    });

    if (!result) {
        return { message: "Failed to update page. Database error." };
    }

    revalidatePath('/admin/pages');
    revalidatePath(`/privacy-policy`);
    revalidatePath(`/terms-of-use`);
    
    return { message: "Page updated successfully!" };
}
