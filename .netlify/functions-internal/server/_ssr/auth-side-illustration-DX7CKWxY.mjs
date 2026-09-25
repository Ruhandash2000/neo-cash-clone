import { i as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as biometricsAvailable } from "./biometrics-M3pCeLJi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-side-illustration-DX7CKWxY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Fingerprint scan mark recreated as an SVG, matching the reference screenshot. */
function FingerprintScan({ size = 150 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 120 120",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "5",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		focusable: "false",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 34V16a8 8 0 0 1 8-8h18" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M86 8h18a8 8 0 0 1 8 8v18" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M112 86v18a8 8 0 0 1-8 8H86" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M34 112H16a8 8 0 0 1-8-8V86" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				strokeWidth: "4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M38 76c-1.5-5-2-10.5-2-16a24 24 0 0 1 48 0c0 5.5-.5 11-2 16" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M46 84c-2-6-3-12-3-18a17 17 0 0 1 34 0c0 8-1 16-4 24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M54 88c-1.5-6-2-13-2-20a8 8 0 0 1 16 0c0 12-1 22-4 32" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M60 60v10" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M26 60h68",
				strokeWidth: "6"
			})
		]
	});
}
function BiometricPanel({ title, instruction, actionLabel, onScan, onCancel, cancelLabel = "Cancel", secondary, status, busy }) {
	const [supported, setSupported] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		biometricsAvailable().then((value) => active && setSupported(value));
		return () => {
			active = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bio-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "bio-cancel",
				onClick: onCancel,
				children: [
					cancelLabel,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "✕"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "auth-heading",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "auth-subtitle",
				children: instruction
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bio-body",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "bio-scan",
					onClick: onScan,
					disabled: busy,
					"aria-label": actionLabel,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintScan, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "bio-hint",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "👆"
						}),
						" ",
						busy ? "Waiting for your device…" : actionLabel
					]
				})]
			}),
			status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `auth-status auth-status--${status.tone}`,
				role: "status",
				"aria-live": "polite",
				children: status.message
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "bio-note",
				children: ["Neo never receives or stores your fingerprint. Your device verifies you with a fingerprint, face scan or PIN and signs a one-time challenge that our server checks.", supported === false ? " This device or browser does not offer a built-in authenticator — use your email and password instead." : ""]
			}),
			secondary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "auth-link-button",
				onClick: secondary.onClick,
				children: secondary.label
			}) : null
		]
	});
}
var auth_side_illustration_default = "/assets/auth-side-illustration-BxACqauE.jpg";
//#endregion
export { auth_side_illustration_default as n, BiometricPanel as t };
