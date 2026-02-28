import { motion } from "motion/react";
import {
  Sparkles,
  BookOpen,
  PenTool,
  ChevronRight,
  CheckCircle2,
  Globe2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
      <Sparkles size={20} className="fill-current" />
    </div>
    <span className="text-xl font-bold tracking-tight text-primary">
      Levise
    </span>
  </div>
);

const Navbar = ({ onLogin, onGetStarted }: { onLogin: () => void; onGetStarted: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Logo />
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">
          Features
        </a>
        <a
          href="#how-it-works"
          className="hover:text-foreground transition-colors"
        >
          How it Works
        </a>
        <a href="#pricing" className="hover:text-foreground transition-colors">
          Pricing
        </a>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onLogin}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
        >
          Log in
        </button>
        <button
          onClick={onGetStarted}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  </nav>
);

const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <section className="pt-32 pb-20 px-6 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-medium text-primary mb-6">
          <Sparkles size={14} />
          <span>Smart vocabulary & writing assistant</span>
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">
            Learn.
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-primary">
            Revise.
          </span>
          <br />
          Master your words.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300 font-semibold">Le</span>arn + Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-primary font-semibold">vise</span> = Levise. An intelligent dictionary, spaced repetition learning,
          and an AI-powered writing lab to help you communicate with confidence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Start Learning
            <ChevronRight size={18} />
          </button>
          {/* <button className="w-full sm:w-auto bg-card hover:bg-accent border border-border text-foreground px-8 py-4 rounded-xl text-base font-medium transition-colors">
            View Demo
          </button> */}
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
        className="rounded-2xl border border-border overflow-hidden shadow-2xl shadow-primary/5"
      >
        <img
          src="/images/dashboard.png"
          alt="Levise dashboard showing word of the day, streak tracking, and vocabulary stats"
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Comprehensive Dictionary",
      description:
        "Look up any word to see detailed meanings, synonyms, pronunciation, and real-world examples.",
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "Vocabulary Tracking",
      description:
        "Save words to your personal collection and track your mastery progress over time.",
    },
    {
      icon: <PenTool size={24} />,
      title: "Smart Writing Lab",
      description:
        "Get AI-powered feedback on your writing. Improve your English or translate from other languages.",
    },
    {
      icon: <Globe2 size={24} />,
      title: "Activity Calendar",
      description:
        "Visualize your learning journey with a detailed activity calendar and daily streak tracking.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-6 bg-[#0f0f11] border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to master language
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete suite of tools designed to help you learn new words,
            remember them forever, and use them perfectly in your writing.
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
              className="bg-card border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
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
  <section className="py-24 px-6 overflow-hidden bg-background border-t border-border">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Deep dive into any word
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Our comprehensive dictionary doesn't just give you a definition.
              It provides context, synonyms, pronunciation, and real-world
              examples to help you truly understand and remember new vocabulary.
            </p>
            <ul className="space-y-4">
              {[
                "Detailed meanings and parts of speech",
                "Audio pronunciation guides",
                "Rich context with example sentences",
                "Synonyms and related expressions",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-foreground"
                >
                  <div className="text-primary">
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
            className="rounded-2xl border border-border overflow-hidden shadow-2xl"
          >
            <img
              src="/images/dictionary.png"
              alt="Levise dictionary showing word lookup with meanings, pronunciation, and synonyms"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const SavedWordsShowcase = () => (
  <section className="py-24 px-6 overflow-hidden bg-[#0f0f11] border-t border-border">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Build your personal vocabulary
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Save words you want to learn and track your mastery over time. Our
              spaced repetition system ensures you review words right when
              you're about to forget them.
            </p>
            <ul className="space-y-4">
              {[
                "Organize words into collections",
                "Track mastery percentage for each word",
                "Spaced repetition learning algorithms",
                "Quick review sessions",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-foreground"
                >
                  <div className="text-primary">
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
            className="rounded-2xl border border-border overflow-hidden shadow-2xl"
          >
            <img
              src="/images/saved-words.png"
              alt="Levise saved words page with vocabulary collection and mastery tracking"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const WritingLabShowcase = () => (
  <section className="py-24 px-6 overflow-hidden bg-background border-t border-border">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your personal AI writing assistant
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              The Writing Lab acts as your intelligent editor. Enter text in
              English to receive smart suggestions for improvement, or paste
              text in any other language to get accurate translations and
              context.
            </p>
            <ul className="space-y-4">
              {[
                "Grammar and style corrections",
                "Vocabulary enhancement suggestions",
                "Tone adjustments",
                "Multi-language translation",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-foreground"
                >
                  <div className="text-primary">
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
            className="rounded-2xl border border-border overflow-hidden shadow-2xl"
          >
            <img
              src="/images/writing-lab.png"
              alt="Levise Writing Lab with AI-powered grammar corrections, vocabulary suggestions, and translation"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const CTA = ({ onGetStarted }: { onGetStarted: () => void }) => (
  <section className="py-24 px-6 relative overflow-hidden bg-[#0f0f11] border-t border-border">
    <div className="absolute inset-0 bg-primary/5" />
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Ready to expand your vocabulary?
      </h2>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
        Join thousands of learners who are improving their language skills every
        day with Levise.
      </p>
      <button
        onClick={onGetStarted}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
      >
        Create Your Account
      </button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-background border-t border-border py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <Logo />
      {/* <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Terms of Service
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Contact
        </a>
      </div> */}
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Levise. All rights reserved.
      </p>
    </div>
  </footer>
);

export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleGetStarted = () => navigate("/login?register=true");

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar onLogin={handleLogin} onGetStarted={handleGetStarted} />
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <AppMockup />
        <Features />
        <DictionaryShowcase />
        <SavedWordsShowcase />
        <WritingLabShowcase />
        <CTA onGetStarted={handleGetStarted} />
      </main>
      <Footer />
    </div>
  );
}
