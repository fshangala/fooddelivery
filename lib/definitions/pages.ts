import { StaticPage as DbStaticPage } from "./supabase";

/**
 * Type representing a static content page.
 */
export type StaticPage = DbStaticPage;

export type PageActionState = {
    errors?: {
        title?: string[];
        content?: string[];
        _form?: string[];
    };
    message?: string;
};
