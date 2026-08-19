"use server";

import { signIn } from "@/lib/auth";

export const signInSocialMedia = async (
  formData: FormData | string
): Promise<void> => {
  const action =
    typeof formData === "string"
      ? formData
      : (formData.get("action") as string);
  await signIn(action, { redirectTo: "/feed" });
};
