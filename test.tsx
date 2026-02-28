import { motion } from 'motion/react';
import { Sparkles, BookOpen, PenTool, LayoutDashboard, ChevronRight, CheckCircle2, Globe2, Zap } from 'lucide-react';
import { useState } from 'react';

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-levise-accent text-levise-bg p-1.5 rounded-lg">
      <Sparkles size={20} className="fill-current" />
    </div>
    <span className="text-xl font-bold tracking-tight text-levise-accent">Levise</span>
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-levise-bg/80 backdrop-blur-md border-b border-levise-border">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Logo />
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-levise-muted">
        <a href="#features" className="hover:text-levise-text transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-levise-text transition-colors">How it Works</a>
        <a href="#pricing" className="hover:text-levise-text transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-levise-muted hover:text-levise-text transition-colors hidden sm:block">
          Log in
        </button>
        <button className="bg-levise-accent hover:bg-levise-accent-hover text-levise-bg px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Get Started
        </button>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-32 pb-20 px-6 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-levise-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-levise-card border border-levise-border text-xs font-medium text-levise-accent mb-6">
          <Sparkles size={14} />
          <span>Smart vocabulary & writing assistant</span>
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Master your words.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-levise-accent to-orange-300">
            Elevate your writing.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-levise-muted mb-10 max-w-2xl mx-auto">
          Levise combines an intelligent dictionary, spaced repetition learning, and an AI-powered writing lab to help you communicate with confidence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-levise-accent hover:bg-levise-accent-hover text-levise-bg px-8 py-4 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2">
            Start Learning
            <ChevronRight size={18} />
          </button>
          <button className="w-full sm:w-auto bg-levise-card hover:bg-levise-card-hover border border-levise-border text-levise-text px-8 py-4 rounded-xl text-base font-medium transition-colors">
            View Demo
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const AppMockup = () => (
  <section className="px-6 pb-24">
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="rounded-2xl border border-levise-border bg-levise-bg overflow-hidden shadow-2xl shadow-levise-accent/5 flex flex-col md:flex-row h-[600px]"
      >
        {/* Sidebar Mockup */}
        <div className="w-64 border-r border-levise-border bg-[#0a0a0a] p-4 hidden md:flex flex-col gap-6">
          <div className="flex items-center gap-2 px-2 mb-4">
            <div className="bg-levise-accent text-levise-bg p-1.5 rounded-lg">
              <Sparkles size={20} className="fill-current" />
            </div>
            <span className="text-xl font-bold text-levise-accent">Levise</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-levise-card text-levise-accent font-medium">
              <LayoutDashboard size={18} /> Home
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-levise-muted hover:bg-levise-card hover:text-levise-text transition-colors">
              <BookOpen size={18} /> Dictionary
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-levise-muted hover:bg-levise-card hover:text-levise-text transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              Saved Words
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-levise-muted hover:bg-levise-card hover:text-levise-text transition-colors">
              <PenTool size={18} /> Writing Lab
            </div>
          </div>
        </div>

        {/* Main Content Mockup */}
        <div className="flex-1 bg-[#0f0f11] p-8 overflow-hidden flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, <span className="text-levise-accent">string</span></h2>
              <p className="text-levise-muted">Ready to expand your vocabulary today?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Word of the Day Card */}
            <div className="bg-levise-card border border-levise-border rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold tracking-wider text-levise-accent bg-levise-accent/10 px-2 py-1 rounded uppercase">Word of the Day</span>
                <BookOpen size={16} className="text-levise-muted" />
              </div>
              <h3 className="text-5xl font-bold text-levise-accent mb-2">zoo</h3>
              <p className="text-levise-muted text-sm mb-4">/zu:/</p>
              <p className="text-levise-text mb-8">зоопарк</p>
              <div className="mt-auto">
                <button className="w-full bg-levise-accent text-levise-bg font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                  Explore Full Definition <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Streak Card */}
              <div className="bg-levise-card border border-levise-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-levise-bg p-2 rounded-lg text-levise-muted">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold">No Streak Yet</h4>
                    <p className="text-xs text-levise-muted">Complete your daily goal to start</p>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  {['M','T','W','T','F','S','S'].map((day, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${i === 4 ? 'bg-levise-accent text-levise-bg' : 'bg-levise-bg text-levise-muted'}`}>
                      {i === 4 ? <Zap size={14} className="fill-current" /> : day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-levise-card border border-levise-border rounded-xl p-6">
                  <p className="text-[10px] font-bold tracking-wider text-levise-muted uppercase mb-2">Words Learned</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-levise-accent">0</span>
                    <span className="text-sm text-levise-muted">total</span>
                  </div>
                </div>
                <div className="bg-levise-card border border-levise-border rounded-xl p-6">
                  <p className="text-[10px] font-bold tracking-wider text-levise-muted uppercase mb-2">Daily Goal</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-blue-500">0/2</span>
                    <span className="text-sm text-levise-muted">words</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Comprehensive Dictionary",
      description: "Look up any word to see detailed meanings, synonyms, pronunciation, and real-world examples."
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "Vocabulary Tracking",
      description: "Save words to your personal collection and track your mastery progress over time."
    },
    {
      icon: <PenTool size={24} />,
      title: "Smart Writing Lab",
      description: "Get AI-powered feedback on your writing. Improve your English or translate from other languages."
    },
    {
      icon: <Globe2 size={24} />,
      title: "Activity Calendar",
      description: "Visualize your learning journey with a detailed activity calendar and daily streak tracking."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-[#0f0f11] border-t border-levise-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to master language</h2>
          <p className="text-levise-muted text-lg">
            A complete suite of tools designed to help you learn new words, remember them forever, and use them perfectly in your writing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-levise-card border border-levise-border p-6 rounded-2xl hover:border-levise-accent/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-levise-bg rounded-xl flex items-center justify-center text-levise-accent mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-levise-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DictionaryShowcase = () => (
  <section className="py-24 px-6 overflow-hidden bg-levise-bg border-t border-levise-border">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Deep dive into any word</h2>
            <p className="text-levise-muted text-lg mb-8 leading-relaxed">
              Our comprehensive dictionary doesn't just give you a definition. It provides context, synonyms, pronunciation, and real-world examples to help you truly understand and remember new vocabulary.
            </p>
            <ul className="space-y-4">
              {[
                "Detailed meanings and parts of speech",
                "Audio pronunciation guides",
                "Rich context with example sentences",
                "Synonyms and related expressions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-levise-text">
                  <div className="text-levise-accent">
                    <CheckCircle2 size={20} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0f0f11] border border-levise-border rounded-2xl p-6 shadow-2xl relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-levise-accent to-orange-400 rounded-2xl blur opacity-20 -z-10"></div>
            
            {/* Search Bar */}
            <div className="bg-levise-card border border-levise-border rounded-xl p-2 flex items-center gap-3 mb-6">
              <div className="pl-3 text-levise-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input type="text" value="word" readOnly className="bg-transparent border-none outline-none flex-1 text-levise-text" />
              <button className="bg-levise-accent text-levise-bg px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                <Sparkles size={16} className="fill-current" /> Analyze
              </button>
            </div>

            {/* Word Header */}
            <div className="bg-levise-card border border-levise-border rounded-xl p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-4xl font-bold text-levise-accent">word</h3>
                    <button className="text-levise-muted hover:text-levise-text">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    </button>
                  </div>
                  <p className="text-levise-muted font-mono text-sm">/wɜːrd/</p>
                </div>
                <button className="text-levise-muted hover:text-levise-text">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
              </div>
            </div>

            {/* Meanings */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Meanings</h4>
              <div className="bg-levise-card border border-levise-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-levise-accent/20 text-levise-accent flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-levise-accent uppercase mb-2 block">Noun</span>
                    <h5 className="text-xl font-semibold mb-2">word</h5>
                    <p className="text-levise-muted text-sm leading-relaxed mb-4">
                      A single distinct meaningful element of speech or writing, used with others (or sometimes alone) to form a sentence and typically shown with a space on either side when written or printed.
                    </p>
                    <div className="bg-[#1a1a1c] rounded-lg p-4 border-l-2 border-levise-accent mb-6">
                      <p className="text-levise-muted italic text-sm">"He didn't say a word during the entire meeting."</p>
                    </div>
                    
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-levise-muted uppercase mb-2 block">Synonyms</span>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-levise-accent/10 text-levise-accent text-xs font-medium border border-levise-accent/20">term</span>
                        <span className="px-3 py-1 rounded-full bg-levise-accent/10 text-levise-accent text-xs font-medium border border-levise-accent/20">expression</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const SavedWordsShowcase = () => (
  <section className="py-24 px-6 overflow-hidden bg-[#0f0f11] border-t border-levise-border">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Build your personal vocabulary</h2>
            <p className="text-levise-muted text-lg mb-8 leading-relaxed">
              Save words you want to learn and track your mastery over time. Our spaced repetition system ensures you review words right when you're about to forget them.
            </p>
            <ul className="space-y-4">
              {[
                "Organize words into collections",
                "Track mastery percentage for each word",
                "Spaced repetition learning algorithms",
                "Quick review sessions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-levise-text">
                  <div className="text-levise-accent">
                    <CheckCircle2 size={20} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-levise-bg border border-levise-border rounded-2xl p-6 shadow-2xl relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-l from-levise-accent to-orange-400 rounded-2xl blur opacity-20 -z-10"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Saved Words</h3>
                <p className="text-sm text-levise-muted">Manage your vocabulary collection and track progress.</p>
              </div>
              <div className="bg-levise-card border border-levise-border rounded-lg px-3 py-2 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-levise-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search collection..." className="bg-transparent border-none outline-none text-sm w-32" />
              </div>
            </div>

            <div className="bg-levise-card border border-levise-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-levise-border text-xs font-bold tracking-wider text-levise-muted uppercase">
                <div className="col-span-4">Word</div>
                <div className="col-span-4">First Definition</div>
                <div className="col-span-2">Mastery</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              {[
                { word: "Ephemeral", pron: "/ɪˈfem.ər.əl/", def: "Ефемерний", mastery: "0%" },
                { word: "zoo", pron: "/zu:/", def: "зоопарк", mastery: "0%" }
              ].map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-levise-border last:border-0 items-center hover:bg-levise-bg transition-colors">
                  <div className="col-span-4">
                    <p className="font-bold text-base">{item.word}</p>
                    <p className="text-xs text-levise-muted font-mono">{item.pron}</p>
                  </div>
                  <div className="col-span-4 text-sm text-levise-muted">
                    {item.def}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-levise-accent bg-levise-accent/10 px-1.5 py-0.5 rounded">{item.mastery}</span>
                    </div>
                    <div className="h-1 w-full bg-levise-bg rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-levise-accent w-0"></div>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end gap-3 text-levise-muted">
                    <button className="hover:text-levise-text"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
                    <button className="hover:text-red-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                    <button className="hover:text-levise-text"><ChevronRight size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const WritingLabShowcase = () => (
  <section className="py-24 px-6 overflow-hidden bg-levise-bg border-t border-levise-border">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your personal AI writing assistant</h2>
            <p className="text-levise-muted text-lg mb-8 leading-relaxed">
              The Writing Lab acts as your intelligent editor. Enter text in English to receive smart suggestions for improvement, or paste text in any other language to get accurate translations and context.
            </p>
            <ul className="space-y-4">
              {[
                "Grammar and style corrections",
                "Vocabulary enhancement suggestions",
                "Tone adjustments",
                "Multi-language translation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-levise-text">
                  <div className="text-levise-accent">
                    <CheckCircle2 size={20} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#0f0f11] border border-levise-border rounded-2xl p-6 shadow-2xl relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-levise-accent to-orange-400 rounded-2xl blur opacity-20 -z-10"></div>
            <h3 className="text-xl font-bold mb-2">Writing Lab</h3>
            <p className="text-sm text-levise-muted mb-6">Smart writing assistance. Enter text in English to improve it, or any other language to translate it.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-levise-card border border-levise-border rounded-xl p-4 flex flex-col h-64">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Your Text</span>
                  <button className="text-xs text-levise-muted flex items-center gap-1 hover:text-levise-text"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy</button>
                </div>
                <div className="bg-[#1a1a1c] rounded-lg p-3 flex-1 mb-3 text-sm text-levise-text">
                  go to beach
                </div>
                <div className="flex justify-between text-xs text-levise-muted mt-auto">
                  <span>3 words</span>
                  <span>11 characters</span>
                </div>
              </div>
              
              <div className="bg-levise-card border border-levise-border rounded-xl p-4 flex flex-col items-center justify-center text-center h-64">
                <div className="text-levise-muted mb-4">
                  <Sparkles size={32} />
                </div>
                <h4 className="font-semibold mb-2">Ready to Analyze</h4>
                <p className="text-xs text-levise-muted max-w-[200px]">Enter your text and click "Run Analysis" to get AI-powered feedback on your writing.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 rounded-lg border border-levise-border text-sm font-medium hover:bg-levise-card transition-colors flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Clear
              </button>
              <button className="px-4 py-2 rounded-lg bg-levise-accent text-levise-bg text-sm font-semibold hover:bg-levise-accent-hover transition-colors flex items-center gap-2">
                <Sparkles size={16} className="fill-current" />
                Run Analysis
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-24 px-6 relative overflow-hidden bg-[#0f0f11] border-t border-levise-border">
    <div className="absolute inset-0 bg-levise-accent/5" />
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to expand your vocabulary?</h2>
      <p className="text-xl text-levise-muted mb-10 max-w-2xl mx-auto">
        Join thousands of learners who are improving their language skills every day with Levise.
      </p>
      <button className="bg-levise-accent hover:bg-levise-accent-hover text-levise-bg px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
        Create Your Free Account
      </button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-levise-bg border-t border-levise-border py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <Logo />
      <div className="flex gap-6 text-sm text-levise-muted">
        <a href="#" className="hover:text-levise-text transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-levise-text transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-levise-text transition-colors">Contact</a>
      </div>
      <p className="text-sm text-levise-muted">
        © {new Date().getFullYear()} Levise. All rights reserved.
      </p>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-levise-bg text-levise-text selection:bg-levise-accent/30 selection:text-levise-accent">
      <Navbar />
      <main>
        <Hero />
        <AppMockup />
        <Features />
        <DictionaryShowcase />
        <SavedWordsShowcase />
        <WritingLabShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
