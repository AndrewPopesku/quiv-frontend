import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { WordOfTheDay } from "@/components/dashboard/WordOfTheDay";
import { CinemaPreview } from "@/components/dashboard/CinemaPreview";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { RecentWords } from "@/components/dashboard/RecentWords";
import { BookOpen, Target, Book } from "lucide-react";
import { EXERCISES } from "@/data/exercises";
import { ExerciseCard } from "@/components/dashboard/ExerciseCard";
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

      {/* Exercise Selection Area */}
      {/* <div className="mb-12 fade-in" style={{ animationDelay: '100ms' }}>
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Book className="text-primary w-6 h-6" /> Choose an Exercise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXERCISES.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => navigate(exercise.route)}
            />
          ))}
        </div>
      </div> */}

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
