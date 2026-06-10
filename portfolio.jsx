// portfolio.jsx — Scrollable portfolio for Ronn
const { useState, useEffect, useRef } = React;

const AVATAR_ASSETS = {
  engineer: {
    neutral:    "assets/BlueSuit_Neutral.png",
    enterVideo: "assets/BlueSuit_Neutral_to_Shocked.mp4",
    leaveVideo: "assets/BlueSuit_Shocked_to_Neutral.mp4",
  },
  human: {
    neutral:    "assets/Human_Neutral.png",
    enterVideo: "assets/Human_Neutral_to_Shocked.mp4",
    leaveVideo: "assets/Human_Shocked_to_Neutral.mp4",
  },
};

const FONT_MAP = {
  "Archivo Black": "'Archivo Black', system-ui, sans-serif",
  "Syne":          "'Syne', system-ui, sans-serif",
  "Space Grotesk": "'Space Grotesk', system-ui, sans-serif",
};

// ── Modal detail content ───────────────────────────────────────────────────────
const ZZ_ITEMS = [
  { when: "Feb 2026 — Apr 2026", role: "AI Innovation Extern",       title: "The Externship — Pfizer",  desc: "Built intelligent data extraction pipelines using OCR (Tesseract, PaddleOCR) and RAG. Engineered a document retrieval engine via LlamaIndex with open-source LLMs (Mistral, Phi-2)." },
  { when: "May 2026 — Present",  role: "Co-Founder & Engineer",      title: "Stealth Startup",          desc: "building homes?... 👀" },
  { when: "May 2026 — Present",  role: "UI/UX Designer Intern",      title: "PM Accelerator",           desc: "Designing production-ready interfaces and high-fidelity specs across multi-disciplinary squads. Building Figma prototypes to simplify complex product flows." },
  { when: "Jul 2024",            role: "Technology Assistant",       title: "University of Toronto",    desc: "Designed and delivered AI workshops on Neural Networks and Python to 25+ students. Increased technical engagement by 40% through hands-on experimentation." },
  { when: "Sep 2022 — Jun 2023", role: "Python Instructor",          title: "STEM1 Coding & Robotics",  desc: "Taught weekly Python classes to 10+ students. Students hit an 85% average pass rate on internal assessments." },
  { when: "Oct 2024 — Present",  role: "Barista & Guest Experience", title: "Starbucks",                desc: "Managing high-volume workflows and driving operational efficiency across 200+ orders a day during peak hours." },
];

