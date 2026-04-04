import { UserRole } from "./order";

export interface Profile {
    id: string;
    updated_at: string;
    name: string | null;
    role: UserRole;
    email: string | null;
    phone: string | null;
}
