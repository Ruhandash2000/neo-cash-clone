import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D02inl6r.mjs";
import { a as Trigger2, c as require_jsx_runtime, i as Root2, l as require_react, n as Header, o as Slot, r as Item, t as Content2 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signInWithBiometric } from "./biometrics-M3pCeLJi.mjs";
import { t as neo_purple_logo_default } from "./neo-purple-logo-BHhgraZj.mjs";
import { t as Route } from "./routes-BUClkgsz.mjs";
import { n as auth_side_illustration_default, t as BiometricPanel } from "./auth-side-illustration-DX7CKWxY.mjs";
import { a as Send, c as MapPin, d as Instagram, f as Facebook, h as ChartColumn, i as ShieldCheck, l as Mail, m as ChevronDown, n as Twitter, o as PiggyBank, p as CreditCard, r as SlidersHorizontal, s as Phone, t as WalletCards, u as Linkedin } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DbX7vrtH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var faq_financial_planning_default = "/assets/faq-financial-planning-BMYxIdcU.png";
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
/**
* Home Page Additional Content Sections Component
* Contains "Why Choose Us" features grid, "Have Any Question?" FAQ accordion,
* Contact form, and the main Site Footer.
*/
var features = [
	{
		title: "Personalized for you",
		description: "Designed to pick, add, and build features that are tailored to your needs.",
		icon: SlidersHorizontal,
		tone: "violet"
	},
	{
		title: "Streamlined payments",
		description: "Streamlined empowers you to establish milestones accordingly.",
		icon: WalletCards,
		tone: "blue"
	},
	{
		title: "Unlimited virtual cards",
		description: "Control by generating as many virtual credit cards as you need.",
		icon: CreditCard,
		tone: "yellow"
	},
	{
		title: "Accelerate your savings",
		description: "A high interest online savings account with no monthly fees.",
		icon: PiggyBank,
		tone: "violet"
	},
	{
		title: "Enhanced privacy",
		description: "With no visible card number on its surface, Neo keeps you safe.",
		icon: ShieldCheck,
		tone: "blue"
	},
	{
		title: "Built for growth",
		description: "Get access to financial risks data and build a clear strategy.",
		icon: ChartColumn,
		tone: "yellow"
	}
];
var faqs = [
	{
		question: "Why should I care about financial planning?",
		answer: "Financial planning is essential because it helps you achieve your financial goals and secure your financial future."
	},
	{
		question: "What are the different types of investments?",
		answer: "Common options include savings products, bonds, shares, funds, property, and other assets with different risk and return profiles."
	},
	{
		question: "How can I start saving for retirement?",
		answer: "Set a clear target, automate regular contributions, and choose a diversified plan that matches your timeline and comfort with risk."
	},
	{
		question: "What is the importance of emergency funds?",
		answer: "An emergency fund helps cover unexpected costs without disrupting long-term goals or relying on high-interest debt."
	}
];
var footerColumns = [
	{
		title: "Product",
		links: [
			"Overview",
			"Features",
			"Solutions",
			"Tutorials",
			"Pricing"
		]
	},
	{
		title: "Company",
		links: [
			"About us",
			"Careers",
			"News",
			"Media",
			"Contact"
		]
	},
	{
		title: "Helpful Links",
		links: [
			"Documentation",
			"API reference",
			"Status",
			"Legal Center",
			"Partnership"
		]
	}
];
function SectionHeading({ children, id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "content-heading",
		id,
		children
	});
}
/** "Why Choose Us" Feature Cards Section */
function WhyChooseUs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-section why-section",
		"aria-labelledby": "why-heading",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "content-shell",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "why-heading",
				className: "content-heading",
				children: "Why Choose Us"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "feature-panel",
				children: features.map(({ title, description, icon: Icon, tone }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "feature-item",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `feature-icon feature-icon--${tone}`,
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })] })]
				}, title))
			})]
		})
	});
}
/** FAQ Accordion Section */
function Questions() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-section faq-section",
		"aria-labelledby": "faq-heading",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "content-shell",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "faq-heading",
				className: "content-heading",
				children: "Have Any Question?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "faq-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "faq-art-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: faq_financial_planning_default,
						alt: "Financial adviser considering savings and investment questions",
						loading: "lazy",
						width: 1200,
						height: 900
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "question-note",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Got more" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "questions?" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reach Out!" })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					defaultValue: "faq-0",
					collapsible: true,
					className: "faq-list",
					children: faqs.map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: `faq-${index}`,
						className: "faq-item",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "faq-trigger",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: faq.question })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
							className: "faq-answer",
							children: faq.answer
						})]
					}, faq.question))
				})]
			})]
		})
	});
}
/** User Message / Feedback Form Section */
function Contact() {
	const [message, setMessage] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const submitMessage = (event) => {
		event.preventDefault();
		if (!message.trim()) {
			setStatus("Please write a message first.");
			return;
		}
		setMessage("");
		setStatus("Thank you — your message is ready for the Neo team.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "content-section contact-section",
		"aria-labelledby": "contact-heading",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "content-shell",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				id: "contact-heading",
				children: "Contact Us"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "contact-panel",
				onSubmit: submitMessage,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "neo-message",
						children: "Message"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "neo-message",
						value: message,
						onChange: (event) => {
							setMessage(event.target.value);
							if (status) setStatus("");
						},
						placeholder: "Send us a message....",
						rows: 5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contact-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							"aria-live": "polite",
							children: status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "send-button",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { "aria-hidden": "true" }), "Send"]
						})]
					})
				]
			})]
		})
	});
}
/** Global Footer Component */
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "site-footer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "footer-shell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "footer-brand",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#top",
							className: "footer-logo",
							"aria-label": "Neo home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: neo_purple_logo_default,
								alt: "Neo"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"No paperwork. No queues. No cash.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Only fast, secure, AI-powered automation."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Contact" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "tel:+01000000000",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { "aria-hidden": "true" }), "01+++++++++"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "mailto:support@example.com",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { "aria-hidden": "true" }), "support@example.com"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { "aria-hidden": "true" }), "Your institutional location"] })
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "footer-nav-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "footer-columns",
						"aria-label": "Footer navigation",
						children: footerColumns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: column.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: column.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `#${link.toLowerCase().replaceAll(" ", "-")}`,
							children: link
						}) }, link)) })] }, column.title))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "social-links",
						"aria-label": "Social media",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#linkedin",
								"aria-label": "LinkedIn",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#instagram",
								"aria-label": "Instagram",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#facebook",
								"aria-label": "Facebook",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#twitter",
								"aria-label": "Twitter X",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, {})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "copyright",
					children: "Copyright © 2026 Neo. All rights reserved"
				})
			]
		})
	});
}
/** Home Content Wrapper containing all additional home page sections */
function HomeSections() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "home-content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyChooseUs, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Questions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
/**
* Authentication Modal Component
* Supports Email/Password authentication, Google OAuth 2.0, WebAuthn Biometrics, and Password Reset flow.
*/
function LoginModal({ open, onClose }) {
	const navigate = useNavigate();
	const dialogRef = (0, import_react.useRef)(null);
	const [view, setView] = (0, import_react.useState)("login");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [resetEmail, setResetEmail] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setView("login");
		setStatus(null);
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKeyDown = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		dialogRef.current?.querySelector("input, button")?.focus();
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, onClose]);
	if (!open) return null;
	/** Complete login process and redirect user to application dashboard */
	const finishLogin = async () => {
		onClose();
		await navigate({ to: "/dashboard" });
	};
	/** Authenticate user using Email and Password via Supabase */
	const handlePasswordLogin = async (event) => {
		event.preventDefault();
		setStatus(null);
		if (!email.trim() || !password) {
			setStatus({
				tone: "error",
				message: "Enter your email and password."
			});
			return;
		}
		setBusy(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password
		});
		setBusy(false);
		if (error) {
			setStatus({
				tone: "error",
				message: error.message
			});
			return;
		}
		if (!remember) sessionStorage.setItem("neo-session-only", "1");
		await finishLogin();
	};
	/** Trigger Google OAuth 2.0 single sign-on redirect via Supabase */
	const handleGoogle = async () => {
		setStatus(null);
		setBusy(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		setBusy(false);
		if (error) {
			setStatus({
				tone: "error",
				message: error.message ?? "Google sign-in failed."
			});
			return;
		}
	};
	const handleBiometric = async () => {
		setStatus({
			tone: "info",
			message: "Waiting for your device to verify you…"
		});
		setBusy(true);
		const result = await signInWithBiometric();
		setBusy(false);
		if (!result.ok) {
			setStatus({
				tone: "error",
				message: result.error
			});
			return;
		}
		setStatus({
			tone: "success",
			message: "Verified. Opening your dashboard…"
		});
		await finishLogin();
	};
	const handleForgot = async (event) => {
		event.preventDefault();
		setStatus(null);
		if (!resetEmail.trim()) {
			setStatus({
				tone: "error",
				message: "Enter your email address."
			});
			return;
		}
		setBusy(true);
		const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), { redirectTo: `${window.location.origin}/reset-password` });
		setBusy(false);
		setStatus(error ? {
			tone: "error",
			message: "We could not process that request. Please try again shortly."
		} : {
			tone: "success",
			message: "If that address belongs to a Neo account, a password reset link is on its way. The link expires shortly."
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "auth-overlay",
		onMouseDown: (e) => e.target === e.currentTarget && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "auth-modal",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Login to your Account",
			ref: dialogRef,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "auth-close",
					onClick: onClose,
					"aria-label": "Close login",
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "auth-art",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: auth_side_illustration_default,
						alt: "",
						loading: "lazy",
						width: 1024,
						height: 1024
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Eliminate delays. Eliminate errors. Eliminate cash." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "auth-form-side",
					children: view === "biometric" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BiometricPanel, {
						title: "Verify your identity using your device",
						instruction: "Your device will ask for a fingerprint, face scan or PIN.",
						actionLabel: "Click the round icon to scan your fingerprint",
						onScan: handleBiometric,
						onCancel: () => {
							setStatus(null);
							setView("login");
						},
						status,
						busy,
						secondary: {
							label: "Use email and password instead",
							onClick: () => setView("login")
						}
					}) : view === "forgot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "auth-form",
						onSubmit: handleForgot,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "auth-heading",
								children: "Reset your password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "auth-subtitle",
								children: "We will email a secure, time-limited reset link to your registered address."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "auth-label",
								htmlFor: "reset-email",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "reset-email",
								type: "email",
								className: "auth-input",
								placeholder: "mail@abc.com",
								value: resetEmail,
								onChange: (e) => setResetEmail(e.target.value),
								autoComplete: "email"
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
								children: busy ? "Sending…" : "Send reset link"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "auth-link-button",
								onClick: () => setView("login"),
								children: "Back to login"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "auth-form",
						onSubmit: handlePasswordLogin,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "auth-heading",
								children: "Login to your Account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "auth-subtitle",
								children: "See what is going on with your business"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "auth-google",
								onClick: handleGoogle,
								disabled: busy,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMark, {}), " Continue with Google"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "auth-divider",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "or Sign in with Email" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "auth-label",
								htmlFor: "login-email",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "login-email",
								type: "email",
								className: "auth-input",
								placeholder: "mail@abc.com",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								autoComplete: "email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "auth-label",
								htmlFor: "login-password",
								children: "Password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "login-password",
								type: "password",
								className: "auth-input",
								placeholder: "••••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								autoComplete: "current-password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "auth-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "auth-check",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: remember,
										onChange: (e) => setRemember(e.target.checked)
									}), "Remember Me"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "auth-inline-link",
									onClick: () => setView("forgot"),
									children: "Forgot Password?"
								})]
							}),
							status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `auth-status auth-status--${status.tone}`,
								role: "status",
								"aria-live": "polite",
								children: status.message
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "auth-primary",
								onClick: () => {
									setStatus(null);
									setView("biometric");
								},
								disabled: busy,
								children: "Biometric Login"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "auth-primary",
								type: "submit",
								disabled: busy,
								children: busy ? "Signing in…" : "Login"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "auth-footer",
								children: [
									"Not Registered Yet?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "auth-inline-link",
										onClick: () => {
											onClose();
											navigate({ to: "/signup" });
										},
										children: "Create an account"
									})
								]
							})
						]
					})
				})
			]
		})
	});
}
function GoogleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 48 48",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 6.8-10.1 6.8-17.2Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M10.4 28.7a14.5 14.5 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48Z"
			})
		]
	});
}
var purple_finance_illustration_default = "/assets/purple-finance-illustration-CTntMLo1.png";
var green_finance_illustration_default = "/assets/green-finance-illustration-BOhejVI1.png";
var neo_green_logo_default = "/assets/neo-green-logo-hO-4aMJx.png";
/**
* Main Landing Page Route (`/`)
* 
* Features dual full-screen hero sections (Purple and Green themes),
* smooth scroll snapping, keyboard and touch gesture navigation,
* English/Bangla language switching, and the login modal trigger.
*/
var content = {
	en: {
		intro: "Neo Cash AI",
		heading: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Intelligent ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cashless" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"Financial Ecosystem"
		] }),
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Transforming institutional finance with AI,",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
			" biometric security, and fully automated",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
			" digital transactions.",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"Fast. Secure. Transparent. Paperless."
		] }),
		how: "How To Use",
		home: "Home",
		login: "Login"
	},
	bn: {
		intro: "নিও ক্যাশ এআই",
		heading: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"বুদ্ধিমান ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ক্যাশলেস" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"আর্থিক ইকোসিস্টেম"
		] }),
		body: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"এআই, বায়োমেট্রিক নিরাপত্তা এবং সম্পূর্ণ স্বয়ংক্রিয়",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
			" ডিজিটাল লেনদেনের মাধ্যমে প্রাতিষ্ঠানিক অর্থায়নে রূপান্তর।",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"দ্রুত। নিরাপদ। স্বচ্ছ। কাগজবিহীন।"
		] }),
		how: "ব্যবহারবিধি",
		home: "হোম",
		login: "লগইন"
	}
};
function NeoLogo({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: compact ? "neo-logo neo-logo--compact" : "neo-logo",
		"aria-label": "Neo",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			className: "neo-logo__purple",
			src: neo_purple_logo_default,
			alt: "Neo Purple"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			className: "neo-logo__green",
			src: neo_green_logo_default,
			alt: "Neo Green"
		})]
	});
}
function NeoCashless() {
	const viewportRef = (0, import_react.useRef)(null);
	const sectionsRef = (0, import_react.useRef)([]);
	(0, import_react.useRef)(null);
	const [active, setActive] = (0, import_react.useState)(0);
	const [language, setLanguage] = (0, import_react.useState)("en");
	const { login: loginParam } = Route.useSearch();
	const [loginOpen, setLoginOpen] = (0, import_react.useState)(Boolean(loginParam));
	const copy = content[language];
	(0, import_react.useEffect)(() => {
		const root = viewportRef.current;
		if (!root) return;
		const observer = new IntersectionObserver((entries) => {
			const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
			if (visible) setActive(Number(visible.target.dataset["slide"]));
		}, {
			root,
			threshold: [
				.45,
				.6,
				.8
			]
		});
		sectionsRef.current.forEach((section) => section && observer.observe(section));
		return () => observer.disconnect();
	}, []);
	/** Smooth scroll to a specific slide index (0 = Purple, 1 = Green) */
	const goTo = (index) => {
		setActive(index);
		const root = viewportRef.current;
		if (root) root.scrollTo({
			left: index * root.clientWidth,
			behavior: "smooth"
		});
	};
	const isDraggingRef = (0, import_react.useRef)(false);
	const dragStartXRef = (0, import_react.useRef)(0);
	const dragStartYRef = (0, import_react.useRef)(0);
	const scrollStartLeftRef = (0, import_react.useRef)(0);
	const isHorizontalRef = (0, import_react.useRef)(null);
	const handlePointerDown = (event) => {
		if (event.target?.closest("button, a, input, select, textarea")) return;
		if (event.button !== 0 && event.pointerType === "mouse") return;
		const root = viewportRef.current;
		if (!root) return;
		isDraggingRef.current = true;
		dragStartXRef.current = event.clientX;
		dragStartYRef.current = event.clientY;
		scrollStartLeftRef.current = root.scrollLeft;
		isHorizontalRef.current = null;
	};
	const handlePointerMove = (event) => {
		if (!isDraggingRef.current) return;
		const root = viewportRef.current;
		if (!root) return;
		const deltaX = event.clientX - dragStartXRef.current;
		const deltaY = event.clientY - dragStartYRef.current;
		if (isHorizontalRef.current === null) {
			if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) isHorizontalRef.current = Math.abs(deltaX) > Math.abs(deltaY);
		}
		if (isHorizontalRef.current) root.scrollLeft = scrollStartLeftRef.current - deltaX;
	};
	const handlePointerUp = (event) => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		const deltaX = event.clientX - dragStartXRef.current;
		const isHorizontal = isHorizontalRef.current;
		isHorizontalRef.current = null;
		if (isHorizontal && Math.abs(deltaX) > 35) if (deltaX < 0) goTo(active === 0 ? 1 : 0);
		else goTo(active === 1 ? 0 : 1);
		else if (isHorizontal) goTo(active);
	};
	(0, import_react.useEffect)(() => {
		const root = viewportRef.current;
		if (!root) return;
		const onWheel = (event) => {
			if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 10) {
				event.preventDefault();
				root.scrollLeft += event.deltaX;
			}
		};
		root.addEventListener("wheel", onWheel, { passive: false });
		return () => root.removeEventListener("wheel", onWheel);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKeyDown = (event) => {
			if (window.scrollY >= window.innerHeight * .75) return;
			if (event.target?.closest("button, a, input, select, textarea")) return;
			if (event.key === "ArrowRight") {
				event.preventDefault();
				goTo(active === 0 ? 1 : 0);
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				goTo(active === 1 ? 0 : 1);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [active]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `neo-page neo-page--${active === 0 ? "purple" : "green"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "neo-hero-shell",
				id: "top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "neo-header",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "neo-brand-button",
							onClick: () => goTo(0),
							"aria-label": "Neo Cashless home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeoLogo, { compact: true })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "neo-nav",
							"aria-label": "Main navigation",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => goTo(0),
									children: copy.home
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "language-selector",
									"aria-label": "Language selector",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: language === "en" ? "is-selected" : "",
											onClick: () => setLanguage("en"),
											children: "Eng"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "|"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: language === "bn" ? "is-selected" : "",
											onClick: () => setLanguage("bn"),
											children: "বাংলা"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setLoginOpen(true),
									children: copy.login
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "neo-scroll",
						ref: viewportRef,
						onPointerDown: handlePointerDown,
						onPointerMove: handlePointerMove,
						onPointerUp: handlePointerUp,
						onPointerCancel: handlePointerUp,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, {
							sectionRef: (node) => {
								sectionsRef.current[0] = node;
							},
							theme: "purple",
							illustration: purple_finance_illustration_default,
							illustrationAlt: "Woman presenting a digital bank and cashless payments",
							copy
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, {
							sectionRef: (node) => {
								sectionsRef.current[1] = node;
							},
							theme: "green",
							illustration: green_finance_illustration_default,
							illustrationAlt: "Person using a laptop surrounded by digital finance tools",
							copy
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "slide-indicators",
						"aria-label": "Choose landing section",
						children: [0, 1].map((index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: active === index ? "is-active" : "",
							onClick: () => goTo(index),
							"aria-label": `Go to ${index === 0 ? "purple" : "green"} section`,
							"aria-current": active === index ? "true" : void 0
						}, index))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeSections, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginModal, {
				open: loginOpen,
				onClose: () => setLoginOpen(false)
			})
		]
	});
}
function HeroSection({ sectionRef, theme, illustration, illustrationAlt, copy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: sectionRef,
		"data-slide": theme === "purple" ? 0 : 1,
		className: `hero hero--${theme}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hero-decoration",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hero-inner",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hero-intro",
						children: copy.intro
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: copy.heading }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hero-description",
						children: copy.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "how-button",
						onClick: () => window.alert("Neo Cashless usage guide is coming soon."),
						children: copy.how
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hero-art",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: illustration,
					alt: illustrationAlt
				})
			})]
		})]
	});
}
//#endregion
export { NeoCashless as component };