const DETAILS = {
  projects: (
    <div className="proj-section">
      <a className="proj-hero" href="https://github.com/ronnphil/Mon-35-EMG-Armband" target="_blank" rel="noopener noreferrer">
        <div className="proj-hero-thumb" style={{ fontSize: 40, lineHeight: 1 }}>🦾</div>
        <div>
          <h3 className="proj-hero-title">EMG Fitness Armband</h3>
          <p className="proj-hero-desc">Real-time muscle monitoring wearable · ESP32 · Python · WebSockets · JS Dashboard · 95% accuracy · &lt;0.5s latency</p>
          <span className="proj-hero-arr">→ View on GitHub</span>
        </div>
      </a>
      <div className="proj-grid-2">
        <a className="proj" href="#" target="_blank" rel="noopener noreferrer"><div className="thumb" style={{ fontSize: 28 }}>🌤️</div><div><h4>Atmosphere</h4><p>Bento-grid weather dashboard · dual personas · drag-and-drop · Figma</p></div><span className="proj-link-tag">View on Figma →</span></a>
        <a className="proj" href="https://github.com/ronnphil/ML-Fraud-Detection-2.0" target="_blank" rel="noopener noreferrer"><div className="thumb" style={{ fontSize: 28 }}>🕵️</div><div><h4>ML Fraud Detection 2.0</h4><p>6.3M transactions · 94% Recall · SMOTE · Streamlit</p></div><span className="proj-link-tag">View on GitHub →</span></a>
        <a className="proj" href="https://github.com/ronnphil/Stock-Market-Forecasting-Dashboard" target="_blank" rel="noopener noreferrer"><div className="thumb" style={{ fontSize: 28 }}>📈</div><div><h4>AI Financial Dashboard</h4><p>LSTM forecasting · Python · Streamlit · Node.js · SQL</p></div><span className="proj-link-tag">View on GitHub →</span></a>
        <a className="proj" href="https://github.com/ronnphil/To-Do-List-Tracker" target="_blank" rel="noopener noreferrer"><div className="thumb" style={{ fontSize: 28 }}>⚡</div><div><h4>Fastodo</h4><p>Zero-dependency task manager · Vanilla JS · localStorage</p></div><span className="proj-link-tag">View on GitHub →</span></a>
      </div>
    </div>
  ),
  experience: (
    <div className="tl-zz">
      {ZZ_ITEMS.map((item, i) => {
        const left = i % 2 === 0;
        return (
          <div key={i} className="tl-zz-row">
            {left ? (
              <><div className="tl-zz-box"><div className="when">{item.when}</div><h4>{item.title}</h4><div style={{fontSize:12,fontWeight:600,opacity:.65,marginBottom:4}}>{item.role}</div><p>{item.desc}</p></div><div className="tl-zz-dot" /><div className="tl-zz-spacer" /></>
            ) : (
              <><div className="tl-zz-spacer" /><div className="tl-zz-dot" /><div className="tl-zz-box"><div className="when">{item.when}</div><h4>{item.title}</h4><div style={{fontSize:12,fontWeight:600,opacity:.65,marginBottom:4}}>{item.role}</div><p>{item.desc}</p></div></>
            )}
          </div>
        );
      })}
    </div>
  ),
  skills: (
    <div className="skills-grid">
      <div className="skill-card skill-card--featured">
        <div className="skill-card-head">🤖 AI &amp; ML</div>
        <div className="chips">{["Python","Scikit-Learn","TensorFlow","LSTM","OpenAI API","Prompt Engineering","LlamaIndex","RAG","OCR","Mistral","Phi-2"].map((c,i)=><span className="chip" key={i}>{c}</span>)}</div>
      </div>
      <div className="skill-card">
        <div className="skill-card-head">💻 Frontend &amp; Design</div>
        <div className="chips">{["React.js","JavaScript ES6+","HTML5","CSS3","Streamlit","WebSockets","Figma","Prototyping"].map((c,i)=><span className="chip" key={i}>{c}</span>)}</div>
      </div>
      <div className="skill-card">
        <div className="skill-card-head">🛠️ Tools &amp; Infra</div>
        <div className="chips">{["SQL","Git/GitHub","AWS EC2","AWS S3","Arduino","ESP32","C++","Autodesk Inventor"].map((c,i)=><span className="chip" key={i}>{c}</span>)}</div>
      </div>
    </div>
  ),
  about: (
    <div className="about-wrap">
      <div className="about-split">
        <div className="about-text">
          <p style={{ fontWeight: 500, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            I'm an engineer who loves building things end-to-end — whether that means routing wires on a wearable microcontroller, training an ML pipeline, or designing a UI from scratch. I care about taking complex systems and making them feel simple, visual, and intuitive.
          </p>
          <ul className="detail-list" style={{ marginTop: 16 }}>
            <li>Co-founding a stealth startup — P2P housing marketplace, in production</li>
            <li>AI Innovation Extern · Pfizer · built OCR + RAG pipelines</li>
            <li>Targeting: ML Engineer · Software Developer · Data Analyst co-ops</li>
          </ul>
        </div>
        <div className="about-stats">
          <div className="stat-card"><div className="stat-label">school</div><div className="stat-value">McMaster Eng</div></div>
          <div className="stat-card"><div className="stat-label">based in</div><div className="stat-value">Toronto, ON</div></div>
          <div className="stat-card"><div className="stat-label">shipped</div><div className="stat-value">5 projects</div></div>
          <div className="stat-card stat-card--fun"><div className="stat-label">fuel</div><div className="stat-value"> coffee addict</div></div>
        </div>
      </div>
      <div className="edu-hobbies-split">
        <div>
          <div className="skill-card-head">🎓 Education</div>
          <ul className="detail-list">
            <li><strong>McMaster University</strong> — B.Eng. &amp; Management · Sep 2025 – Present</li>
          </ul>
        </div>
        <div>
          <div className="skill-card-head">🎯 Hobbies</div>
          <div className="chips chips--scattered">
            {["🏀 Basketball","🏸 Badminton","🏓 Table Tennis","☕ Coffee","🔧 Hardware Tinkering","🎮 Gaming","🎵 Music"].map((c,i) =>
              <span className="chip" key={i} style={{ transform: `rotate(${i % 2 === 0 ? -2.5 : 1.8}deg)`, fontSize: i % 3 === 0 ? 15 : 14 }}>{c}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  ),
  contact: (
    <div className="contact-page">
      <div className="contact-tagline marker">★ open to Summer 2026 internships</div>
      <div className="contact-headline marker">let's build something →</div>
      <div className="contact-icons">
        <a className="contact-icon-item" href="mailto:ronnphilip1@gmail.com" aria-label="Email">
          <span className="contact-icon-badge">
            <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </span>
          <span className="contact-icon-label">Email</span>
        </a>
        <a className="contact-icon-item" href="https://github.com/ronnphil" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <span className="contact-icon-badge">
            <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.467-2.382 1.235-3.222-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.874.118 3.176.77.84 1.232 1.912 1.232 3.222 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.103.823 2.222 0 1.604-.014 2.896-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </span>
          <span className="contact-icon-label">GitHub</span>
        </a>
        <a className="contact-icon-item" href="https://www.linkedin.com/in/ronn-philip" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <span className="contact-icon-badge">
            <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </span>
          <span className="contact-icon-label">LinkedIn</span>
        </a>
      </div>
    </div>
  ),
};

const MODES = {
  engineer: {
    label: "ENGINEER",
    hero:   { kick: "mode · engineer", tag: "I build things end-to-end." },
    cards: [
      { kind: "projects",   doodle: "assets/layer.png",      title: "PROJECTS",   feature: true,  summary: "Wearables · fraud detection · SaaS" },
      { kind: "experience", doodle: "assets/chart.png",        title: "EXPERIENCE", feature: false, summary: "Pfizer · Stealth · PM Accelerator" },
      { kind: "skills",     doodle: "assets/setting.png",     title: "SKILLS",     feature: false, summary: "AI/ML · React · Embedded · Cloud" },
      { kind: "contact",    doodle: "assets/chat.png",     title: "CONTACT",    feature: false, summary: "Available Summer 2026 →" },
    ],
  },
  human: {
    label: "HUMAN",
    hero:   { kick: "mode · human", tag: "Off the clock." },
    cards: [
      { kind: "about",   doodle: "assets/cup-of-coffee.png", title: "ABOUT ME", feature: true,  summary: "McMaster Eng. Builder. Toronto." },
      { kind: "contact", doodle: "assets/wave-hand.png",     title: "SAY HI",   feature: false, summary: "Always down to chat." },
    ],
  },
};

const ROT = [-2.2, 1.8, 1.5, -2.0];

// ── AvatarEngine — border-triggered MP4 video transition state machine ────────
function AvatarEngine({ mode, resetTrigger }) {
  const assets = AVATAR_ASSETS[mode];
  const [avatarState, _setAvatarState] = useState("neutral");
  const avatarStateRef = useRef("neutral");
  const videoRef = useRef(null);

  const setState = (s) => { avatarStateRef.current = s; _setAvatarState(s); };

  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.pause(); v.src = ""; }
    setState("neutral");
  }, [resetTrigger, mode]);

  const playVideo = (src, nextState) => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    const onReady = () => {
      v.removeEventListener("loadeddata", onReady);
      setState(nextState);
      v.play().catch(() => {});
    };
    v.addEventListener("loadeddata", onReady);
    v.src = src;
    v.load();
  };

  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.loop = false;
    playVideo(assets.enterVideo, "entering");
  };

  const handleMouseLeave = () => {
    if (avatarStateRef.current === "neutral") return;
    playVideo(assets.leaveVideo, "leaving");
  };

  const handleVideoEnded = () => {
    if (avatarStateRef.current === "entering") setState("hovering");
    else if (avatarStateRef.current === "leaving") setState("neutral");
  };

  return (
    <div className="avatar-engine" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Baseline Neutral Image */}
      <img
        className="av-layer"
        src={assets.neutral}
        alt=""
        style={{
          opacity: avatarState === "neutral" ? 1 : 0,
          transform: mode === "engineer" ? "scale(1)" : "scale(1.0)",
          objectFit: "cover",
          objectPosition: "center 50%",
          zIndex: 1,
          
          // ─── ADD THIS: Prevents layout layer blending flickers ───
          backfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)", 
        }}
      />
      
      {/* Video layer — animates in, then freezes on final frame while hovering */}
      <video
        ref={videoRef}
        className="av-layer"
        muted
        playsInline
        preload="auto" // Forces browser to download completely upfront
        onEnded={handleVideoEnded}
        style={{
          // Keep it strictly at 1 during states, but use transition to avoid abrupt layout swaps
          opacity: avatarState === "entering" || avatarState === "hovering" || avatarState === "leaving" ? 1 : 0,
          objectFit: "cover",
          objectPosition: "center 50%",
          zIndex: 2,

          // ─── THE ANTI-FLASH BULLETPROOF FIX ───
          transform: "translate3d(0, 0, 0)",         /* Forces active GPU layer parsing */
          backfaceVisibility: "hidden",              /* Prevents translucent blink artifacts */
          perspective: "1000px",                      /* Locks a stable 3D compositing context */
          transition: "opacity 0.12s ease-in-out",   /* Smooths out the immediate pixel frame snap */
        }}
      />
    </div>
  );
}

