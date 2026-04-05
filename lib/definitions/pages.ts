export interface StaticPage {
    slug: string;
    title: string;
    content: string;
    updated_at: string;
}

export type PageActionState = {
    errors?: {
        title?: string[];
        content?: string[];
        _form?: string[];
    };
    message?: string;
};
