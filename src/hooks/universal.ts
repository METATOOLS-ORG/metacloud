import type { Reroute } from "@sveltejs/kit";

export const reroute: Reroute = ({ url }) => {
	// Reroute /@username to /user/username
	if (url.pathname.startsWith("/@")) {
		return "/user/" + url.pathname.slice(2);
	}
}