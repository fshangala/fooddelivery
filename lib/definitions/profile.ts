import { UserRole } from "./order";
import { Profile as DbProfile } from "./supabase";

export interface Profile extends DbProfile {
    role: UserRole;
}
