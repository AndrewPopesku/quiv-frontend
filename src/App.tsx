import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { OpenAPI } from "@/api";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Writing from "./pages/Writing";
import Vocabulary from "./pages/Vocabulary";
import SavedWords from "./pages/SavedWords";
import Profile from "./pages/Profile";
import Flashcards from "./pages/exercises/Flashcards";
import Matching from "./pages/exercises/Matching";
import MultipleChoice from "./pages/exercises/MultipleChoice";
import SentenceBuilder from "./pages/exercises/SentenceBuilder";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
// import "./index.css";

declare const process: { env: Record<string, string | undefined> };
OpenAPI.BASE = (typeof process !== "undefined" && process.env?.API_BASE_URL) || "http://localhost:8000";
OpenAPI.TOKEN = async () => localStorage.getItem("access_token") ?? "";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    if (location.pathname !== "/") {
      return <Navigate to="/" replace />;
    }
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/writing" element={<Writing />} />
      <Route path="/vocabulary" element={<Vocabulary />} />
      <Route path="/saved-words" element={<SavedWords />} />
      <Route path="/exercises/flashcards" element={<Flashcards />} />
      <Route path="/exercises/matching" element={<Matching />} />
      <Route path="/exercises/multiple-choice" element={<MultipleChoice />} />
      <Route path="/exercises/sentence-builder" element={<SentenceBuilder />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={"/"}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
