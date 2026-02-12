
export async function registerUser(data: FormData) {
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
}