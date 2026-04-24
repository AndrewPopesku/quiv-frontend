import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { WordOfTheDay } from "@/components/dashboard/WordOfTheDay";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { RecentWords } from "@/components/dashboard/RecentWords";
import { BookOpen, Target, Dumbbell, ArrowRight } from "lucide-react";
import { ActivityService } from "@/api";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ["daily-stats"],
    queryFn: () => ActivityService.activityStatsRetrieve(),
  });
  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-gradient-gold">{user?.username}</span>
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
          value={String(stats?.words_learned ?? 0)}
          subtitle="total"
          icon={BookOpen}
          variant="gold"
        />
        <StatCard
          title="Daily Goal"
          value={`${stats?.words_today ?? 0}/${stats?.daily_goal ?? 0}`}
          subtitle="words"
          icon={Target}
          variant="blue"
        />
      </div>

      {/* Practice CTA */}
      <div className="mb-12 fade-in" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => navigate("/practice")}
          className="glass-card p-6 w-full text-left group hover:border-primary/50 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Dumbbell className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  Practice
                </h3>
                <p className="text-muted-foreground text-sm">AI-powered exercises to build real fluency — from flashcards to creative writing.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Remaining Dashboard items */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">



        {/* Recent Words */}
        <RecentWords />

        {/* Cinema Preview */}
        {/* <CinemaPreview /> */}
      </div>
    </Layout>
  );
};

export default Index;
