const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";
import { Brain, Play, Trophy } from "lucide-react";

import QuizRunner from "@/components/QuizRunner";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress";

export default function Quiz() {
  const { progress, recordQuiz } = useProgress();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    db.entities.QuizQuestion.filter({}, { sort: "created_date", limit: 40 })
      .then((page) => setQuestions(page.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Brain className="h-6 w-6" />
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Cosmic quiz</h1>
        <p className="text-sm text-muted-foreground">
          Answer at your own pace — every question explains the answer, so you learn something either way.
        </p>
      </header>

      {loading && (
        <div className="h-64 animate-pulse rounded-[2rem] border border-border/40 bg-card/30" />
      )}

      {!loading && questions.length === 0 && (
        <p className="rounded-[2rem] border border-border/60 bg-card/50 p-6 text-center text-sm text-muted-foreground backdrop-blur">
          No questions yet — check back soon.
        </p>
      )}

      {!loading && questions.length > 0 && !playing && (
        <div className="rounded-[2rem] border border-border/60 bg-card/60 p-8 text-center backdrop-blur">
          <h2 className="font-display text-xl font-semibold">{questions.length} questions ready</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each correct answer earns XP. A perfect run gives you a bonus.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-sm">
              <Trophy className="h-4 w-4 text-primary" />
              Best score: {progress.bestScore}%
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-sm">
              Quizzes taken: {progress.quizzesTaken}
            </span>
          </div>
          <Button className="mt-7 rounded-full px-6" onClick={() => setPlaying(true)}>
            <Play className="mr-1.5 h-4 w-4" />
            Start quiz
          </Button>
        </div>
      )}

      {!loading && playing && (
        <QuizRunner
          key={round}
          questions={questions}
          onComplete={({ score, xp }) => recordQuiz(score, xp)}
          onRestart={() => setRound((value) => value + 1)}
        />
      )}
    </div>
  );
}