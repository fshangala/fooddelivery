import { Database } from "../supabase/database.types";

export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Profile = Row<'profiles'>;
export type Order = Row<'orders'>;
export type Cluster = Row<'clusters'>;
export type Package = Row<'packages'>;
export type StaticPage = Row<'static_pages'>;
export type Subscription = Row<'subscriptions'>;
