import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D02inl6r.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-B8CdoHIS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Password Reset Confirmation Page (`/reset-password`)
* 
* Invoked when users click their password recovery link emailed via Supabase Auth.
* Allows setting a new secure password.
*/
function ResetPassword() {
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [repeat, setRepeat] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	/** Update password via Supabase Auth client */
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (password.length < 8) {
			setStatus({
				tone: "error",
				message: "Use at least 8 characters."
			});
			return;
		}
		if (password !== repeat) {
			setStatus({
				tone: "error",
				message: "Passwords do not match."
			});
			return;
		}
		setBusy(true);
		const { error } = await supabase.auth.updateUser({ password });
		setBusy(false);
		if (error) {
			setStatus({
				tone: "error",
				message: error.message
			});
			return;
		}
		setStatus({
			tone: "success",
			message: "Password updated. Taking you to your dashboard…"
		});
		setTimeout(() => void navigate({ to: "/dashboard" }), 900);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "auth-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "auth-modal auth-modal--single",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "auth-form",
				onSubmit: handleSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "auth-heading",
						children: "Choose a new password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "auth-subtitle",
						children: "This link is single-use and time limited."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "auth-label",
						htmlFor: "new-password",
						children: "New password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "new-password",
						type: "password",
						className: "auth-input",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						autoComplete: "new-password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "auth-label",
						htmlFor: "repeat-password",
						children: "Repeat password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "repeat-password",
						type: "password",
						className: "auth-input",
						value: repeat,
						onChange: (e) => setRepeat(e.target.value),
						autoComplete: "new-password"
					}),
					status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `auth-status auth-status--${status.tone}`,
						role: "status",
						"aria-live": "polite",
						children: status.message
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "auth-primary",
						type: "submit",
						disabled: busy,
						children: busy ? "Updating…" : "Update password"
					})
				]
			})
		})
	});
}
//#endregion
export { ResetPassword as component };
