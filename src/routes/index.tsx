import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import purpleIllustration from "../assets/purple-finance-illustration.png";
import greenIllustration from "../assets/green-finance-illustration.png";

export const Route = createFileRoute("/")({
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

function NeoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "neo-logo neo-logo--compact" : "neo-logo"} aria-label="Neo">
      <span>Neo</span>
    </div>
  );
}

function NeoCashless() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);
  const [language, setLanguage] = useState<Language>("en");
  const copy = content[language];

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

  const goTo = (index: number) => sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, select, textarea")) return;
      if (["ArrowDown", "PageDown", "End"].includes(event.key)) {
        event.preventDefault();
        goTo(1);
      }
      if (["ArrowUp", "PageUp", "Home"].includes(event.key)) {
        event.preventDefault();
        goTo(0);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className={`neo-page neo-page--${active === 0 ? "purple" : "green"}`}>
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
          <button onClick={() => window.alert("Login is coming soon.")}>{copy.login}</button>
        </nav>
      </header>

      <div className="neo-scroll" ref={viewportRef}>
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
    </main>
  );
}

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