// ── AvatarSidebar — fixed mini avatar after scrolling past landing ─────────────
function AvatarSidebar({ mode }) {
  return (
    <button
      className="avatar-sidebar"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <img src={AVATAR_ASSETS[mode].neutral} alt={mode + " avatar"} />
    </button>
  );
}

// ── FullSections — full-bleed content sections below the landing viewport ─────
const SECTION_DEFS = [
  { id: "projects",   doodle: "assets/layer.png",      title: "PROJECTS",   variant: "odd"  },
  { id: "experience", doodle: "assets/chart.png",        title: "EXPERIENCE", variant: "even" },
  { id: "skills",     doodle: "assets/setting.png",     title: "SKILLS",     variant: "odd"  },
  { id: "about",   doodle: "assets/cup-of-coffee.png", title: "ABOUT ME", variant: "even" },
  { id: "contact", doodle: "assets/chat.png",     title: "CONTACT",  variant: "odd"  },
];

function FullSections() {
  return (
    <>
      {SECTION_DEFS.map(sec => (
        <section key={sec.id} id={sec.id} className={"full-section full-section--" + sec.variant}>
          <div className="full-section-inner">
            <div className="full-section-title display">
              <img className="section-doodle" src={sec.doodle} alt="" />
              {sec.title}
            </div>
            <div className="full-section-content">{DETAILS[sec.id]}</div>
          </div>
        </section>
      ))}
    </>
  );
}

