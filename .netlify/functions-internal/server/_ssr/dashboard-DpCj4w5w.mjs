import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DpCj4w5w.js
/**
* Authenticated User Dashboard Route (`/_authenticated/dashboard`)
* 
* Displays user account information, active WebAuthn registered devices,
* passkey biometric enrollment options, and session logout functionality.
*/
var $$splitComponentImporter = () => import("./dashboard-Cb6wMrKO.mjs");
var Route = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Your Neo Cashless dashboard" },
		{
			name: "description",
			content: "Manage your Neo Cashless account and sign-in devices."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
