import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import { 
  Sparkles, ScanSearch, ArrowDown, Play, RotateCcw, 
  Check, ArrowRight, HelpCircle, MessageCircle,
  CheckCircle2, ChevronDown, Award, AlertCircle, ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundGradientAnimation } from '../components/ui/background-gradient-animation';
import CoreCapabilities, { GlassCard, FeatureIcon, FeatureText } from '../components/CoreCapabilities';
import { Button } from '../components/ui/Button';
import { trackEvent } from '../utils/analytics';

// Collapsible FAQ Item Component — Premium accordion with icon + number
const FAQItem = ({ question, answer, index = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = `faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div 
      className={`rounded-2xl font-sans text-left transition-all duration-300 ${
        isOpen 
          ? 'bg-white shadow-lg shadow-slate-900/[0.04] border border-teal-100/60 ring-1 ring-teal-500/10' 
          : 'bg-white/60 border border-slate-200/50 hover:border-slate-300/60 hover:bg-white/80 hover:shadow-md hover:shadow-slate-900/[0.03]'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full flex items-center gap-3 text-left px-5 py-4 font-semibold text-slate-800 text-sm md:text-[15px] transition-colors border-none bg-transparent cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500/50 outline-none rounded-2xl"
      >
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold transition-colors duration-300 ${
          isOpen 
            ? 'bg-teal-500 text-white shadow-sm' 
            : 'bg-slate-100 text-slate-400'
        }`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1">{question}</span>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isOpen 
            ? 'bg-teal-50 rotate-180' 
            : 'bg-slate-50'
        }`}>
          <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-teal-600' : 'text-slate-400'}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-[52px]">
              <p className="text-sm text-slate-500 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Scroll-reveal hook ── */
const useReveal = (delay = 0) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

/* ── Reusable secondary glassmorphism button ── */
const SecondaryButton = ({ onClick, children, icon: Icon, className = '', ariaLabel }) => {
  return (
    <button 
      onClick={onClick} 
      aria-label={ariaLabel}
      className={`cta-secondary focus-visible:ring-2 focus-visible:ring-teal-500/50 outline-none ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-teal-600 flex-shrink-0" />}
      {children}
    </button>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  // --- STATE 1: Live Activity Feed ---
  const [activityFeed, setActivityFeed] = useState([
    { id: 1, text: "AI optimized a Frontend resume 12s ago (Score: 42 ➔ 93)", icon: "🚀" },
    { id: 2, text: "Candidate secured an interview at Meta 3m ago", icon: "✨" }
  ]);

  useEffect(() => {
    const activities = [
      { text: "AI optimized a Java developer resume (Score: 35 ➔ 91)", icon: "🔥" },
      { text: "Candidate landed a PM interview at Stripe", icon: "💎" },
      { text: "AI optimized a Data Scientist resume (Score: 50 ➔ 94)", icon: "📈" },
      { text: "New resume template released (ATS Modern)", icon: "🎨" }
    ];

    const interval = setInterval(() => {
      const randomAct = activities[Math.floor(Math.random() * activities.length)];
      setActivityFeed(prev => [
        { id: Date.now(), text: `${randomAct.text} just now`, icon: randomAct.icon },
        ...prev.slice(0, 2)
      ]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // --- STATE 2: Hero Simulation Loop ---
  const [heroStep, setHeroStep] = useState(0); // 0=Upload, 1=Parsing, 2=Scanning, 3=Optimizing, 4=Done
  const [heroScore, setHeroScore] = useState(43);
  const [heroBullet, setHeroBullet] = useState("I was in charge of our web app database");

  useEffect(() => {
    let timer;
    const runHeroLoop = () => {
      setHeroStep(0);
      setHeroScore(43);
      setHeroBullet("I was in charge of our web app database");

      timer = setTimeout(() => {
        setHeroStep(1);
        setHeroScore(58);
      }, 2500);

      timer = setTimeout(() => {
        setHeroStep(2);
        setHeroScore(68);
      }, 4500);

      timer = setTimeout(() => {
        setHeroStep(3);
        setHeroBullet("Engineered a high-performance database schema using Redis, reducing P95 database latency by 42%.");
        setHeroScore(82);
      }, 6500);

      timer = setTimeout(() => {
        setHeroStep(4);
        setHeroScore(94);
      }, 9000);

      timer = setTimeout(() => {
        runHeroLoop();
      }, 14000);
    };

    runHeroLoop();
    return () => clearTimeout(timer);
  }, []);

  /* ── Typing animation for hero ── */
  const phrases = [
    'a Product Manager at Stripe.',
    'a Senior Engineer at Google.',
    'a Data Scientist at Netflix.',
    'a DevOps Lead at Cloudflare.',
  ];
  const [typed, setTyped] = useState(phrases[0]);

  useEffect(() => {
    let isMounted = true;
    let currentPhraseIdx = 0;
    let currentText = phrases[0];
    let isDeleting = false;
    let typingSpeed = 50;

    const loop = async () => {
      while (isMounted) {
        const fullPhrase = phrases[currentPhraseIdx];
        
        if (isDeleting) {
          currentText = fullPhrase.substring(0, currentText.length - 1);
          setTyped(currentText);
          typingSpeed = 25;
          
          if (currentText === '') {
            isDeleting = false;
            currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
            typingSpeed = 400;
          }
        } else {
          currentText = fullPhrase.substring(0, currentText.length + 1);
          setTyped(currentText);
          typingSpeed = 55;
          
          if (currentText === fullPhrase) {
            isDeleting = true;
            typingSpeed = 2400;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
      }
    };

    const initialTimeout = setTimeout(() => {
      if (isMounted) {
        isDeleting = true;
        loop();
      }
    }, 2400);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
    };
  }, []);

  // --- STATE 3: Recruiter Vision Toggle ---
  const [recruiterActive, setRecruiterActive] = useState(false);

  // --- STATE 4: Before/After Slider ---
  const [sliderVal, setSliderVal] = useState(50);
  const computedSliderScore = Math.round(30 + sliderVal * 0.68); // scales 30% to 98%
  
  // Dynamic bullet description based on slider value
  const getSliderBullet = () => {
    if (sliderVal < 33) return "I was in charge of the database and fixing performance issues.";
    if (sliderVal < 66) return "Managed the React.js website and optimized database structures.";
    return "Engineered a high-performance database schema using Redis, reducing P95 database latency by 42% across clusters.";
  };

  // --- STATE 5: Real Sandbox Simulator ---
  const [sandboxRole, setSandboxRole] = useState("Software Engineer");
  const [sandboxInput, setSandboxInput] = useState("I helped run and fix bugs on our React website.");
  const [sandboxPhase, setSandboxPhase] = useState("idle"); // idle, thinking, done
  const [sandboxResult, setSandboxResult] = useState(null);
  const [sandboxScore, setSandboxScore] = useState(35);
  const simRef = useRef(null);

  const runSimulator = () => {
    if (sandboxPhase !== "idle") return;
    setSandboxPhase("thinking");
    trackEvent('landing_sandbox_run', { role: sandboxRole });
    
    setTimeout(() => {
      setSandboxPhase("done");
      setSandboxScore(95);
      setSandboxResult({
        optimized: "Developed and optimized a production React application serving 25k+ users, implementing route splitting to cut bundle size by 42% and boost performance scores.",
        keywordsAdded: ["Performance Optimization", "React.js", "Route Splitting", "Production Scaling"],
        alertsFixed: 3
      });
    }, 1600);
  };

  const resetSimulator = () => {
    setSandboxPhase("idle");
    setSandboxResult(null);
    setSandboxScore(35);
  };

  /* ── Scan line animation ref ── */
  const [scanY, setScanY] = useState(0);
  useEffect(() => {
    let frame;
    const animate = () => {
      setScanY(prev => (prev + 0.4) % 100);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
  }, []);

  // Scroll reveal observer for features vertical timeline rows
  useEffect(() => {
    const rows = document.querySelectorAll('.reveal-row');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    rows.forEach(r => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  /* ── Scroll-reveal hooks ── */
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useRef(null);
  const r5 = useReveal();

  const scoreColor = sandboxScore >= 80 ? '#10B981' : sandboxScore >= 60 ? '#F59E0B' : '#EF4444';
  const heroScoreColor = heroScore >= 80 ? '#10B981' : heroScore >= 60 ? '#F59E0B' : '#EF4444';
  const sliderScoreColor = computedSliderScore >= 80 ? '#10B981' : computedSliderScore >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="landing-root">
      <SEO title="Get More Interviews with an ATS-Optimized Resume | ATSResify" description="Build, analyze, tailor, and optimize your resume using AI in minutes. Get more interviews and land jobs faster." href="https://atsresify.me/" />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ATSResify",
            "operatingSystem": "All",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Build, analyze, and optimize your resume using AI. Get ATS-ready PDFs in minutes."
          })}
        </script>
      </Helmet>

      {/* Floating Live Activity Feed Widget */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-none flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {activityFeed.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-900/90 text-white backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 text-xs pointer-events-auto"
            >
              <span className="text-sm">{act.icon}</span>
              <span className="font-semibold tracking-tight">{act.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(247, 253, 251)"
        gradientBackgroundEnd="rgb(213, 245, 236)"
        firstColor="18, 194, 150"
        secondColor="52, 211, 175"
        thirdColor="16, 160, 130"
        fourthColor="130, 235, 200"
        fifthColor="80, 220, 190"
        pointerColor="18, 194, 150"
        size="80%"
        blendingValue="hard-light"
        containerClassName="hero"
      >
        <Navbar />
        <div className="hero-content">
          
          {/* Hero Section */}
          <section className="hero-section pt-12 pb-24" ref={r1}>
            <div className="hero-container max-w-[1100px] mx-auto px-6 text-center relative z-10 font-sans">
              <div className="hero-eyebrow-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-teal-800 font-semibold text-xs mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                Resume formatting and optimization for job seekers
              </div>
              
              <h1 className="hero-h1 font-display font-extrabold text-slate-900 text-4xl md:text-6xl tracking-tight leading-tight mb-6">
                Land More Interviews with an <span className="hero-gradient-text font-black tracking-tight">ATS-Friendly Resume</span>
              </h1>
              <p className="hero-p text-slate-500 font-medium max-w-xl mx-auto leading-relaxed text-base">
                Import your resume, tailor it to the job description, and export a flawless PDF. Land your next role as <strong>{typed}</strong>
              </p>

              {/* Split Pane Hero Panel */}
              <div className="hero-dashboard mt-8 text-left">
                
                {/* Left Pane - Text input simulator */}
                <div className="dash-pane dash-left">
                  <div className="pane-header">
                    <span className="pane-tab">experience_input.txt</span>
                    <span className="pane-title">→ resume.tex</span>
                  </div>
                  <div className="pane-body">
                    <div className="code-block-wrap">
                      <div className="code-block input-block">
                        <span className="code-label">INPUT</span>
                        <p className="code-text font-mono text-[11px] leading-relaxed text-slate-500">
                          <span className="text-slate-400 font-normal">// Your plain text</span><br/>
                          I <span className="text-teal-600 font-semibold">managed</span> our team's website and <span className="text-teal-600 font-semibold">fixed</span> a lot of performance issues with the database and frontend.<span className="cursor-blink" />
                        </p>
                      </div>
                      
                      {/* AI Enhancement indicator */}
                      <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#0D9488] animate-subtle-pulse">
                        <ArrowDown className="w-4 h-4" />
                        AI Enhancement
                      </div>

                      <div className="code-block output-block">
                        <span className="code-label code-label-success">LATEX OUTPUT</span>
                        <code className="font-mono text-[11px] leading-relaxed text-slate-600">
                          <span className="text-teal-700 font-bold">\resumeItem</span>
                          {`{${
                            heroStep >= 3 
                              ? "Engineered a high-performance database schema using Redis, reducing P95 database latency by 42%." 
                              : "I was in charge of our web app database..."
                          }}`}
                        </code>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-mono text-slate-400 mt-auto">
                      <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                        {heroStep === 4 ? 'Optimization Complete' : 'AI Engine Syncing...'}
                      </span>
                      <span>Keywords: Redis, latency, caching</span>
                    </div>
                  </div>
                </div>

                {/* Right Pane - PDF Preview / Scorer */}
                <div className="dash-pane dash-right">
                  <div className="pane-header">
                    <span className="pane-tab">preview_compiled.pdf</span>
                    <span className="pane-status"><span className="pane-status-dot bg-[#14B8A6]" />LIVE</span>
                  </div>
                  <div className="pane-body flex flex-col justify-between p-5 relative">
                    
                    {/* Compiled PDF Sheet */}
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100 flex-1 flex flex-col justify-between min-h-[300px] text-left">
                      <div className="text-center pb-2 border-b border-slate-100">
                        <h4 className="font-sans font-bold text-slate-800 text-sm uppercase tracking-wider">Jane Candidate</h4>
                        <p className="text-[9px] text-slate-400 font-mono">jane@candidate.com · github.com/jane · linkedin.com/in/jane</p>
                      </div>
                      
                      <div className="flex-1 py-3 flex flex-col gap-2.5">
                        <div className="border-b border-slate-100 pb-1.5">
                          <span className="font-bold text-[9px] text-slate-800 uppercase tracking-wider block mb-1">Experience</span>
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[9px] text-slate-700">Software Architect — Acme Corp</span>
                            <span className="text-[8px] text-slate-400 font-mono">Jun 2022 – Present</span>
                          </div>
                          <div className="mt-1 flex flex-col gap-1">
                            <div className="h-1 bg-slate-200/50 rounded-full w-[95%]" />
                            <div className="h-1 bg-slate-200/50 rounded-full w-[90%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score gauge overlay inside preview */}
                    <div className="absolute bottom-16 right-8 bg-white rounded-full shadow-[0_12px_36px_rgba(15,23,42,0.15)] p-1.5 border border-slate-100 flex items-center justify-center z-20">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(20, 184, 166, 0.1)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke={heroScoreColor} strokeWidth="8"
                            strokeDasharray={`${(heroScore / 100) * 263.8} 263.8`}
                            strokeLinecap="round" transform="rotate(-90 50 50)"
                            style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold font-sans text-teal-600">{heroScore}</span>
                          <span className="text-[6px] text-slate-400 font-bold uppercase">ATS Score</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400 mt-auto">
                      <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                        PDF/A-1a Compiled
                      </span>
                      <span>Page 1 of 1 · 100% Vector</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* CTA Buttons with Spacing Rhythm and Trust Badges */}
              <div className="hero-ctas mt-8">
                <button 
                  onClick={() => navigate('/create-resume/prompt')} 
                  aria-label="Start Building My Resume for free"
                  className="cta-primary focus-visible:ring-2 focus-visible:ring-teal-500/50 outline-none"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  Start Building My Resume
                </button>
                <SecondaryButton 
                  onClick={() => simRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                  icon={ScanSearch}
                  ariaLabel="Check My ATS Score"
                >
                  Check My ATS Score
                </SecondaryButton>
              </div>
              
              <p className="hero-footnote mt-4 text-xs text-slate-400 font-medium tracking-wide flex justify-center gap-4 flex-wrap">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> No credit card required</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> ATS-friendly formatting</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-teal-600" /> Private by default</span>
              </p>
            </div>
          </section>
          {/* Social Proof Logo Cloud */}
          <div className="relative z-10 max-w-[900px] mx-auto px-6 mt-8 mb-4 text-center hidden md:block">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Built for professionals aiming for top tier companies</p>
            <div className="flex items-center justify-center gap-8 lg:gap-16 opacity-40 hover:opacity-70 transition-all duration-500 grayscale select-none">
              <div className="text-xl font-black font-display tracking-tight text-slate-800">Google</div>
              <div className="text-xl font-black font-sans italic tracking-tighter text-slate-800">Stripe</div>
              <div className="text-xl font-bold font-serif tracking-widest text-slate-800">NETFLIX</div>
              <div className="text-xl font-black font-display tracking-normal text-slate-800">Spotify</div>
              <div className="text-xl font-black font-sans tracking-tight text-slate-800">airbnb</div>
            </div>
          </div>

          {/* METRICS BAR */}
          <section className="metrics-bar" aria-label="Key Performance Indicators">
            <div ref={r2} className="reveal metrics-inner">
              {[
                { val: 'ATS-Friendly', label: 'Clean, parseable PDF formatting' },
                { val: 'Tailored', label: 'Job-specific suggestions' },
                { val: 'Optimized', label: 'Matches target descriptions' },
                { val: 'Free to Start', label: 'No hidden paywalls' },
              ].map((m, i) => (
                <div key={i} className="metric-item flex flex-col justify-between items-center h-full text-center">
                  <div className="metric-val text-[#14B8A6]">{m.val}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </BackgroundGradientAnimation>

      {/* VERTICAL TIMELINE SHOWCASE */}
      <section className="feature-showcase bg-transparent pt-12 pb-20 overflow-hidden" ref={r3} aria-label="Key Capabilities">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-eyebrow">HOW IT WORKS</span>
            <h2 className="section-h2">Everything you need to build a stronger resume</h2>
          </div>
          <CoreCapabilities />
        </div>
      </section>

      {/* SIGNATURE SECTION: How Recruiters Actually See Your Resume */}
      <section className="py-16 px-6 max-w-[1100px] mx-auto font-sans relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-mono text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Recruiter Diagnostic</span>
          <h2 className="text-2xl md:text-4xl font-display font-extrabold text-slate-900 mt-4 leading-tight mb-4">
            See how applicant tracking systems read your resume
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
            Before a human reads your resume, applicant tracking systems scan it. If your formatting is messy or keywords are missing, your application might be skipped. Toggle below to see how we fix formatting and extract key skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Left: The interactive diagnostic panel */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6">
              
              {/* App Header */}
              <div className="bg-slate-100 border-b border-slate-200/60 px-4 py-3 flex items-center justify-between rounded-t-2xl -mx-6 -mt-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <span className="ml-2 font-bold text-[10px] uppercase tracking-widest text-slate-400">ATS Dashboard Viewer</span>
                </div>
                <button
                  onClick={() => setRecruiterActive(!recruiterActive)}
                  aria-label="Toggle ATS alignment fix"
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg border cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-teal-500/50 outline-none ${
                    recruiterActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse hover:bg-rose-100'
                  }`}
                >
                  {recruiterActive ? 'Toggle Original' : 'Toggle Formatting Fix'}
                </button>
              </div>

              {/* Mock Resume Evaluator Canvas */}
              <div className="space-y-4 text-left font-sans text-xs">
                
                {/* Section header */}
                <div className="border-b pb-2">
                  <h4 className="font-extrabold text-sm text-slate-800">Jane Candidate</h4>
                  <p className="text-[10px] text-slate-400">jane@candidate.com · San Francisco, CA</p>
                </div>

                {/* Unoptimized Resume state */}
                {!recruiterActive ? (
                  <div className="space-y-3.5">
                    <div className="p-3 rounded-xl border border-rose-150 bg-rose-50/20 relative">
                      <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        <AlertCircle className="w-3 h-3" /> formatting error
                      </div>
                      <h5 className="font-bold text-slate-700">EXPERIENCE: Software Developer</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                        "I worked in a team building a web app and database. I was in charge of coding the interface and testing performance."
                      </p>
                      <div className="mt-2 text-[10px] font-mono text-rose-650 font-bold">
                        ⚠️ Weak action verbs · No metrics · Non-standard section name
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-rose-150 bg-rose-50/20 relative">
                      <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        <AlertCircle className="w-3 h-3" /> keyword gap
                      </div>
                      <h5 className="font-bold text-slate-700">SKILLS</h5>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Coding, Databases, Testing, Javascript, React
                      </p>
                      <div className="mt-2 text-[10px] font-mono text-rose-650 font-bold">
                        ⚠️ Missing target tags: "Redis, CI/CD, Microservices, REST APIs"
                      </div>
                    </div>
                  </div>
                ) : (
                  // Optimized state
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3.5"
                  >
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 relative">
                      <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> passes ats
                      </div>
                      <h5 className="font-bold text-slate-700">WORK EXPERIENCE</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                        "Architected database tables and React components serving 25k+ users, implementing Redis caching that reduced initial P95 loads by 42%."
                      </p>
                      <div className="mt-2 text-[10px] font-mono text-emerald-600 font-bold">
                        ✅ Strong metric parameters · Standard headers
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 relative">
                      <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> keywords complete
                      </div>
                      <h5 className="font-bold text-slate-700">SKILLS</h5>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">
                        React.js · Redis · CI/CD · Microservices · PostgreSQL · REST APIs
                      </p>
                      <div className="mt-2 text-[10px] font-mono text-emerald-600 font-bold">
                        ✅ 100% match with Software Architect job specs
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

            </GlassCard>
          </div>

          {/* Right: Diagnostic description / Summary card */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
              {recruiterActive ? 'Every issue resolved instantly' : 'Why this resume gets rejected'}
            </h3>
            
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-md">
              {recruiterActive 
                ? 'Weak sentences become quantified achievements. Missing keywords are identified and added. Section headers follow standard naming conventions. Your resume is formatted for maximum readability.'
                : 'No metrics, vague descriptions, and missing skills. Complex layouts confuse parsers, causing them to flag formatting issues and skip your application before a recruiter ever sees it.'
              }
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-4 border border-white/5 shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-teal-400">{recruiterActive ? '94%' : '35%'}</span>
                <span className="text-[7px] text-slate-400 uppercase font-bold mt-0.5">MATCH SCORE</span>
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold uppercase tracking-wider text-slate-350">{recruiterActive ? 'Ready for Review' : 'Needs Improvement'}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {recruiterActive ? 'Strong keyword alignment' : 'Low visibility: Missing key skills and formatting errors'}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="md"
              aria-label="Toggle evaluator fixes view"
              onClick={() => setRecruiterActive(!recruiterActive)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {recruiterActive ? 'Show Failures' : 'Run Formatting Fix'}
            </Button>
          </div>

        </div>
      </section>

      {/* STORYTELLING BEFORE / AFTER SLIDER SECTION (Optimized Spacing + Continuous Live Metrics updates) */}
      <section className="py-12 md:py-16 lg:py-24 bg-slate-50 border-y border-slate-200/40 px-6 font-sans">
        <div className="max-w-[1100px] mx-auto text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-mono text-teal-600 uppercase tracking-widest font-bold border-l-2 border-teal-500 pl-3">Before & After</span>
            <h2 className="text-2xl md:text-4xl font-display font-extrabold text-slate-900 mt-4 leading-tight mb-4">
              See the transformation
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
              Original Resume ➔ Keyword Analysis ➔ Missing Skills Found ➔ Weak Bullet Points Improved ➔ Formatting Fixed ➔ Updated Resume ➔ Higher ATS Compatibility.
            </p>
          </div>

          <div className="max-w-[900px] mx-auto space-y-6">
            {/* Slider track control */}
            <div className="flex items-center gap-4 justify-center">
              <span className="text-xs font-bold text-rose-650 uppercase">Original Draft</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderVal} 
                aria-label="Drag compare slider handle"
                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                className="w-48 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-650 focus:outline-none"
              />
              <span className="text-xs font-bold text-emerald-650 uppercase">Optimized Output</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">
              {/* Left pane: Preview box based on slider */}
              <GlassCard className="p-6 flex flex-col justify-between text-left">
                <div>
                  {/* Code Editor Header */}
                  <div className="bg-slate-100 border-b border-slate-200/60 px-4 py-3 flex items-center justify-between rounded-t-2xl -mx-6 -mt-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      </div>
                      <span className="ml-2 font-bold text-[10px] uppercase tracking-widest text-slate-400">LaTeX Editor</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Live Preview</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-slate-400">Source Line:</span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded font-sans ${
                          sliderVal < 33 
                            ? 'bg-rose-50 text-rose-700' 
                            : sliderVal < 66 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {sliderVal < 33 ? 'Unoptimized' : sliderVal < 66 ? 'Partial Match' : 'Highly Targeted'}
                        </span>
                      </div>
                      
                      <div className="bg-slate-900/5 border border-slate-900/10 rounded-xl p-3 min-h-[90px] flex items-center justify-center">
                        <p className="font-mono text-[11px] leading-relaxed text-slate-700 italic">
                          "{getSliderBullet()}"
                        </p>
                      </div>

                      {/* Display live keyword tags indicators */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sliderVal >= 33 && (
                          <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">
                            +React.js
                          </span>
                        )}
                        {sliderVal >= 66 && (
                          <>
                            <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold">
                              +Redis Caching
                            </span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold">
                              +P95 Latency
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Metric footer inside card */}
                <div className="border-t pt-2 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>ATS Match Rating</span>
                  <span className="font-bold font-sans text-slate-800" style={{ color: sliderScoreColor }}>
                    {computedSliderScore}%
                  </span>
                </div>
              </GlassCard>

              {/* Right pane: Key metrics summary */}
              <div className="text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-2 border-teal-500/20 flex items-center justify-center" style={{ borderColor: sliderScoreColor }}>
                    <span className="text-lg font-black text-teal-650" style={{ color: sliderScoreColor }}>{computedSliderScore}%</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                      {sliderVal < 33 ? 'Critical Action Required' : sliderVal < 66 ? 'Keyword density gaps' : 'ATS Parser Approved'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {sliderVal < 33 ? 'Recruiters spend 6 seconds. Bullet has no metrics.' : sliderVal < 66 ? 'Missing target terms: Redis, Caching, P95.' : 'Optimal density metrics reached. Passes filters.'}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-200 my-4" />

                <p className="text-xs text-slate-500 leading-relaxed">
                  Moving the slider tailors the resume from a weak input description into a metrics-dense, keyword-optimized bullet point. Standard, clean outlines ensure proper parsing density for ATS.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${sliderVal >= 33 ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>Includes searchable vector text layouts.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${sliderVal >= 66 ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>Calculates precise key phrase target matches.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (Standardized Spacing) */}
      <section className="pt-12 md:pt-16 lg:pt-24 pb-16 md:pb-24 px-6 max-w-[960px] mx-auto font-sans" aria-label="Frequently Asked Questions">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100/60 mb-4">
            <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[11px] font-mono text-teal-700 uppercase tracking-widest font-bold">FAQ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 leading-tight mb-3">
            Frequently asked questions
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Everything you need to know about our resume builder. Can't find an answer? <a href="/contact" className="text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2">Reach out</a>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FAQItem 
            index={0}
            question="Will ATS software accept these resumes?" 
            answer="Yes. Resumes are compiled from clean, structured data into PDF documents. We avoid tables, text boxes, and complex layouts that confuse ATS parsers. The output is plain vector text that major applicant tracking systems can easily read."
          />
          <FAQItem 
            index={1}
            question="Can I upload my current resume?" 
            answer="Yes. You can import your existing PDF or Word document. The parser extracts your content into structured sections so you don't have to start from scratch."
          />
          <FAQItem 
            index={2}
            question="Can I tailor one resume for multiple jobs?" 
            answer="Yes. Paste a job description alongside your resume. The tool identifies missing keywords and skill gaps specific to that role so you can create tailored versions."
          />
          <FAQItem 
            index={3}
            question="Is my data private?" 
            answer="Yes. All data is encrypted at rest and in transit. Your resumes are never shared or sold. Your account is private by default and you can delete your data at any time."
          />
          <FAQItem 
            index={4}
            question="Can I export to PDF?" 
            answer="Yes. You can export a clean, ATS-friendly PDF that keeps its formatting when recruiters and applicant tracking systems open it. There are no paywalls to export."
          />
          <FAQItem 
            index={5}
            question="Can I edit my resume later?" 
            answer="Yes. Your resume data is saved securely. You can return at any time to add new experience, update skills, or create a new version for a different job."
          />
        </div>
      </section>

      {/* FINAL CTA — Frosted Glass */}
      <section className="cta-section py-16">
        <div ref={r5} className="reveal cta-wrapper">
          <div className="cta-panel">
            <div className="cta-glow cta-glow-1" />
            <div className="cta-glow cta-glow-2" />
            <div className="cta-inner">
              <h2 className="cta-h2 font-display font-extrabold mb-4">Your next opportunity starts here</h2>
              <p className="cta-sub text-slate-500 mb-6">Build an ATS-friendly resume in minutes. Start with a clean layout and apply with confidence.</p>
              
              <div className="cta-btns mb-8">
                <button 
                  onClick={() => navigate('/create-resume/prompt')} 
                  aria-label="Start Building My Resume for free"
                  className="cta-primary focus-visible:ring-2 focus-visible:ring-teal-500/50 outline-none"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  Start Building My Resume
                </button>
                <SecondaryButton 
                  onClick={() => navigate('/ats-checker')} 
                  icon={ScanSearch}
                  ariaLabel="Check current ATS score"
                >
                  Check My ATS Score
                </SecondaryButton>
              </div>
              
              <p className="text-xs text-slate-400 font-medium tracking-wide flex justify-center gap-4 flex-wrap">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-teal-650" /> No credit card required</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-teal-650" /> Secure vector export</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-teal-650" /> Export PDF anytime</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
