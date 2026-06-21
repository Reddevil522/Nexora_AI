import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../Components/ThemeToggle.jsx";
import Footer from "../Components/Footer.jsx";
import "./Home.css";

/* ─── Reduced-motion helper ─── */
function prefersReducedMotion() {
    return typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── Tiny animation hook ─── */
function useInView(ref) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (prefersReducedMotion()) { setVisible(true); return; }
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return visible;
}

function FadeUp({ children, delay = 0, style = {} }) {
    const ref = useRef(null);
    const visible = useInView(ref);
    return (
        <div ref={ref} style={{
            transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            ...style
        }}>
            {children}
        </div>
    );
}

function CountUp({ end, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const visible = useInView(ref);
    const ran = useRef(false);
    useEffect(() => {
        if (!visible || ran.current) return;
        ran.current = true;
        if (prefersReducedMotion()) { setCount(end); return; }
        let start = 0;
        const step = (end / 1800) * 16;
        const t = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(t); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(t);
    }, [visible, end]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Icon set (hand-drawn outline icons, no external deps) ─── */
const iconProps = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const IconChat = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M21 11.5c0 4.5-4 8-9 8a9.6 9.6 0 0 1-3.8-.8L3 20l1.4-3.7A8.4 8.4 0 0 1 3 11.5c0-4.5 4-8 9-8s9 3.5 9 8z" /></svg>);
const IconPen = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" /><path d="M18.4 2.6a2 2 0 0 1 2.8 2.8L11 15.6l-4 1 1-4 10.4-10z" /></svg>);
const IconCode = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></svg>);
const IconSearch = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.4-4.4" /></svg>);
const IconHistory = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.3" /><path d="M3 4v5h5" /><path d="M12 7v5l3.5 2" /></svg>);
const IconSync = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>);
const IconCheck = (p) => (<svg {...iconProps} width={14} height={14} {...p} aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>);
const IconArrowRight = (p) => (<svg {...iconProps} width={16} height={16} {...p} aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>);
const IconPlay = (p) => (<svg {...iconProps} width={14} height={14} fill="currentColor" {...p} aria-hidden="true"><path d="M6 3l15 9-15 9V3z" /></svg>);
const IconMenu = (p) => (<svg {...iconProps} width={22} height={22} {...p} aria-hidden="true"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>);
const IconClose = (p) => (<svg {...iconProps} width={22} height={22} {...p} aria-hidden="true"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>);
const IconChevron = (p) => (<svg {...iconProps} width={18} height={18} {...p} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>);
const IconMail = (p) => (<svg {...iconProps} width={15} height={15} {...p} aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M3 6l9 7 9-7" /></svg>);
const IconLink = (p) => (<svg {...iconProps} width={15} height={15} {...p} aria-hidden="true"><path d="M9 17H7a5 5 0 0 1 0-10h2" /><path d="M15 7h2a5 5 0 0 1 0 10h-2" /><path d="M8 12h8" /></svg>);
const IconRss = (p) => (<svg {...iconProps} width={15} height={15} {...p} aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>);
const IconAt = (p) => (<svg {...iconProps} width={15} height={15} {...p} aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5" /></svg>);

/* Nexus mark — three connected nodes; the page's recurring signature */
function NodeMark({ size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 7L5 17M12 7L19 17M5 17H19" stroke="var(--amber)" strokeWidth="1.1" opacity=".55" />
            <circle cx="12" cy="6" r="2.2" fill="var(--amber)" />
            <circle cx="5" cy="18" r="2.2" fill="var(--amber)" />
            <circle cx="19" cy="18" r="2.2" fill="var(--amber)" />
        </svg>
    );
}

/* Ambient node-field — replaces the generic gradient-blob background */
function NodeField() {
    const nodes = [[120, 90], [340, 180], [80, 320], [260, 420], [520, 140], [680, 260], [900, 120], [1050, 300], [780, 460], [420, 560], [950, 560], [150, 560]];
    const edges = [[0, 1], [1, 4], [4, 5], [5, 6], [6, 7], [5, 8], [1, 3], [3, 2], [3, 9], [9, 11], [8, 10], [7, 10]];
    return (
        <svg className="node-field" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {edges.map(([a, b], i) => (
                <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="rgba(255,157,77,.16)" strokeWidth="1" />
            ))}
            {nodes.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3.5 : 2.5} fill={i % 3 === 0 ? "rgba(255,157,77,.5)" : "rgba(255,157,77,.28)"} />
            ))}
        </svg>
    );
}

