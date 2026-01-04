import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { WordOfTheDay } from "@/components/dashboard/WordOfTheDay";
import { CinemaPreview } from "@/components/dashboard/CinemaPreview";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { RecentWords } from "@/components/dashboard/RecentWords";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { BookOpen, Target, Clock, Award } from "lucide-react";

const Index = () => {
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

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Stats Row */}
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
        <StatCard
          title="Time Studied"
          value="4.5"
          subtitle="hours"
          icon={Clock}
        />
        <StatCard
          title="Level"
          value="B2"
          subtitle="Upper-Int."
          icon={Award}
        />

        {/* Word of the Day - Large Card */}
        <WordOfTheDay />

        {/* Streak Card */}
        <StreakCard />

        {/* Recent Words */}
        <RecentWords />

        {/* Cinema Preview */}
        <CinemaPreview />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </Layout>
  );
};

export default Index;
