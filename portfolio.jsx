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

// ── Icon — bold monoline SVGs, replacing raw emoji so section glyphs match
//    the hand-drawn doodle set used elsewhere instead of OS emoji. Stroke is
//    intentionally chunky (3) to match the weight of the existing doodle PNGs
//    rather than a delicate default icon-library line weight ─────────────────
const ICON_PATHS = {
  pulse:    <polyline points="2 12 6 12 9 4 13 20 16 12 22 12" />,
  cloud:    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" stroke="none" />,
  shield:   (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 12 15 16 10" /></>),
  trending: (<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>),
  check:    (<><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>),
  cpu:      (<><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="10" y="10" width="4" height="4" /><line x1="10" y1="1.5" x2="10" y2="6" /><line x1="14" y1="1.5" x2="14" y2="6" /><line x1="10" y1="18" x2="10" y2="22.5" /><line x1="14" y1="18" x2="14" y2="22.5" /><line x1="18" y1="10" x2="22.5" y2="10" /><line x1="18" y1="14" x2="22.5" y2="14" /><line x1="1.5" y1="10" x2="6" y2="10" /><line x1="1.5" y1="14" x2="6" y2="14" /></>),
  code:     (<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  tool:     <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />,
  external: (<><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>),
  cap:      (<><path d="M12 3 2 8l10 5 10-5-10-5z" /><path d="M6 10.5V16c0 1.5 2.5 3 6 3s6-1.5 6-3v-5.5" /><line x1="22" y1="8" x2="22" y2="14" /></>),
  target:   (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5.5" /><circle cx="12" cy="12" r="2" /></>),
  basketball: (<><circle cx="12" cy="12" r="9" /><path d="M12 3v18" /><path d="M4 8c4 2 12 2 16 0" /><path d="M4 16c4-2 12-2 16 0" /></>),
  controller: (<><rect x="2" y="8" width="20" height="10" rx="5" /><line x1="7" y1="11" x2="7" y2="15" /><line x1="5" y1="13" x2="9" y2="13" /><circle cx="16" cy="12" r="1" /><circle cx="18" cy="14" r="1" /></>),
  music:    (<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
};
function Icon({ name, size = 26, className = "proj-icon" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </svg>
  );
}

// ── Spark — solid decorative flourish shapes sourced from a Figma
//    neubrutalist shape pack, used sparingly as flourishes near headlines
//    rather than as functional icons (those stay in the Icon system above) ──
const SPARK_SHAPES = {
  sparkle: { viewBox: "0 0 376 376", d: "M360 172C352.4 172 227.3 177.3 191.7 184.3C198.7 148.6 204 23.6 204 16C204 7.2 196.8 0 188 0C179.2 0 172 7.2 172 16C172 23.6 177.3 148.7 184.3 184.3C148.6 177.3 23.6 172 16 172C7.2 172 0 179.2 0 188C0 196.8 7.2 204 16 204C23.6 204 148.7 198.7 184.3 191.7C177.3 227.4 172 352.4 172 360C172 368.8 179.2 376 188 376C196.8 376 204 368.8 204 360C204 352.4 198.7 227.3 191.7 191.7C227.4 198.7 352.4 204 360 204C368.8 204 376 196.8 376 188C376 179.2 368.9 172 360 172Z" },
  flowerBurst: { viewBox: "0 0 340.38 375.7", d: "M312.49 205.6L281.79 187.9L312.49 170.2C339.19 154.8 348.29 120.7 332.89 94C317.49 67.3 283.39 58.2 256.69 73.6L225.99 91.3V55.8C225.99 25 200.99 0 170.19 0C139.39 0 114.39 25 114.39 55.8V91.3L83.6898 73.6C56.9898 58.2 22.8898 67.3 7.48983 94C-7.91017 120.7 1.18983 154.8 27.8898 170.2L58.5898 187.9L27.8898 205.6C1.18983 221 -7.91017 255.1 7.48983 281.8C22.8898 308.5 56.9898 317.6 83.6898 302.2L114.39 284.5V319.9C114.39 350.7 139.39 375.7 170.19 375.7C200.99 375.7 225.99 350.7 225.99 319.9V284.4L256.69 302.1C283.39 317.5 317.49 308.4 332.89 281.7C348.29 255.1 339.19 221 312.49 205.6Z" },
  starburst: { viewBox: "0 0 419.931 401.017", d: "M234.58 178.793C563.68 104.893 319.28 69.3927 217.58 176.293C319.28 69.3927 209.98 -152.107 209.98 160.893C209.98 -152.107 100.68 69.3927 202.38 176.293C100.68 69.3927 -143.72 104.893 185.38 178.793C-143.72 104.893 33.0803 277.293 197.68 190.793C33.1803 277.293 -8.61969 520.693 194.78 207.693C-8.61969 520.693 209.98 405.793 209.98 199.693C209.98 405.793 428.58 520.693 225.18 207.693C428.58 520.693 386.78 277.293 222.28 190.793C386.78 277.293 563.68 104.893 234.58 178.793Z" },
  arch:     { viewBox: "0 0 366.6 366.6", d: "M183.3 0C82.1 0 0 82 0 183.3V366.6H61.1V187.2C61.1 119.7 115.8 65 183.3 65C250.8 65 305.5 119.7 305.5 187.2V366.6H366.6V183.3C366.6 82.1 284.5 0 183.3 0Z" },
  bloom:    { viewBox: "0 0 362.428 395.15", d: "M272.476 197.575C454.976 197.575 318.076 -39.525 226.876 118.575C318.176 -39.525 44.3763 -39.525 135.576 118.575C44.2763 -39.525 -92.5237 197.575 89.9763 197.575C-92.5237 197.575 44.3763 434.675 135.576 276.575C44.2763 434.675 318.076 434.675 226.876 276.575C318.076 434.675 454.976 197.575 272.476 197.575Z" },
  pinwheelX:{ viewBox: "0 0 352.101 351.3", d: "M342.855 11.8564C318.255 -12.7436 250.455 13.3564 177.755 71.1564C103.755 11.5564 34.2548 -15.7436 9.25483 9.25641C-15.7452 34.2564 11.5548 103.856 71.2548 177.756C13.9548 250.156 -11.9452 317.556 12.5548 342.056C37.1548 366.656 104.955 340.556 177.655 282.756C249.055 338.656 315.155 363.556 339.355 339.356C363.555 315.156 338.655 249.056 282.855 177.656C341.155 104.756 367.555 36.5564 342.855 11.8564Z" },
  chevrons: { viewBox: "0 0 447.4 330.234", d: "M446.5 163.234L269.6 0.633957C268.9 -0.0660431 267.8 -0.166045 266.9 0.233955C266 0.633955 265.4 1.53396 265.4 2.53396V78.034L181.1 0.633957C180.4 -0.0660431 179.3 -0.166045 178.4 0.233955C177.5 0.633955 176.9 1.53396 176.9 2.53396V78.034L92.7 0.633957C92 -0.0660431 90.9 -0.166045 90 0.233955C89.1 0.633955 88.5 1.53396 88.5 2.53396V78.034L4.2 0.633957C3.5 -0.0660431 2.4 -0.166045 1.5 0.233955C0.6 0.633955 0 1.53396 0 2.53396V327.734C0 328.734 0.6 329.634 1.5 330.034C1.8 330.134 2.2 330.234 2.5 330.234C3.1 330.234 3.7 330.034 4.2 329.534L88.5 252.134V327.734C88.5 328.734 89.1 329.634 90 330.034C90.3 330.134 90.7 330.234 91 330.234C91.6 330.234 92.2 330.034 92.7 329.534L177 252.134V327.734C177 328.734 177.6 329.634 178.5 330.034C178.8 330.134 179.2 330.234 179.5 330.234C180.1 330.234 180.7 330.034 181.2 329.534L265.5 252.134V327.734C265.5 328.734 266.1 329.634 267 330.034C267.3 330.134 267.7 330.234 268 330.234C268.6 330.234 269.2 330.034 269.7 329.534L446.6 166.934C447.1 166.434 447.4 165.834 447.4 165.134C447.4 164.434 447.1 163.634 446.5 163.234ZM182 8.13396L265.5 84.834V159.334L182 82.634V8.13396ZM270.4 89.434L352.7 165.034L270.4 240.634V89.434ZM182 89.434L264.3 165.034L182 240.634V89.434ZM93.5 8.13396L177 84.834V159.334L93.5 82.634V8.13396ZM175.8 165.034L93.5 240.634V89.434L175.8 165.034ZM5.1 321.934V8.13396L88.6 84.834V245.234L5.1 321.934ZM93.5 321.934V247.434L177 170.734V245.234L93.5 321.934ZM182 321.934V247.434L265.5 170.734V245.234L182 321.934ZM270.4 321.934V247.434L358.1 166.834C358.6 166.334 358.9 165.734 358.9 165.034C358.9 164.334 358.6 163.634 358.1 163.234L270.4 82.634V8.13396L441.2 165.034L270.4 321.934Z" },
};
function Spark({ name, size = 24, className = "" }) {
  const s = SPARK_SHAPES[name];
  return (
    <svg className={className} width={size} height={size} viewBox={s.viewBox} xmlns="http://www.w3.org/2000/svg">
      <path d={s.d} fill="currentColor" />
    </svg>
  );
}

// ── Modal detail content ───────────────────────────────────────────────────────
const ZZ_ITEMS = [
  { when: "Jul 2026 — Present",  role: "App Developer",              title: "20/20 Mission (Nonprofit)", logo: "assets/2020mission_logo.png", desc: "Details incoming..." },
  { when: "May 2026 — Present",  role: "AI UI/UX Designer Intern · via PM Accelerator", title: "AdReady AI", logo: "assets/adready_ai_logo.jpg", desc: "Designed end-to-end UI/UX for a multi-agent video ad review system using OCR, transcription, and AI evaluation scoring. Iterated on 3 core product screens across multiple design sprints and contributed to design handoff documentation for engineering." },
  { when: "May 2026 — Jun 2026", role: "AI Innovation Extern",       title: "Extern, Pfizer",           logo: "assets/extern_logo.png",       desc: "Built intelligent document extraction pipelines using OCR (Tesseract, PaddleOCR) and RAG via LlamaIndex with custom chunk tuning and open-source LLMs (Mistral, Phi-2). Benchmarked model architectures for accuracy and deployment suitability." },
  { when: "May 2026 — Present",  role: "Founder & Engineer",         title: "Startup",      logoEmoji: "❓", desc: "building homes?... 👀" },
  { when: "Jul 2024",            role: "Technology Assistant",       title: "University of Toronto",    logo: "assets/uoft_logo.jpg",         desc: "Designed and delivered AI workshops on Neural Networks and Python to 25+ students. Increased technical engagement by 40% through hands-on experimentation." },
  { when: "Sep 2022 — Jun 2023", role: "Python Instructor",          title: "STEM1 Coding & Robotics",  logo: "assets/stem1_logo.jpg",        desc: "Taught weekly Python classes to 10+ students. Students hit an 85% average pass rate on internal assessments." },
  { when: "Jul 2023 — Jul 2025", role: "Barista & Guest Experience", title: "Starbucks",                logo: "assets/starbucks_logo.png", logoZoom: 1.6, desc: "Managing high-volume workflows and driving operational efficiency across 200+ orders a day during peak hours." },
];

const DETAILS = {
  projects: (
    <div className="proj-section">
      <a className="proj-hero" href="https://devpost.com/software/ignis-gsre19" target="_blank" rel="noopener noreferrer">
        <span className="proj-link-badge"><Icon name="external" size={14} /></span>
        <div className="proj-hero-thumb"><Icon name="shield" size={40} /></div>
        <div>
          <h3 className="proj-hero-title">IGNIS</h3>
          <p className="proj-hero-desc">QNX-powered edge fire &amp; smoke detection · Raspberry Pi 5 · TensorFlow Lite · FastAPI · React dashboard · ElevenLabs voice AI — Hack the 6ix 2026</p>
          <span className="proj-hero-arr">→ View on Devpost</span>
        </div>
      </a>
      <div className="proj-grid-2">
        <a className="proj" href="https://github.com/ronnphil/Mon-35-EMG-Armband" target="_blank" rel="noopener noreferrer"><span className="proj-link-badge"><Icon name="external" size={14} /></span><div className="thumb"><Icon name="pulse" /></div><div><h4>EMG Fitness Armband</h4><p>Real-time muscle monitoring · ESP32 · 95% accuracy · &lt;0.5s latency</p></div></a>
        <a className="proj" href="https://github.com/ronnphil/ML-Fraud-Detection-2.0" target="_blank" rel="noopener noreferrer"><span className="proj-link-badge"><Icon name="external" size={14} /></span><div className="thumb"><Icon name="cpu" /></div><div><h4>ML Fraud Detection 2.0</h4><p>6.3M transactions · 94% Recall · SMOTE · Streamlit</p></div></a>
        <a className="proj" href="https://github.com/ronnphil/Stock-Market-Forecasting-Dashboard" target="_blank" rel="noopener noreferrer"><span className="proj-link-badge"><Icon name="external" size={14} /></span><div className="thumb"><Icon name="trending" /></div><div><h4>AI Financial Dashboard</h4><p>LSTM forecasting · Python · Streamlit · Node.js · SQL</p></div></a>
        <a className="proj" href="https://github.com/ronnphil/To-Do-List-Tracker" target="_blank" rel="noopener noreferrer"><span className="proj-link-badge"><Icon name="external" size={14} /></span><div className="thumb"><Icon name="check" /></div><div><h4>Fastodo</h4><p>Zero-dependency task manager · Vanilla JS · localStorage</p></div></a>
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
              <><div className="tl-zz-box">{(item.logo || item.logoEmoji) && <span className="tl-zz-logo">{item.logo ? <img src={item.logo} alt="" style={item.logoZoom ? { transform: `scale(${item.logoZoom})` } : undefined} /> : item.logoEmoji}</span>}<div className="when">{item.when}</div><h4>{item.title}</h4><div style={{fontSize:12,fontWeight:600,opacity:.65,marginBottom:4}}>{item.role}</div><p>{item.desc}</p></div><div className="tl-zz-dot" /><div className="tl-zz-spacer" /></>
            ) : (
              <><div className="tl-zz-spacer" /><div className="tl-zz-dot" /><div className="tl-zz-box">{(item.logo || item.logoEmoji) && <span className="tl-zz-logo">{item.logo ? <img src={item.logo} alt="" style={item.logoZoom ? { transform: `scale(${item.logoZoom})` } : undefined} /> : item.logoEmoji}</span>}<div className="when">{item.when}</div><h4>{item.title}</h4><div style={{fontSize:12,fontWeight:600,opacity:.65,marginBottom:4}}>{item.role}</div><p>{item.desc}</p></div></>
            )}
          </div>
        );
      })}
    </div>
  ),
  skills: (
    <div className="skills-grid">
      <div className="skill-card skill-card--featured">
        <div className="skill-card-head"><Icon name="cpu" size={20} className="skill-icon" /> AI &amp; ML</div>
        <div className="chips">{["Python","Scikit-Learn","TensorFlow","LSTM","OpenAI API","Prompt Engineering","LlamaIndex","RAG","OCR","Mistral","Phi-2"].map((c,i)=><span className="chip" key={i}>{c}</span>)}</div>
      </div>
      <div className="skill-card">
        <div className="skill-card-head"><Icon name="code" size={20} className="skill-icon" /> Frontend &amp; Design</div>
        <div className="chips">{["React.js","JavaScript ES6+","HTML5","CSS3","Streamlit","WebSockets","Figma","Prototyping"].map((c,i)=><span className="chip" key={i}>{c}</span>)}</div>
      </div>
      <div className="skill-card">
        <div className="skill-card-head"><Icon name="tool" size={20} className="skill-icon" /> Tools &amp; Infra</div>
        <div className="chips">{["SQL","Git/GitHub","AWS EC2","AWS S3","Arduino","ESP32","C++","Autodesk Inventor"].map((c,i)=><span className="chip" key={i}>{c}</span>)}</div>
      </div>
    </div>
  ),
  about: (
    <div className="about-wrap">
      <div className="about-spread">
        <span className="about-sticker about-sticker--1" style={{ transform: "rotate(-10deg)" }}><Icon name="basketball" size={18} className="" /></span>
        <span className="about-sticker about-sticker--2" style={{ transform: "rotate(8deg)" }}><Icon name="controller" size={18} className="" /></span>
        <span className="about-sticker about-sticker--3" style={{ transform: "rotate(-6deg)" }}><Icon name="music" size={18} className="" /></span>
        <span className="about-sticker about-sticker--4" style={{ transform: "rotate(11deg)" }}><Icon name="tool" size={18} className="" /></span>

        <div className="about-portrait">
          <img src="assets/Human_Neutral.png" alt="Ronn, off the clock" />
          <span className="about-pin-fact">Toronto, ON</span>
        </div>

        <div className="about-content">
          <span className="about-spark" style={{ top: -26, left: 895, transform: "rotate(12deg)" }}><Spark name="sparkle" size={26} /></span>
          <p className="about-headline display">Off the clock, still building <span className="headline-hl">something.</span></p>
          <p className="about-body">
            I'm an engineer who cares about taking complex systems and making them feel simple, visual, and intuitive.
          </p>
          <ul className="detail-list" style={{ marginTop: 14 }}>
            <li>Co-founding something new — can't say more yet 👀</li>
            <li>AI Innovation Extern · Pfizer · built OCR + RAG pipelines</li>
            <li>Targeting: ML Engineer · Software Developer · Data Analyst co-ops</li>
          </ul>
          <div className="about-facts">
            {["5 projects shipped"].map((f,i) =>
              <span className="about-fact" key={i} style={{ transform: `rotate(${i % 2 === 0 ? -1.5 : 1.2}deg)` }}>{f}</span>
            )}
          </div>
        </div>
      </div>
      <div className="edu-hobbies-split">
        <div className="about-block">
          <div className="skill-card-head"><Icon name="cap" size={20} className="skill-icon" /> Education</div>
          <ul className="detail-list">
            <li><strong>McMaster University</strong> — B.Eng. &amp; Management · Sep 2025 – Present</li>
          </ul>
        </div>
        <div className="about-block">
          <div className="skill-card-head"><Icon name="target" size={20} className="skill-icon" /> Hobbies</div>
          <div className="chips chips--scattered">
            {["🏀 Basketball","🏸 Badminton","🏓 Table Tennis","🍵 Chai addict","🔧 Hardware Tinkering","🎮 Gaming","🎧 Drake"].map((c,i) =>
              <span className="chip" key={i} style={{ transform: `rotate(${i % 2 === 0 ? -2.5 : 1.8}deg)`, fontSize: i % 3 === 0 ? 15 : 14 }}>{c}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  ),
  contact: (
    <div className="contact-page">
      <div className="contact-tagline marker">★ open to Summer 2027 internships</div>
      <div className="contact-headline marker">
        let's build something →
        <span style={{ position:"absolute", top:-36, right:-32, color:"var(--purple)", transform:"rotate(-10deg)", pointerEvents:"none" }}><Spark name="flowerBurst" size={28} /></span>
      </div>
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
      { kind: "projects",   doodle: "assets/layer.png",      title: "PROJECTS",   feature: true,  summary: "IGNIS · fraud detection · SaaS" },
      { kind: "experience", doodle: "assets/chart.png",        title: "EXPERIENCE", feature: false, summary: "AdReady AI · Pfizer · 20/20 Mission" },
      { kind: "skills",     doodle: "assets/setting.png",     title: "SKILLS",     feature: false, summary: "AI/ML · React · Embedded · Cloud" },
      { kind: "contact",    doodle: "assets/chat.png",     title: "CONTACT",    feature: false, summary: "Available Summer 2027 →" },
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
//    Two dedicated <video> elements (enter/leave), each with a STATIC src that's
//    only ever reassigned by React when `mode` itself changes. Earlier this reused
//    one <video> and reassigned .src on every hover direction change — per the
//    HTML spec that immediately blanks the decoded frame, and the opacity didn't
//    drop until the new clip's loadeddata fired, producing a flash. With two
//    elements, the enter-video stays frozen (opaque) underneath while the
//    leave-video plays on top, so there is never a moment with no valid frame. ──
function AvatarEngine({ mode, resetTrigger }) {
  const assets = AVATAR_ASSETS[mode];
  const [avatarState, _setAvatarState] = useState("neutral");
  const avatarStateRef = useRef("neutral");
  const enterRef = useRef(null);
  const leaveRef = useRef(null);
  const rewindTimer = useRef(null);

  const setState = (s) => { avatarStateRef.current = s; _setAvatarState(s); };

  useEffect(() => {
    clearTimeout(rewindTimer.current);
    [enterRef.current, leaveRef.current].forEach((v) => {
      if (v) { v.pause(); v.currentTime = 0; }
    });
    setState("neutral");
    return () => clearTimeout(rewindTimer.current);
  }, [resetTrigger, mode]);

  const handleMouseEnter = () => {
    const v = enterRef.current;
    if (!v) return;
    v.currentTime = 0;
    setState("entering");
    v.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (avatarStateRef.current === "neutral") return;
    const v = leaveRef.current;
    if (!v) return;
    v.currentTime = 0;
    setState("leaving");
    v.play().catch(() => {});
  };

  const handleEnterEnded = () => { if (avatarStateRef.current === "entering") setState("hovering"); };
  const handleLeaveEnded = () => {
    if (avatarStateRef.current !== "leaving") return;
    setState("neutral");
    // The leave clip is still fully opaque on screen right here (React hasn't
    // re-rendered yet) — rewinding it now would visibly snap it backward to
    // its own frame 0 (the "shocked" pose) before the fade-out even starts.
    // Wait for the .av-layer opacity fade (.25s) to actually finish, and bail
    // if a new hover interrupted it in the meantime, before rewinding either
    // clip. That leaves both pre-seeked at 0 for next time, invisibly.
    clearTimeout(rewindTimer.current);
    rewindTimer.current = setTimeout(() => {
      if (avatarStateRef.current !== "neutral") return;
      if (enterRef.current) enterRef.current.currentTime = 0;
      if (leaveRef.current) leaveRef.current.currentTime = 0;
    }, 300);
  };

  const showImage = avatarState === "neutral";
  const showEnter = avatarState === "entering" || avatarState === "hovering";
  const showLeave = avatarState === "leaving";

  return (
    <div className="avatar-engine" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <img
        className="av-layer"
        src={assets.neutral}
        alt=""
        style={{ opacity: showImage ? 1 : 0, objectFit: "cover", objectPosition: "center 50%", zIndex: 1 }}
      />
      <video
        ref={enterRef} className="av-layer" src={assets.enterVideo}
        muted playsInline preload="auto" onEnded={handleEnterEnded}
        style={{ opacity: showEnter ? 1 : 0, objectFit: "cover", objectPosition: "center 50%", zIndex: 2 }}
      />
      <video
        ref={leaveRef} className="av-layer" src={assets.leaveVideo}
        muted playsInline preload="auto" onEnded={handleLeaveEnded}
        style={{ opacity: showLeave ? 1 : 0, objectFit: "cover", objectPosition: "center 50%", zIndex: 3 }}
      />
    </div>
  );
}

// ── CustomCursor — ink dot (snaps) + coral ring (trails, lerped via rAF) ───────
//    Only ever mounted when the caller has confirmed pointer:fine and no
//    reduced-motion/manual-motion-off preference, so this never fights
//    accessibility settings or leaves touch users without a cursor ─────────────
const CURSOR_HOVER_SELECTOR = 'a, button, [role="button"], .card, .proj, .proj-hero, .contact-icon-item, .skill-card, .avatar-polaroid';
function CustomCursor({ enabled }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor-active");

    const onMove = (e) => { pos.current.x = e.clientX; pos.current.y = e.clientY; };
    const onOver = (e) => {
      if (e.target.closest && e.target.closest(CURSOR_HOVER_SELECTOR)) ringRef.current?.classList.add("hover");
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(CURSOR_HOVER_SELECTOR)) ringRef.current?.classList.remove("hover");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const tick = () => {
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%,-50%)`;
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%,-50%)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
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
  { id: "projects",   doodle: "assets/layer.png",      title: "PROJECTS",   variant: "odd",  divider: "torn",       sparks: [
    { name: "sparkle",     color: "var(--coral)",  size: 24, rot: -12, style: { top: "8%",  left: "5%" } },
    { name: "chevrons",    color: "var(--purple)", size: 34, rot: -6,  style: { bottom: "10%", right: "5%" } },
  ] },
  { id: "experience", doodle: "assets/chart.png",        title: "EXPERIENCE", variant: "even", divider: "tape",       sparks: [
    { name: "arch",        color: "var(--purple)", size: 26, rot: 8,   style: { top: "20%", right: "6%" } },
    { name: "sparkle",     color: "var(--coral)",  size: 20, rot: -8,  style: { bottom: "8%",  left: "4%" } },
  ] },
  { id: "skills",     doodle: "assets/setting.png",     title: "SKILLS",     variant: "odd",  divider: "tape",       sparks: [
    { name: "pinwheelX",   color: "var(--coral)",  size: 26, rot: -10, style: { top: "12%", right: "6%" } },
    { name: "bloom",       color: "var(--purple)", size: 24, rot: 9,   style: { bottom: "12%", left: "5%" } },
  ] },
  { id: "about",   doodle: "assets/cup-of-coffee.png", title: "ABOUT ME", variant: "even", divider: "torn" },
  { id: "contact", doodle: "assets/chat.png",     title: "CONTACT",  variant: "odd",  divider: "tape-coral", sparks: [
    { name: "sparkle",     color: "var(--purple)", size: 42, rot: -10, style: { top: "14%", left: "6%" } },
    { name: "starburst",   color: "var(--coral)",  size: 24, rot: 12,  style: { bottom: "14%", right: "7%" } },
    { name: "arch",        color: "var(--purple)", size: 26, rot: 6,   style: { top: "8%",  right: "10%" } },
    { name: "chevrons",    color: "var(--coral)",  size: 40, rot: -8,  style: { bottom: "8%", left: "10%" } },
    { name: "chevrons",    color: "var(--coral)",  size: 41, rot: -8,  style: { bottom: "8%", left: "10%" } },
    { name: "pinwheelX",   color: "var(--purple)", size: 22, rot: 14,  style: { bottom: "22%", left: "42%" } },
    { name: "bloom",       color: "var(--coral)",  size: 22, rot: -6,  style: { top: "42%", right: "80%" } },
  ] },
];

function FullSections() {
  return (
    <>
      {SECTION_DEFS.map(sec => (
        <section key={sec.id} id={sec.id} className={"full-section full-section--" + sec.variant + " full-section--div-" + sec.divider}>
          {sec.sparks && sec.sparks.map((sp, i) => (
            <span key={i} className="section-spark" style={{ ...sp.style, color: sp.color, transform: `rotate(${sp.rot}deg)` }}>
              <Spark name={sp.name} size={sp.size} />
            </span>
          ))}
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
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const m       = MODES[mode];
  const flipped = mode === "human";
  const motionOff = t.motion === "off";

  useEffect(() => {
    const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCursorEnabled(Boolean(fine) && !reduced && !motionOff);
  }, [motionOff]);

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
        <div className="avatar-polaroid">
          <AvatarEngine mode={key} resetTrigger={flipCount} />
        </div>
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
      <span style={{ position:"absolute", top: 8, right: "30%", color:"var(--purple)", transform:"rotate(-8deg)", zIndex:0, pointerEvents:"none" }}><Spark name="starburst" size={22} /></span>
      <section className="landing-section">
        <div className="topbar">
          <div className="kicker marker">hey — it's me ↓</div>
          <TypewriterTitle text={t.headline} />
          <div className="subt">{t.subtitle}</div>
          <div className="badge">★ available · Summer 2027</div>
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
      <CustomCursor enabled={cursorEnabled} />
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