function Divider() {
    return <div className="divider" aria-hidden="true"><span /><span /><span /></div>;
}

/* ─── DATA ─── */
const FEATURES = [
    { Icon: IconChat, title: "AI Chat Assistant", desc: "Real-time conversations with context memory, so you never have to re-explain yourself." },
    { Icon: IconPen, title: "Content Generation", desc: "Blogs, emails, social posts, and marketing copy, drafted in seconds and ready to edit." },
    { Icon: IconCode, title: "Code Assistant", desc: "Generate, debug, and review code across 40+ languages without leaving the chat." },
    { Icon: IconSearch, title: "Smart Search", desc: "Direct, sourced answers — not a page of links you still have to read." },
    { Icon: IconHistory, title: "Chat History", desc: "Every conversation synced to the cloud, searchable and resumable anytime." },
    { Icon: IconSync, title: "Multi-Device Sync", desc: "Start on desktop, finish on your phone. Everything stays in the same thread." },
];

const STATS = [
    { end: 50000, suffix: "+", label: "Users" },
    { end: 1000000, suffix: "+", label: "Messages generated" },
    { end: 99.9, suffix: "%", label: "Uptime" },
    { end: 150, suffix: "+", label: "Countries" },
];

const TESTIMONIALS = [
    { name: "Aryan Mehta", role: "Senior Software Developer", text: "Nexora has completely changed my workflow. I ship code faster and it actually remembers what we were working on.", initials: "AM" },
    { name: "Priya Sharma", role: "Content Creator", text: "Best AI platform I've used for drafting. The copy feels genuinely human — my engagement went up within a month.", initials: "PS" },
    { name: "Rahul Gupta", role: "Startup Founder", text: "Nexora saves the team hours every week. From investor decks to debugging, it's become our shared co-pilot.", initials: "RG" },
];

const PRICING = [
    { name: "Starter", price: "Free", period: "", desc: "Perfect for exploring", features: ["Basic AI chat", "10 messages a day", "Standard speed", "Web access"], cta: "Get started", hot: false },
    { name: "Pro", price: "₹499", period: "/month", desc: "For power users", features: ["Unlimited AI chats", "Priority speed", "Premium models", "Full chat history", "Code assistant", "Content generation"], cta: "Start Pro trial", hot: true },
    { name: "Enterprise", price: "Custom", period: "", desc: "For growing teams", features: ["Everything in Pro", "Team workspace", "Advanced analytics", "API integration", "Dedicated support", "Custom AI tuning"], cta: "Contact sales", hot: false },
];

const FAQ_ITEMS = [
    { q: "Is Nexora AI free to use?", a: "Yes — the Starter plan is free with basic AI chat included. No card required to get started." },
    { q: "Can I use it for coding projects?", a: "Yes. The Code Assistant supports 40+ languages and can debug, explain, and generate code from a plain-language prompt." },
    { q: "Is my data secure?", a: "Conversations are encrypted end-to-end and we never train models on your private chats. Your data stays yours." },
    { q: "Do you save my conversations?", a: "On Pro and above, every chat is cloud-synced with full history. You can export or delete it whenever you like." },
    { q: "Which AI model powers Nexora?", a: "Nexora runs on a blend of frontier models, tuned for everyday productivity and creative work." },
];

const INTEGRATIONS = ["GitHub", "Slack", "Notion", "Figma", "Linear", "Google Drive"];

