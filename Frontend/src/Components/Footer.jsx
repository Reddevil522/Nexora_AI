import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaEnvelope,
} from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";

/* ─── Reduced-motion helper ─── */
function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

/* ─── Scroll-in animation hook ─── */
function useInView(ref, threshold = 0.1) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (prefersReducedMotion()) {
            setVisible(true);
            return;
        }
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) setVisible(true);
            },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return visible;
}

function FadeUp({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    const visible = useInView(ref);
    return (
        <div
            ref={ref}
            className={`footer-fadein ${visible ? "footer-fadein--visible" : ""} ${className}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
}

/* ─── Node/logo mark (reused from Home) ─── */
function NodeMark({ size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 7L5 17M12 7L19 17M5 17H19"
                stroke="var(--amber)"
                strokeWidth="1.1"
                opacity=".55"
            />
            <circle cx="12" cy="6" r="2.2" fill="var(--amber)" />
            <circle cx="5" cy="18" r="2.2" fill="var(--amber)" />
            <circle cx="19" cy="18" r="2.2" fill="var(--amber)" />
        </svg>
    );
}

/* ─── Mini inline SVG icons for Product links ─── */
const iconProps = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
};

const IcChat       = () => <svg {...iconProps}><path d="M21 11.5c0 4.5-4 8-9 8a9.6 9.6 0 0 1-3.8-.8L3 20l1.4-3.7A8.4 8.4 0 0 1 3 11.5c0-4.5 4-8 9-8s9 3.5 9 8z"/></svg>;
const IcSearch     = () => <svg {...iconProps}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.4-4.4"/></svg>;
const IcBot        = () => <svg {...iconProps}><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 3v4M8 11V9a4 4 0 0 1 8 0v2"/><circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/></svg>;
const IcHistory    = () => <svg {...iconProps}><path d="M3 12a9 9 0 1 0 2.6-6.3"/><path d="M3 4v5h5"/><path d="M12 7v5l3.5 2"/></svg>;
const IcZap        = () => <svg {...iconProps}><path d="M13 2L4.09 12.96H12L11 22l8.91-10.96H13L13 2z"/></svg>;
const IcDoc        = () => <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IcShield     = () => <svg {...iconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcScale      = () => <svg {...iconProps}><path d="M12 3v18M5 21h14"/><path d="M3 7l9-4 9 4M3 7l4.5 9a4.5 4.5 0 0 0 9 0L21 7"/></svg>;
const IcHelp       = () => <svg {...iconProps}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcHeadset    = () => <svg {...iconProps}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
const IcArrowRight = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>;

/* ─── DATA ─── */
const QUICK_LINKS = [
    { label: "Home",     to: "/home" },
    { label: "Features", to: "/home#features" },
    { label: "About",    to: "/home" },
    { label: "Pricing",  to: "/home#pricing" },
    { label: "Contact",  to: "/home" },
    { label: "FAQ",      to: "/home#faq" },
];

const PRODUCT_LINKS = [
    { label: "AI Chat",         Icon: IcChat },
    { label: "AI Search",       Icon: IcSearch },
    { label: "AI Assistant",    Icon: IcBot },
    { label: "Chat History",    Icon: IcHistory },
    { label: "Smart Responses", Icon: IcZap },
];

const RESOURCE_LINKS = [
    { label: "Documentation",    Icon: IcDoc },
    { label: "Privacy Policy",   Icon: IcShield },
    { label: "Terms & Conditions", Icon: IcScale },
    { label: "Help Center",      Icon: IcHelp },
    { label: "Support",          Icon: IcHeadset },
];

const SOCIAL_LINKS = [
    { Icon: FaGithub,    label: "GitHub",    href: "https://github.com/" },
    { Icon: FaLinkedin,  label: "LinkedIn",  href: "https://linkedin.com/" },
    { Icon: FaXTwitter,  label: "Twitter/X", href: "https://x.com/" },
    { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com/" },
    { Icon: FaEnvelope,  label: "Email",     href: "mailto:hello@nexoraai.com" },
];

/* Badge icon components */
const IcBadgeZap    = () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L4.09 12.96H12L11 22l8.91-10.96H13L13 2z"/></svg>;
const IcBadgeLock   = () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
const IcBadgeRocket = () => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;

const BADGES = [
    { Icon: IcBadgeZap,    label: "AI Powered" },
    { Icon: IcBadgeLock,   label: "Privacy Focused" },
    { Icon: IcBadgeRocket, label: "Lightning Fast" },
];

/* ─── Newsletter Section ─── */
function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2500);
            return;
        }
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1000);
    };

    return (
        <section className="newsletter-section" aria-label="Newsletter signup">
            <div className="newsletter-bg-nodes" aria-hidden="true">
                {/* Ambient lines */}
                <svg className="nl-svg" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid slice">
                    <line x1="0" y1="110" x2="1200" y2="110" stroke="rgba(255,157,77,.06)" strokeWidth="1" />
                    <line x1="600" y1="0" x2="600" y2="220" stroke="rgba(255,157,77,.06)" strokeWidth="1" />
                    <circle cx="600" cy="110" r="80" stroke="rgba(255,157,77,.07)" strokeWidth="1" fill="none" />
                    <circle cx="600" cy="110" r="160" stroke="rgba(255,157,77,.04)" strokeWidth="1" fill="none" />
                </svg>
            </div>
            <div className="newsletter-wrap">
                <FadeUp>
                    <div className="newsletter-card">
                        <div className="nl-card-glow" aria-hidden="true" />
                        <div className="nl-icon-wrap" aria-hidden="true">
                            <NodeMark size={22} />
                        </div>
                        <div className="nl-text">
                            <h2 className="nl-title">Stay Updated with Nexora AI</h2>
                            <p className="nl-sub">
                                Get updates about new AI features, product launches,<br className="nl-br" />
                                and future innovations — straight to your inbox.
                            </p>
                        </div>
                        <form className="nl-form" onSubmit={handleSubscribe} noValidate>
                            <div className={`nl-input-wrap ${status === "error" ? "nl-input-error" : ""}`}>
                                <svg className="nl-mail-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                                    <path d="M3 6l9 7 9-7" />
                                </svg>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    className="nl-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status === "error") setStatus("idle");
                                    }}
                                    aria-label="Email address for newsletter"
                                    aria-describedby={status === "error" ? "nl-error-msg" : undefined}
                                    autoComplete="email"
                                    disabled={status === "loading" || status === "success"}
                                />
                            </div>
                            {status === "error" && (
                                <p id="nl-error-msg" className="nl-error-msg" role="alert">
                                    Please enter a valid email address.
                                </p>
                            )}
                            <button
                                type="submit"
                                className={`nl-btn ${status}`}
                                disabled={status === "loading" || status === "success"}
                                aria-live="polite"
                            >
                                {status === "loading" && (
                                    <span className="nl-spinner" aria-hidden="true" />
                                )}
                                {status === "success" ? (
                                    <>
                                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        Subscribed!
                                    </>
                                ) : status === "loading" ? (
                                    "Subscribing..."
                                ) : (
                                    <>
                                        Subscribe <IcArrowRight />
                                    </>
                                )}
                            </button>
                        </form>
                        {status === "success" && (
                            <p className="nl-success-msg" role="status">
                                🎉 You're in! We'll keep you posted on everything Nexora.
                            </p>
                        )}
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}

/* ─── Main Footer ─── */
export default function Footer() {
    return (
        <>
            <NewsletterSection />

            <footer className="ft" aria-label="Site footer">
                {/* Subtle gradient bg overlay */}
                <div className="ft-bg" aria-hidden="true" />

                <div className="ft-inner">
                    {/* ── 5-Column Grid ── */}
                    <div className="ft-grid">

                        {/* Col 1 — Brand */}
                        <FadeUp delay={0} className="ft-col ft-col--brand">
                            <a href="/home" className="ft-logo" aria-label="Nexora AI home">
                                <div className="ft-logo-icon">
                                    <NodeMark size={16} />
                                </div>
                                <span className="ft-logo-text">Nexora AI</span>
                            </a>
                            <p className="ft-brand-desc">
                                The next generation AI assistant built to help users think, create,
                                learn, and work smarter.
                            </p>

                            {/* Badges */}
                            <div className="ft-badges" aria-label="Key features">
                                {BADGES.map(({ Icon, label }) => (
                                    <span key={label} className="ft-badge">
                                        <span className="ft-badge-icon" aria-hidden="true"><Icon /></span>
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {/* Social icons */}
                            <div className="ft-social" aria-label="Social media links">
                                {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ft-social-btn"
                                        aria-label={label}
                                        title={label}
                                    >
                                        <Icon aria-hidden="true" />
                                    </a>
                                ))}
                            </div>
                        </FadeUp>

                        {/* Col 2 — Quick Links */}
                        <FadeUp delay={0.07} className="ft-col">
                            <div className="ft-col-title">Quick Links</div>
                            <ul className="ft-links" role="list">
                                {QUICK_LINKS.map(({ label, to }) => (
                                    <li key={label}>
                                        <Link to={to} className="ft-link ft-link--nav">
                                            <span className="ft-link-arrow" aria-hidden="true">›</span>
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </FadeUp>

                        {/* Col 3 — Product */}
                        <FadeUp delay={0.14} className="ft-col">
                            <div className="ft-col-title">Product</div>
                            <ul className="ft-links" role="list">
                                {PRODUCT_LINKS.map(({ label, Icon }) => (
                                    <li key={label}>
                                        <a href="#" className="ft-link ft-link--product">
                                            <span className="ft-product-icon" aria-hidden="true">
                                                <Icon />
                                            </span>
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </FadeUp>

                        {/* Col 4 — Resources */}
                        <FadeUp delay={0.21} className="ft-col">
                            <div className="ft-col-title">Resources</div>
                            <ul className="ft-links" role="list">
                                {RESOURCE_LINKS.map(({ label, Icon }) => (
                                    <li key={label}>
                                        <a href="#" className="ft-link ft-link--product">
                                            <span className="ft-product-icon" aria-hidden="true">
                                                <Icon />
                                            </span>
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </FadeUp>

                        {/* Col 5 — CTA mini-card */}
                        <FadeUp delay={0.28} className="ft-col">
                            <div className="ft-col-title">Get Started</div>
                            <div className="ft-cta-card">
                                <div className="ft-cta-glow" aria-hidden="true" />
                                <div className="ft-cta-icon" aria-hidden="true">
                                    <NodeMark size={20} />
                                </div>
                                <p className="ft-cta-text">
                                    Ready to supercharge your workflow?
                                </p>
                                <Link to="/signup" className="ft-cta-btn">
                                    Start free <IcArrowRight />
                                </Link>
                                <Link to="/login" className="ft-cta-ghost">
                                    Sign in →
                                </Link>
                                <div className="ft-cta-note">No credit card required</div>
                            </div>
                        </FadeUp>
                    </div>

                    {/* ── Divider ── */}
                    <div className="ft-divider" aria-hidden="true">
                        <span /><span /><span />
                    </div>

                    {/* ── Bottom bar ── */}
                    <div className="ft-bottom" role="contentinfo">
                        {/* Left */}
                        <div className="ft-bottom-left">
                            <span className="ft-copy">© 2026 Gopal Kumar. All rights reserved.</span>
                        </div>

                        {/* Center */}
                        <div className="ft-bottom-center">
                            <span className="ft-built">
                                Built with{" "}
                                <span className="ft-heart" aria-label="love">
                                    <svg width={13} height={13} viewBox="0 0 24 24" fill="var(--amber)" stroke="var(--amber)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                </span>
                                {" "}for the future of work
                            </span>
                        </div>

                        {/* Right */}
                        <div className="ft-bottom-right">
                            <span className="ft-version-badge">v2.0</span>
                            <span className="ft-powered">
                                Powered by{" "}
                                <a href="/home" className="ft-powered-link">Nexora AI</a>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
