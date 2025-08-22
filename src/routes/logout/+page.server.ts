import { invalidate } from "$app/navigation";
import { redirect, type ServerLoad } from "@sveltejs/kit";

export const ssr = false; // uses browser code

export const load: ServerLoad = ({ locals, cookies }) => {
    cookies.delete("token", { path: "/" });
}
