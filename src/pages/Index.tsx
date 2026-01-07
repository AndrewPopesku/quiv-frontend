import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useNavigate } from "react-router-dom";
import { WordOfTheDay } from "@/components/dashboard/WordOfTheDay";
import { CinemaPreview } from "@/components/dashboard/CinemaPreview";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { RecentWords } from "@/components/dashboard/RecentWords";
import { BookOpen, Target, Clock, Award, PenTool, Book, Layers, ListChecks, Link as LinkIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-gradient-gold">Alex</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to expand your vocabulary today?
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">

        {/* Word of the Day - Large Card */}
        <WordOfTheDay />
        {/* Streak Card */}
        <StreakCard />
        <StatCard
          title="Words Learned"
          value="247"
          subtitle="this week"
          icon={BookOpen}
          trend={{ value: "12% more than last week", positive: true }}
          variant="gold"
        />
        <StatCard
          title="Daily Goal"
          value="8/10"
          subtitle="words"
          icon={Target}
          variant="blue"
        />
      </div>

      {/* Exercise Selection Area */}
      <div className="mb-12 fade-in" style={{ animationDelay: '100ms' }}>
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Book className="text-primary w-6 h-6" /> Choose an Exercise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flashcards */}
          <button
            onClick={() => navigate('/exercises/flashcards')}
            className="glass-card hover:border-primary transition-all p-8 text-left group flex flex-col justify-between h-56"
          >
            <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <Layers size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Flashcards</h3>
              <p className="text-muted-foreground leading-relaxed">Learn words and definitions at your own pace</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/exercises/multiple-choice')}
            className="glass-card hover:border-primary/30 transition-all p-8 text-left group flex flex-col justify-between h-56"
          >
            <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <ListChecks size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Multiple Choice</h3>
              <p className="text-muted-foreground leading-relaxed">Test your knowledge by selecting correct definitions</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/exercises/matching')}
            className="glass-card hover:border-primary/30 transition-all p-8 text-left group flex flex-col justify-between h-56"
          >
            <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <LinkIcon size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Matching</h3>
              <p className="text-muted-foreground leading-relaxed">Match words with their correct definitions</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/exercises/sentence-builder')}
            className="bg-gradient-to-br from-secondary to-[#1e40af] p-8 rounded-2xl border border-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all text-left group flex flex-col justify-between h-56 relative overflow-hidden"
          >
            <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
              <PenTool size={28} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Sentence Builder</h3>
              <p className="text-white/80 leading-relaxed">Use words in sentences - AI checks your fluency</p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          </button>
        </div>
      </div>

      {/* Remaining Dashboard items */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">



        {/* Recent Words */}
        <RecentWords />

        {/* Cinema Preview */}
        <CinemaPreview />
      </div>
    </Layout>
  );
};

export default Index;
