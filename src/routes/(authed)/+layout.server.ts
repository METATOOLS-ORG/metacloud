import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";


export const load: LayoutServerLoad = async ({ cookies }) => {
    if (!cookies.get("token")) {
        // @todo: ?redirect=${url.pathname}
        redirect(303, "/login");
    }
};
