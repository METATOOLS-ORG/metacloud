import type { Reroute } from "@sveltejs/kit";

export const reroute: Reroute = ({ url }) => {
	if (url.pathname.startsWith("/@")) {
		return "/user/" + url.pathname.slice(2);
		console.log("yay", url.pathname);
	}
}