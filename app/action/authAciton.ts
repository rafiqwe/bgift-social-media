'use server'

import { signIn } from "@/lib/auth";

export const signInSocialMedia = async (formData: FormData): Promise<void> => {
    const action = formData.get('action') as string;
    await signIn(action, { redirectTo: '/feed' });
}


