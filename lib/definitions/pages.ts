import { StaticPage as DbStaticPage } from "./supabase";

export interface StaticPage extends DbStaticPage {
}

export type PageActionState = {
    errors?: {
        title?: string[];
        content?: string[];
        _form?: string[];
    };
    message?: string;
};