function TypewriterTitle({ text }) {
  const spaceIdx = text.indexOf(" ");
  const before = text.slice(0, spaceIdx + 1);
  const after = text.slice(spaceIdx + 1);
  const lastChar = after.slice(-1);
  const afterRest = after.slice(0, -1);
  return (
    <h1 className="title display">
      {before}
      <span className="l2">{afterRest}<span className="blink">{lastChar}</span></span>
    </h1>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ data, slot, sectionId }) {
  const tapeForSlot = { 0: "tl", 1: "tr", 2: "bl", 3: null }[slot];
  const handleClick = () => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  return (
    <div
      className={"card slot-" + slot + (data.feature ? " feature" : "")}
      style={{ "--rot": ROT[slot], animationDelay: (slot * 0.06) + "s" }}
      onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={"Jump to " + data.title + " section"}
    >
      {tapeForSlot && <span className={"tape " + tapeForSlot}></span>}
      <div className="card-head">
        <img className="doodle" src={data.doodle} alt="" />
        <div><h3>{data.title}</h3><p className="summary">{data.summary}</p></div>
        <span className="expand-cue">↓</span>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const t = TWEAK_DEFAULTS;
  const [mode, setMode] = useState("engineer");
  const [flipCount, setFlipCount] = useState(0);
  const [scrolled, setScrolled]   = useState(false);
  const m       = MODES[mode];
  const flipped = mode === "human";
  const motionOff = t.motion === "off";

  function flip() {
    setFlipCount(c => c + 1);
    setMode(flipped ? "engineer" : "human");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rootStyle = {
    "--font-display": FONT_MAP[t.headingFont] || FONT_MAP["Archivo Black"],
    "--purple":  t.accent,
    "--tape":    t.tapeColor,
    "--jit":     t.jitter,
  };

  const renderFace = (key, back) => {
    const mm = MODES[key];
    return (
      <div className={"face " + (back ? "back" : "front")}>
        <span className="kick">{mm.hero.kick}</span>
        <AvatarEngine mode={key} resetTrigger={flipCount} />
        <div className="tag display">RONN</div>
        <div className="line">{mm.hero.tag}</div>
        <div className="fliphint">↻ click to flip</div>
      </div>
    );
  };

  return (
    <div className={"wrap " + (motionOff ? "motion-off" : "")} style={rootStyle}>
      <span className="star" style={{ position:"absolute", top: 90,  left: "6%",  transform: "rotate(-12deg)", fontSize: 18, zIndex:0 }}>★ eng</span>
      <span className="star" style={{ position:"absolute", top: 160, right: "5%", transform: "rotate(8deg)",   fontSize: 16, zIndex:0 }}>mcmaster</span>
      <span className="star" style={{ position:"absolute", top: 240, left: "3%",  transform: "rotate(-6deg)",  fontSize: 15, zIndex:0 }}>builder</span>
      <section className="landing-section">
        <div className="topbar">
          <div className="kicker marker">hey — it's me ↓</div>
          <TypewriterTitle text={t.headline} />
          <div className="subt">{t.subtitle}</div>
          <div className="badge">★ available · Summer 2026</div>
        </div>

        <div className={"board" + (m.cards.length === 2 ? " board-2" : "")}>
          <Card data={m.cards[0]} slot={0} sectionId={m.cards[0].kind} key={mode+"-0"} />
          <Card data={m.cards[1]} slot={1} sectionId={m.cards[1].kind} key={mode+"-1"} />

          <div className="center">
            <div className={"flip"+(flipped?" flipped":"")} onClick={flip}>
              <div className="flip-inner">
                {renderFace("engineer", false)}
                {renderFace("human",    true)}
              </div>
            </div>
            <div className="switch" role="group" aria-label="Portfolio mode">
              <button aria-pressed={mode==="engineer"} onClick={()=>{if(flipped)flip();}}><img className="switch-icon" src="assets/setting.png" alt="" /> ENGINEER</button>
              <button aria-pressed={mode==="human"}    onClick={()=>{if(!flipped)flip();}}><img className="switch-icon" src="assets/cup-of-coffee.png" alt="" /> HUMAN</button>
            </div>
          </div>

          {m.cards[2] && <Card data={m.cards[2]} slot={2} sectionId={m.cards[2].kind} key={mode+"-2"} />}
          {m.cards[3] && <Card data={m.cards[3]} slot={3} sectionId={m.cards[3].kind} key={mode+"-3"} />}
        </div>
        <div className="scroll-hint">↓ see the work</div>
      </section>

      <FullSections />
      {scrolled && <AvatarSidebar mode={mode} />}
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "headline":    "RONN PHILIP",
  "subtitle":    "Engineering & Management · McMaster · Mississauga, ON",
  "headingFont": "Archivo Black",
  "accent":      "#67568C",
  "tapeColor":   "#67568C",
  "jitter":      1,
  "motion":      "full",
  "dots":        true
}/*EDITMODE-END*/;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
