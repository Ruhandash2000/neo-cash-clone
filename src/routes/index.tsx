/**
 * Main Landing Page Route (`/`)
 * 
 * Features dual full-screen hero sections (Purple and Green themes),
 * smooth scroll snapping, keyboard and touch gesture navigation,
 * English/Bangla language switching, and the login modal trigger.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { HomeSections } from "@/components/home-sections";
import { LoginModal } from "@/components/auth/login-modal";
import purpleIllustration from "../assets/purple-finance-illustration.png";
import greenIllustration from "../assets/green-finance-illustration.png";
import purpleLogo from "../assets/neo-purple-logo.png";
import greenLogo from "../assets/neo-green-logo.png";

// Define TanStack Start Route configuration with search validation & meta headers
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { login?: boolean } =>
    search["login"] === true || search["login"] === "true" ? { login: true } : {},
  head: () => ({
    meta: [
      { title: "Neo Cashless — Intelligent Financial Ecosystem" },
      {
        name: "description",
        content: "Neo Cash AI transforms institutional finance with AI, biometric security, and automated digital transactions.",
      },
      { property: "og:title", content: "Neo Cashless — Intelligent Financial Ecosystem" },
      {
        property: "og:description",
        content: "Fast, secure, transparent, and paperless institutional finance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NeoCashless,
});

/* ==========================================================================
   Internationalization (i18n) Dictionary Content
   ========================================================================== */
const content = {
  en: {
    intro: "Neo Cash AI",
    heading: <>Intelligent <span>Cashless</span><br />Financial Ecosystem</>,
    body: <>Transforming institutional finance with AI,<br className="hidden sm:block" /> biometric security, and fully automated<br className="hidden sm:block" /> digital transactions.<br />Fast. Secure. Transparent. Paperless.</>,
    how: "How To Use",
    home: "Home",
    login: "Login",
  },
  bn: {
    intro: "নিও ক্যাশ এআই",
    heading: <>বুদ্ধিমান <span>ক্যাশলেস</span><br />আর্থিক ইকোসিস্টেম</>,
    body: <>এআই, বায়োমেট্রিক নিরাপত্তা এবং সম্পূর্ণ স্বয়ংক্রিয়<br className="hidden sm:block" /> ডিজিটাল লেনদেনের মাধ্যমে প্রাতিষ্ঠানিক অর্থায়নে রূপান্তর।<br />দ্রুত। নিরাপদ। স্বচ্ছ। কাগজবিহীন।</>,
    how: "ব্যবহারবিধি",
    home: "হোম",
    login: "লগইন",
  },
};

type Language = keyof typeof content;

/* ==========================================================================
   Neo Brand Logo Component
   ========================================================================== */
function NeoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "neo-logo neo-logo--compact" : "neo-logo"} aria-label="Neo">
      <img className="neo-logo__purple" src={purpleLogo} alt="Neo Purple" />
      <img className="neo-logo__green" src={greenLogo} alt="Neo Green" />
    </div>
  );
}

/* ==========================================================================
   Main Neo Cashless Landing Page Component
   ========================================================================== */