/* ─── COMPONENT ─── */
export default function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [typed, setTyped] = useState("");
    const fullText = "Building a JWT auth system with refresh tokens and RBAC...";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (prefersReducedMotion()) { setTyped(fullText); return; }
        let i = 0;
        const t = setInterval(() => {
            if (i < fullText.length) { setTyped(fullText.slice(0, ++i)); }
            else clearInterval(t);
        }, 45);
        return () => clearInterval(t);
    }, []);

    const navLinks = ["Features", "Pricing", "Testimonials", "FAQ"];

    return (
        <>
            {/* Background */}
            <div className="bg-blobs">
                <div className="glow glow1" />
                <div className="glow glow2" />
                <NodeField />
            </div>

            {/* ── NAVBAR ── */}
            <nav className={`nav${scrolled ? " scrolled" : ""}`}>
                <div className="nav-inner">
                    <a href="#" className="logo">
                        <div className="logo-icon"><NodeMark size={16} /></div>
                        Nexora AI
                    </a>
                    <ul className="nav-links">
                        {navLinks.map(l => (
                            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
                        ))}
                    </ul>
                    <div className="nav-actions">
                        <Link className="btn-ghost" to="/login">Log in</Link>
                        <Link className="btn-primary" to="/signup">Get started <IconArrowRight width={14} height={14} /></Link>
                        <ThemeToggle />
                    </div>
                    <button className="hamburger" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(o => !o)}>
                        {mobileOpen ? <IconClose /> : <IconMenu />}
                    </button>
                </div>
                <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
                    {navLinks.map(l => (
                        <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}>{l}</a>
                    ))}
                    <div className="mobile-menu-btns">
                        <Link className="btn-ghost" to="/login">Log in</Link>
                        <Link className="btn-primary" to="/signup">Get started</Link>
                        <ThemeToggle />
                    </div>

                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="hero">
                <div className="hero-inner wrap hero-grid">
                    {/* Left */}
                    <FadeUp>
                        <div className="eyebrow">Powered by advanced AI</div>
                        <h1 className="hero-title">
                            Where ideas, code, and<br />
                            content all <em>connect</em>
                        </h1>
                        <p className="hero-sub">
                            Nexora brings chat, writing, code, and search into one connected workspace — built for people who'd rather not juggle five different tools.
                        </p>
                        <div className="hero-btns">
                            <button className="btn-hero-primary">Start free <IconArrowRight /></button>
                            <button className="btn-outline"><IconPlay /> Watch demo</button>
                        </div>
                        <div className="trust-row">
                            <div className="avatars" aria-hidden="true">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="avatar-dot" />)}
                            </div>
                            <div>
                                <div className="stars" aria-hidden="true">★★★★★</div>
                                <div className="trust-text">Trusted by 50,000+ builders</div>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Right — Dashboard */}
                    <div className="hero-dashboard">
                        <div className="dashboard" aria-hidden="true">
                            <div className="dash-bar">
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="dot-green" />
                                    <span className="dash-bar-label">Nexora online</span>
                                </div>
                                <span className="dash-bar-meta">3 active sessions</span>
                            </div>
                            <div className="dash-content">
                                <div className="msg-user">Create a React authentication system</div>
                                <div className="msg-ai-wrap">
                                    <div className="ai-avatar"><NodeMark size={13} /></div>
                                    <div className="msg-ai">
                                        {typed || "I'll build a complete auth system for you..."}
                                        <span className="cursor-blink" />
                                    </div>
                                </div>
                                <div className="code-block">
                                    <div className="code-comment">{"// JWT auth setup"}</div>
                                    <div><span className="code-kw">const</span> <span className="code-id">token</span> = <span className="code-fn">jwt</span>.sign(payload, SECRET);</div>
                                    <div><span className="code-kw">const</span> <span className="code-id">auth</span> = <span className="code-fn">middleware</span>(verify);</div>
                                </div>
                                <div className="typing-dots">
                                    <div className="tdot" /><div className="tdot" /><div className="tdot" />
                                    <span style={{ marginLeft: 4 }}>Nexora is thinking...</span>
                                </div>
                            </div>
                            <div className="dash-input">
                                <div className="input-fake">Ask Nexora anything...</div>
                                <button className="send-btn" tabIndex={-1} aria-hidden="true"><IconArrowRight width={15} height={15} /></button>
                            </div>
                            {/* <div className="dash-tag"><NodeMark size={12} /> <b>4 tools</b> connected in this chat</div> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── INTEGRATIONS ── */}
            <section className="companies">
                <p className="companies-label">Connects with the tools you already use</p>
                <div className="marquee-wrap">
                    <div className="marquee-track">
                        {[...INTEGRATIONS, ...INTEGRATIONS].map((c, i) => (
                            <div key={i} className="marquee-item">
                                <span className="node-dot" />
                                {c}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="features-section">
                <div className="wrap">
                    <FadeUp>
                        <div className="section-header">
                            <div className="eyebrow">Capabilities</div>
                            <h2 className="section-title">Everything connects to<br />one workspace</h2>
                            <p className="section-sub">Six tools, one model, zero context-switching between tabs.</p>
                        </div>
                    </FadeUp>
                    <FadeUp delay={0.05}>
                        <div className="features-grid">
                            {FEATURES.map((f, i) => (
                                <div className="feat-card" key={i}>
                                    <div className="feat-icon"><f.Icon /></div>
                                    <div className="feat-title">{f.title}</div>
                                    <div className="feat-desc">{f.desc}</div>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </section>

            <Divider />

            {/* ── AI SHOWCASE ── */}
            <section className="showcase-section">
                <div className="wrap">
                    <div className="showcase-inner">
                        <FadeUp>
                            <div className="showcase-ui" aria-hidden="true">
                                <div className="sui-bar">
                                    <span className="sui-bar-live">
                                        <span className="dot-green" style={{ width: 6, height: 6 }} />
                                        Nexora chat
                                    </span>
                                    <span>thread #14</span>
                                </div>
                                <div className="sui-content">
                                    <div className="msg-user" style={{ alignSelf: "flex-end", fontSize: 13 }}>Explain how neural networks learn</div>
                                    <div className="msg-ai-wrap">
                                        <div className="ai-avatar" style={{ width: 24, height: 24 }}><NodeMark size={11} /></div>
                                        <div className="msg-ai" style={{ fontSize: 13 }}>Neural networks learn through backpropagation — adjusting weights iteratively to minimise prediction error via gradient descent.</div>
                                    </div>
                                    <div className="code-block" style={{ fontSize: 12 }}>
                                        <div className="code-comment"># gradient descent</div>
                                        <div><span className="code-kw">weights</span> -= <span className="code-id">lr</span> * <span className="code-fn">gradient</span></div>
                                    </div>
                                    <div className="typing-dots">
                                        <div className="tdot" /><div className="tdot" /><div className="tdot" />
                                        <span style={{ marginLeft: 4 }}>Nexora is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                        <FadeUp delay={0.15}>
                            <div className="eyebrow">Why Nexora</div>
                            <h2 className="section-title" style={{ textAlign: "left", marginBottom: 12 }}>AI that keeps<br />the thread</h2>
                            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, marginBottom: 8 }}>
                                Nexora doesn't just answer questions — it remembers context across chat, code, and search, so every reply builds on the last one instead of starting over.
                            </p>
                            <div className="benefits-list">
                                {["Human-like responses", "Advanced reasoning", "Coding assistance", "Personalized learning", "Context awareness", "Lightning fast"].map((b, i) => (
                                    <div key={i} className="benefit-item">
                                        <div className="check-circle"><IconCheck /></div>
                                        <span className="benefit-text">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="stats-section">
                <div className="wrap">
                    <FadeUp>
                        <div className="section-header">
                            <div className="eyebrow">By the numbers</div>
                            <h2 className="section-title">Used at scale</h2>
                        </div>
                    </FadeUp>
                    <FadeUp delay={0.05}>
                        <div className="stats-grid">
                            {STATS.map((s, i) => (
                                <div className="stat-card" key={i}>
                                    <div className="stat-value"><CountUp end={s.end} suffix={s.suffix} /></div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="how-section">
                <div className="wrap">
                    <FadeUp>
                        <div className="section-header">
                            <div className="eyebrow">Process</div>
                            <h2 className="section-title">How it works</h2>
                        </div>
                    </FadeUp>
                    <div className="how-grid">
                        {[
                            { step: "01", title: "Ask anything", desc: "Type your question, task, or idea in plain language. No special syntax needed." },
                            { step: "02", title: "Nexora reads the context", desc: "It understands intent, recalls the thread, and reasons through your request." },
                            { step: "03", title: "Get a useful result", desc: "Receive a precise, actionable reply — text, code, or structured content." },
                        ].map((h, i) => (
                            <FadeUp key={i} delay={i * 0.12}>
                                <div className="how-card">
                                    <div className="how-num">{h.step}</div>
                                    <div className="how-title">{h.title}</div>
                                    <div className="how-desc">{h.desc}</div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section id="testimonials" className="testi-section">
                <div className="wrap">
                    <FadeUp>
                        <div className="section-header">
                            <div className="eyebrow">Testimonials</div>
                            <h2 className="section-title">Loved by builders worldwide</h2>
                        </div>
                    </FadeUp>
                    <div className="testi-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <FadeUp key={i} delay={i * 0.1}>
                                <div className="testi-card">
                                    <div className="stars-row" aria-hidden="true">★★★★★</div>
                                    <p className="testi-text">"{t.text}"</p>
                                    <div className="testi-author">
                                        <div className="testi-avatar">{t.initials}</div>
                                        <div>
                                            <div className="testi-name">{t.name}</div>
                                            <div className="testi-role">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section id="pricing" className="pricing-section">
                <div className="wrap">
                    <FadeUp>
                        <div className="section-header">
                            <div className="eyebrow">Pricing</div>
                            <h2 className="section-title">Simple, transparent pricing</h2>
                            <p className="section-sub">Start free. Upgrade when you're ready.</p>
                        </div>
                    </FadeUp>
                    <div className="pricing-grid">
                        {PRICING.map((p, i) => (
                            <FadeUp key={i} delay={i * 0.1}>
                                <div className={`price-card${p.hot ? " hot" : ""}`}>
                                    {p.hot && <div className="hot-badge">Recommended</div>}
                                    <div className="price-name">{p.name}</div>
                                    <div className="price-desc">{p.desc}</div>
                                    <div style={{ marginBottom: 4 }}>
                                        <span className="price-value">{p.price}</span>
                                        <span className="price-period">{p.period}</span>
                                    </div>
                                    <ul className="price-features">
                                        {p.features.map((f, j) => (
                                            <li key={j} className="price-feat">
                                                <span className="check-ic"><IconCheck /></span>{f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`price-btn ${p.hot ? "primary" : "outline"}`}>{p.cta}</button>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="faq-section">
                <div className="wrap">
                    <FadeUp>
                        <div className="section-header">
                            <div className="eyebrow">FAQ</div>
                            <h2 className="section-title">Frequently asked questions</h2>
                        </div>
                    </FadeUp>
                    <div className="faq-list">
                        {FAQ_ITEMS.map((item, i) => (
                            <FadeUp key={i} delay={i * 0.06}>
                                <div className="faq-item">
                                    <button className="faq-q" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        {item.q}
                                        <span className={`faq-arrow${openFaq === i ? " open" : ""}`}><IconChevron /></span>
                                    </button>
                                    <div className={`faq-answer${openFaq === i ? " open" : ""}`}>{item.a}</div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-section">
                <FadeUp>
                    <div className="cta-box">
                        <div className="cta-glow" aria-hidden="true" />
                        <h2 className="cta-title">
                            Ready to start<br />
                            <em>connecting</em>?
                        </h2>
                        <p className="cta-sub">Join 50,000+ builders already working faster with Nexora AI.</p>
                        <div className="cta-btns">
                            <Link className="btn-white" to="/signup">Start free <IconArrowRight /></Link>
                            <button className="btn-outline">Contact sales</button>
                        </div>
                    </div>
                </FadeUp>
            </section>

            {/* ── FOOTER ── */}
            <Footer />
        </>
    );
}