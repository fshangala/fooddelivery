import { jwtVerify, SignJWT } from "jose";
import SessionPayload from "./definitions/session_payload";
import { cookies } from "next/headers";

const secreteKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'your-supabase-publishable-key';
const encodedKey = new TextEncoder().encode(secreteKey);

export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string) {
    const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
    });
    return payload as SessionPayload;
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
    });
}