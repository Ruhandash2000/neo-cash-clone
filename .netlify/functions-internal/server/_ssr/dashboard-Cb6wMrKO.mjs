import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D02inl6r.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./dashboard-DpCj4w5w.mjs";
import { n as enrollBiometric, r as listMyCredentials } from "./biometrics-M3pCeLJi.mjs";
import { t as neo_purple_logo_default } from "./neo-purple-logo-BHhgraZj.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Cb6wMrKO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Authenticated User Dashboard Route (`/_authenticated/dashboard`)
* 
* Displays user account information, active WebAuthn registered devices,
* passkey biometric enrollment options, and session logout functionality.
*/
function Dashboard() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [message, setMessage] = (0, import_react.useState)(null);
	/** Query to fetch user's registered WebAuthn biometric credentials */
	const credentials = useQuery({
		queryKey: ["webauthn-credentials"],
		queryFn: () => listMyCredentials()
	});
	/** Handle user session sign out */
	const handleSignOut = async () => {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		await navigate({
			to: "/",
			replace: true
		});
	};
	/** Trigger biometric credential enrollment */
	const handleEnroll = async () => {
		setMessage("Waiting for your device…");
		const result = await enrollBiometric();
		setMessage(result.ok ? "Fingerprint login enabled for this device." : result.error);
		if (result.ok) credentials.refetch();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "dash",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "dash-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: neo_purple_logo_default,
				alt: "Neo",
				className: "dash-logo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "dash-signout",
				onClick: handleSignOut,
				children: "Logout"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "dash-body",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Welcome back", user?.email ? `, ${user.email}` : ""] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dash-lead",
					children: "No paperwork. No queues. No cash. Your Neo workspace is ready — account balances, approvals and transaction reporting land here as they are rolled out."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dash-cards",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "dash-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Account" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: user?.email }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "dash-muted",
								children: "Signed in securely through Neo Cashless."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "dash-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Biometric sign-in" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: credentials.isLoading ? "Checking…" : credentials.data && credentials.data.length > 0 ? `${credentials.data.length} device${credentials.data.length > 1 ? "s" : ""} registered.` : "No device registered yet." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "auth-primary dash-enroll",
								onClick: handleEnroll,
								children: "Enable Fingerprint Login"
							}),
							message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "dash-muted",
								role: "status",
								"aria-live": "polite",
								children: message
							}) : null
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { Dashboard as component };
