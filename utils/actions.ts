"use server";

import { redirect } from "next/navigation";

// this is to be used to call 'redirect' from a Client Component
export async function navigate(page: string) {
  redirect(page);
}
