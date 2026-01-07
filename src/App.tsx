import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
// import "./index.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={typeof process !== 'undefined' ? process.env.PUBLIC_PATH : "/"}>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
