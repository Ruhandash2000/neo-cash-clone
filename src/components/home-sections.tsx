/**
 * Home Page Additional Content Sections Component
 * Contains "Why Choose Us" features grid, "Have Any Question?" FAQ accordion,
 * Contact form, and the main Site Footer.
 */

import { useState, type FormEvent } from "react";
import {
  BarChart3,
  CreditCard,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  PiggyBank,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Twitter,
  WalletCards,
} from "lucide-react";

import faqIllustration from "../assets/faq-financial-planning.png";
import purpleLogo from "../assets/neo-purple-logo.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

/* Feature highlights data list */
const features = [
  {
    title: "Personalized for you",
    description: "Designed to pick, add, and build features that are tailored to your needs.",
    icon: SlidersHorizontal,
    tone: "violet",
  },
  {
    title: "Streamlined payments",
    description: "Streamlined empowers you to establish milestones accordingly.",
    icon: WalletCards,
    tone: "blue",
  },
  {
    title: "Unlimited virtual cards",
    description: "Control by generating as many virtual credit cards as you need.",
    icon: CreditCard,
    tone: "yellow",
  },
  {
    title: "Accelerate your savings",
    description: "A high interest online savings account with no monthly fees.",
    icon: PiggyBank,
    tone: "violet",
  },
  {
    title: "Enhanced privacy",
    description: "With no visible card number on its surface, Neo keeps you safe.",
    icon: ShieldCheck,
    tone: "blue",
  },
  {
    title: "Built for growth",
    description: "Get access to financial risks data and build a clear strategy.",
    icon: BarChart3,
    tone: "yellow",
  },
] as const;

/* Frequently Asked Questions data list */
const faqs = [
  {
    question: "Why should I care about financial planning?",
    answer:
      "Financial planning is essential because it helps you achieve your financial goals and secure your financial future.",
  },
  {
    question: "What are the different types of investments?",
    answer:
      "Common options include savings products, bonds, shares, funds, property, and other assets with different risk and return profiles.",
  },
  {
    question: "How can I start saving for retirement?",
    answer:
      "Set a clear target, automate regular contributions, and choose a diversified plan that matches your timeline and comfort with risk.",
  },
  {
    question: "What is the importance of emergency funds?",
    answer:
      "An emergency fund helps cover unexpected costs without disrupting long-term goals or relying on high-interest debt.",
  },
];

/* Footer navigation columns definition */
const footerColumns = [
  { title: "Product", links: ["Overview", "Features", "Solutions", "Tutorials", "Pricing"] },
  { title: "Company", links: ["About us", "Careers", "News", "Media", "Contact"] },
  {
    title: "Helpful Links",
    links: ["Documentation", "API reference", "Status", "Legal Center", "Partnership"],
  },
];

function SectionHeading({ children, id }: { children: string; id?: string }) {
  return <h2 className="content-heading" id={id}>{children}</h2>;
}

/** "Why Choose Us" Feature Cards Section */
function WhyChooseUs() {
  return (
    <section className="content-section why-section" aria-labelledby="why-heading">
      <div className="content-shell">
        <h2 id="why-heading" className="content-heading">Why Choose Us</h2>
        <div className="feature-panel">
          {features.map(({ title, description, icon: Icon, tone }) => (
            <article className="feature-item" key={title}>
              <div className={`feature-icon feature-icon--${tone}`} aria-hidden="true">
                <Icon />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** FAQ Accordion Section */
function Questions() {
  return (
    <section className="content-section faq-section" aria-labelledby="faq-heading">
      <div className="content-shell">
        <h2 id="faq-heading" className="content-heading">Have Any Question?</h2>
        <div className="faq-layout">
          <div className="faq-art-wrap">
            <img
              src={faqIllustration}
              alt="Financial adviser considering savings and investment questions"
              loading="lazy"
              width={1200}
              height={900}
            />
            <div className="question-note" aria-hidden="true">
              <span>Got more</span>
              <strong>questions?</strong>
              <span>Reach Out!</span>
            </div>
          </div>
          <Accordion type="single" defaultValue="faq-0" collapsible className="faq-list">
            {faqs.map((faq, index) => (
              <AccordionItem value={`faq-${index}`} className="faq-item" key={faq.question}>
                <AccordionTrigger className="faq-trigger">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="faq-answer">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

/** User Message / Feedback Form Section */
function Contact() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      setStatus("Please write a message first.");
      return;
    }
    setMessage("");
    setStatus("Thank you — your message is ready for the Neo team.");
  };

  return (
    <section className="content-section contact-section" aria-labelledby="contact-heading">
      <div className="content-shell">
        <SectionHeading id="contact-heading">Contact Us</SectionHeading>
        <form className="contact-panel" onSubmit={submitMessage}>
          <label className="sr-only" htmlFor="neo-message">Message</label>
          <textarea
            id="neo-message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (status) setStatus("");
            }}
            placeholder="Send us a message...."
            rows={5}
          />
          <div className="contact-actions">
            <p aria-live="polite">{status}</p>
            <Button type="submit" className="send-button">
              <Send aria-hidden="true" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

/** Global Footer Component */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-brand">
          <a href="#top" className="footer-logo" aria-label="Neo home">
            <img src={purpleLogo} alt="Neo" />
          </a>
          <p>No paperwork. No queues. No cash.<br />Only fast, secure, AI-powered automation.</p>
          <h2>Contact</h2>
          <address>
            <a href="tel:+01000000000"><Phone aria-hidden="true" />01+++++++++</a>
            <a href="mailto:support@example.com"><Mail aria-hidden="true" />support@example.com</a>
            <span><MapPin aria-hidden="true" />Your institutional location</span>
          </address>
        </div>

        <div className="footer-nav-wrap">
          <nav className="footer-columns" aria-label="Footer navigation">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}><a href={`#${link.toLowerCase().replaceAll(" ", "-")}`}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="social-links" aria-label="Social media">
            <a href="#linkedin" aria-label="LinkedIn"><Linkedin /></a>
            <a href="#instagram" aria-label="Instagram"><Instagram /></a>
            <a href="#facebook" aria-label="Facebook"><Facebook /></a>
            <a href="#twitter" aria-label="Twitter X"><Twitter /></a>
          </div>
        </div>
        <p className="copyright">Copyright © 2026 Neo. All rights reserved</p>
      </div>
    </footer>
  );
}

/** Home Content Wrapper containing all additional home page sections */
export function HomeSections() {
  return (
    <div className="home-content">
      <WhyChooseUs />
      <Questions />
      <Contact />
      <Footer />
    </div>
  );
}