function NeoCashless() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const [language, setLanguage] = useState<Language>("en");
  const { login: loginParam } = Route.useSearch();
  const [loginOpen, setLoginOpen] = useState(Boolean(loginParam));
  const copy = content[language];

  // Observer to track which section is currently visible on screen
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset["slide"]));
      },
      { root, threshold: [0.45, 0.6, 0.8] },
    );
    sectionsRef.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /** Smooth scroll to a specific slide index (0 = Purple, 1 = Green) */
  const goTo = (index: number) => {
    setActive(index);
    const root = viewportRef.current;
    if (root) {
      root.scrollTo({
        left: index * root.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Pointer & Touch Dragging Handlers for real-time live horizontal slide scrolling
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const isHorizontalRef = useRef<boolean | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, select, textarea")) return;
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const root = viewportRef.current;
    if (!root) return;

    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartYRef.current = event.clientY;
    scrollStartLeftRef.current = root.scrollLeft;
    isHorizontalRef.current = null;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const root = viewportRef.current;
    if (!root) return;

    const deltaX = event.clientX - dragStartXRef.current;
    const deltaY = event.clientY - dragStartYRef.current;

    if (isHorizontalRef.current === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isHorizontalRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalRef.current) {
      root.scrollLeft = scrollStartLeftRef.current - deltaX;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const deltaX = event.clientX - dragStartXRef.current;
    const isHorizontal = isHorizontalRef.current;
    isHorizontalRef.current = null;

    if (isHorizontal && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        goTo(active === 0 ? 1 : 0);
      } else {
        goTo(active === 1 ? 0 : 1);
      }
    } else if (isHorizontal) {
      goTo(active);
    }
  };

  // Trackpad / Mouse horizontal wheel scrolling listener
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const onWheel = (event: WheelEvent) => {
      // Only handle distinct horizontal wheel movements (deltaX)
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 10) {
        event.preventDefault();
        root.scrollLeft += event.deltaX;
      }
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  // Keyboard horizontal navigation listener (ArrowRight / ArrowLeft)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (window.scrollY >= window.innerHeight * 0.75) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, select, textarea")) return;
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

  return (
    <main className={`neo-page neo-page--${active === 0 ? "purple" : "green"}`}>
      <div className="neo-hero-shell" id="top">
        {/* Navigation Header */}
        <header className="neo-header">
          <button className="neo-brand-button" onClick={() => goTo(0)} aria-label="Neo Cashless home">
            <NeoLogo compact />
          </button>
          <nav className="neo-nav" aria-label="Main navigation">
            <button onClick={() => goTo(0)}>{copy.home}</button>
            <div className="language-selector" aria-label="Language selector">
              <button className={language === "en" ? "is-selected" : ""} onClick={() => setLanguage("en")}>Eng</button>
              <span aria-hidden="true">|</span>
              <button className={language === "bn" ? "is-selected" : ""} onClick={() => setLanguage("bn")}>বাংলা</button>
            </div>
            <button onClick={() => setLoginOpen(true)}>{copy.login}</button>
          </nav>
        </header>

        {/* Scroll Viewport Container for Hero Sections with Live Touch & Pointer Dragging */}
        <div
          className="neo-scroll"
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <HeroSection
            sectionRef={(node) => { sectionsRef.current[0] = node; }}
            theme="purple"
            illustration={purpleIllustration}
            illustrationAlt="Woman presenting a digital bank and cashless payments"
            copy={copy}
          />
          <HeroSection
            sectionRef={(node) => { sectionsRef.current[1] = node; }}
            theme="green"
            illustration={greenIllustration}
            illustrationAlt="Person using a laptop surrounded by digital finance tools"
            copy={copy}
          />
        </div>

        {/* Fixed Slide Indicator Dots */}
        <div className="slide-indicators" aria-label="Choose landing section">
          {[0, 1].map((index) => (
            <button
              key={index}
              className={active === index ? "is-active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Go to ${index === 0 ? "purple" : "green"} section`}
              aria-current={active === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      {/* Feature Sections & Auth Modal */}
      <HomeSections />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </main>
  );
}

/* ==========================================================================
   Hero Section Component
   ========================================================================== */
function HeroSection({
  sectionRef,
  theme,
  illustration,
  illustrationAlt,
  copy,
}: {
  sectionRef: (node: HTMLElement | null) => void;
  theme: "purple" | "green";
  illustration: string;
  illustrationAlt: string;
  copy: (typeof content)[Language];
}) {
  return (
    <section ref={sectionRef} data-slide={theme === "purple" ? 0 : 1} className={`hero hero--${theme}`}>
      <div className="hero-decoration" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-intro">{copy.intro}</p>
          <h1>{copy.heading}</h1>
          <p className="hero-description">{copy.body}</p>
          <button className="how-button" onClick={() => window.alert("Neo Cashless usage guide is coming soon.")}>{copy.how}</button>
        </div>
        <div className="hero-art">
          <img src={illustration} alt={illustrationAlt} />
        </div>
      </div>
    </section>
  );
}