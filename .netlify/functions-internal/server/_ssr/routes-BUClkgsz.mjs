import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
require_jsx_runtime();
/**
* Main Landing Page Route (`/`)
* 
* Features dual full-screen hero sections (Purple and Green themes),
* smooth scroll snapping, keyboard and touch gesture navigation,
* English/Bangla language switching, and the login modal trigger.
*/
var $$splitComponentImporter = () => import("./routes-DbX7vrtH.mjs");
var Route = createFileRoute("/")({
	validateSearch: (search) => search["login"] === true || search["login"] === "true" ? { login: true } : {},
	head: () => ({ meta: [
		{ title: "Neo Cashless — Intelligent Financial Ecosystem" },
		{
			name: "description",
			content: "Neo Cash AI transforms institutional finance with AI, biometric security, and automated digital transactions."
		},
		{
			property: "og:title",
			content: "Neo Cashless — Intelligent Financial Ecosystem"
		},
		{
			property: "og:description",
			content: "Fast, secure, transparent, and paperless institutional finance."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
