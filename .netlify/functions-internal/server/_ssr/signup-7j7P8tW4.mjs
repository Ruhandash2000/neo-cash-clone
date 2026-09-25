import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D02inl6r.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as enrollBiometric } from "./biometrics-M3pCeLJi.mjs";
import { n as auth_side_illustration_default, t as BiometricPanel } from "./auth-side-illustration-DX7CKWxY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-7j7P8tW4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* User Account Registration Page (`/signup`)
* 
* Features registration form validation, Supabase user account creation,
* optional marketing consent opt-in, and WebAuthn biometric passkey enrollment.
*/
function SignUpPage() {
	const navigate = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		username: "",
		email: "",
		password: "",
		repeat: "",
		contactMe: false,
		terms: false
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [stage, setStage] = (0, import_react.useState)("form");
	const [bioStatus, setBioStatus] = (0, import_react.useState)(null);
	/** Helper to update individual form state fields */
	const update = (key, value) => setForm((prev) => ({
		...prev,
		[key]: value
	}));
	/** Validate form inputs before submission */
	const validate = () => {
		const next = {};
		if (!form.username.trim()) next.username = "Username is required.";
		else if (form.username.trim().length < 3) next.username = "Use at least 3 characters.";
		if (!form.email.trim()) next.email = "Email is required.";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
		if (!form.password) next.password = "Password is required.";
		else if (form.password.length < 8) next.password = "Use at least 8 characters.";
		else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) next.password = "Include at least one letter and one number.";
		if (form.repeat !== form.password) next.repeat = "Passwords do not match.";
		if (!form.terms) next.terms = "You must accept the Terms and Conditions.";
		setErrors(next);
		return Object.keys(next).length === 0;
	};
	/** Process registration form submission */
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!validate()) return;
		setBusy(true);
		const { data, error } = await supabase.auth.signUp({
			email: form.email.trim(),
			password: form.password,
			options: {
				emailRedirectTo: window.location.origin,
				data: {
					username: form.username.trim(),
					marketing_opt_in: form.contactMe
				}
			}
		});
		setBusy(false);
		if (error) {
			setErrors({ form: error.message });
			return;
		}
		if (data.user && data.user.identities?.length === 0) {
			setErrors({ email: "An account already exists for this email address." });
			return;
		}
		if (!data.session) {
			setStage("done");
			setBioStatus({
				tone: "info",
				message: "Account created. Confirm your email address, then sign in to finish setup."
			});
			return;
		}
		setStage("biometric");
	};
	/** Enroll device authenticator for biometric login after registration */
	const handleEnroll = async () => {
		setBioStatus({
			tone: "info",
			message: "Waiting for your device…"
		});
		setBusy(true);
		const result = await enrollBiometric();
		setBusy(false);
		if (!result.ok) {
			setBioStatus({
				tone: "error",
				message: result.error
			});
			return;
		}
		setBioStatus({
			tone: "success",
			message: "Fingerprint login enabled for this device."
		});
		setTimeout(() => void navigate({ to: "/dashboard" }), 900);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "auth-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "auth-modal auth-modal--page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "auth-art",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: auth_side_illustration_default,
					alt: "",
					loading: "lazy",
					width: 1024,
					height: 1024
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Eliminate delays. Eliminate errors. Eliminate cash." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "auth-form-side",
				children: stage === "biometric" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BiometricPanel, {
					title: "Set Up Biometric Login",
					instruction: "Use your device's biometric authentication for convenient sign-in.",
					actionLabel: "Enable Fingerprint Login",
					cancelLabel: "Skip for Now",
					onScan: handleEnroll,
					onCancel: () => void navigate({ to: "/dashboard" }),
					status: bioStatus,
					busy,
					secondary: {
						label: "Skip for Now",
						onClick: () => void navigate({ to: "/dashboard" })
					}
				}) : stage === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "auth-form",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "auth-heading",
							children: "Almost there"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "auth-status auth-status--info",
							children: bioStatus?.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "auth-primary",
							type: "button",
							onClick: () => void navigate({ to: "/" }),
							children: "Back to Neo"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "auth-form",
					onSubmit: handleSubmit,
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "auth-heading auth-heading--sm",
							children: "Register with your e-mail"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "username",
							label: "USERNAME (*)",
							placeholder: "Username",
							value: form.username,
							onChange: (v) => update("username", v),
							error: errors.username,
							autoComplete: "username"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							id: "email",
							label: "EMAIL (*)",
							type: "email",
							placeholder: "E-mail",
							value: form.email,
							onChange: (v) => update("email", v),
							error: errors.email,
							autoComplete: "email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "auth-grid",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "password",
								label: "PASSWORD (*)",
								type: "password",
								placeholder: "Password",
								value: form.password,
								onChange: (v) => update("password", v),
								error: errors.password,
								autoComplete: "new-password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								id: "repeat",
								label: "REPEAT PASSWORD (*)",
								type: "password",
								placeholder: "Repeat Password",
								value: form.repeat,
								onChange: (v) => update("repeat", v),
								error: errors.repeat,
								autoComplete: "new-password"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "auth-consent",
							children: "Neo may keep me informed with personalized emails about products and services. See our Privacy Policy for more details."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "auth-check",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.contactMe,
								onChange: (e) => update("contactMe", e.target.checked)
							}), "Please contact me via e-mail"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "auth-check",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.terms,
								onChange: (e) => update("terms", e.target.checked),
								"aria-invalid": Boolean(errors.terms)
							}), "I have read and accept the Terms and Conditions"]
						}),
						errors.terms ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "auth-error",
							children: errors.terms
						}) : null,
						errors.form ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "auth-status auth-status--error",
							role: "alert",
							children: errors.form
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "auth-primary",
							type: "submit",
							disabled: busy,
							children: busy ? "Creating account…" : "Create Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "auth-footer",
							children: [
								"Already have an account?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "auth-inline-link",
									onClick: () => void navigate({
										to: "/",
										search: { login: true }
									}),
									children: "Back to login"
								})
							]
						})
					]
				})
			})]
		})
	});
}
/** Reusable Form Input Field Component */
function Field({ id, label, value, onChange, placeholder, type = "text", error, autoComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "auth-field",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "auth-label auth-label--caps",
				htmlFor: id,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type,
				className: "auth-input auth-input--line",
				placeholder,
				value,
				onChange: (e) => onChange(e.target.value),
				"aria-invalid": Boolean(error),
				"aria-describedby": error ? `${id}-error` : void 0,
				...autoComplete ? { autoComplete } : {}
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "auth-error",
				id: `${id}-error`,
				children: error
			}) : null
		]
	});
}
//#endregion
export { SignUpPage as component };
