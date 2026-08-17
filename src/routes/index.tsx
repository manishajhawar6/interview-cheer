import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Compass,
  FileText,
  Leaf,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { analyzeResume, type ResumeAnalysis } from "@/lib/analyze-resume.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resume Review: Turn your resume into more interviews" },
      {
        name: "description",
        content:
          "Upload your resume for a private, ATS-aware AI review with score, summary, missing keywords, and personalized suggestions.",
      },
      { property: "og:title", content: "Resume Review: Turn your resume into more interviews" },
      {
        property: "og:description",
        content:
          "Upload your resume for a private, ATS-aware AI review with score, summary, missing keywords, and personalized suggestions.",
      },
    ],
  }),
  component: Index,
});

function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-serif text-lg font-bold">
          R
        </div>
        <span className="font-semibold text-foreground">Resume Review</span>
      </div>
      <span className="hidden text-sm text-muted-foreground sm:block">Built for your next opportunity</span>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-10 pb-16 text-center">
      <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">A calmer way to prepare</p>
      <h1 className="font-serif text-5xl leading-[1.05] text-primary sm:text-6xl md:text-7xl">
        Turn your resume into
        <br />
        more interviews.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
        Get clear, practical feedback that helps you show employers the value you bring , without the guesswork.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={<Check className="h-5 w-5" />}
          title="ATS-aware review"
          body="See how clearly your experience comes through."
        />
        <FeatureCard
          icon={<Leaf className="h-5 w-5" />}
          title="Privacy first"
          body="Your resume is discarded after this review."
        />
        <FeatureCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Feedback for you"
          body="Advice that is specific, supportive, and useful."
        />
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 text-left">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary">{icon}</span>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function WhatYouGet() {
  const items = [
    { icon: <Star className="h-5 w-5" />, label: "ATS Score" },
    { icon: <FileText className="h-5 w-5" />, label: "Resume Summary" },
    { icon: <Target className="h-5 w-5" />, label: "Missing Keywords" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Personalized Suggestions" },
  ];
  return (
    <div className="border-t border-border pt-8">
      <p className="text-center font-semibold text-foreground">What you'll get</p>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
              {it.icon}
            </span>
            <span className="text-sm text-muted-foreground">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignDecisions() {
  const decisions = [
    {
      icon: <Star className="h-5 w-5" />,
      title: "Why an ATS score?",
      body: "Most resumes are filtered by software before a human ever sees them. A single 0–100 score gives you an at-a-glance read on how well yours parses, grounded in a short rationale, not a black box.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Why the top suggestions, not a long list?",
      body: "A 20-item checklist is easy to nod at and hard to act on. We surface a handful of high-leverage changes first so you can actually make them tonight, depth is available, but focus comes first.",
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Why an optional job description?",
      body: "Pasting a role turns generic advice into role-specific keyword and framing feedback. Skipping it still gets you a solid general review, the tool meets you where you are.",
    },
    {
      icon: <Leaf className="h-5 w-5" />,
      title: "Why privacy-first, no account?",
      body: "Job searching is personal. Your PDF is used for this review and then discarded, no sign-up, no history, no dashboard to manage. Come back only when you have a new draft.",
    },
  ];
  return (
    <section className="mx-auto max-w-4xl px-6 pb-16">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary">
            <Compass className="h-5 w-5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How this tool is built</p>
        </div>
        <h2 className="mt-4 font-serif text-4xl text-primary">A few deliberate choices</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          This review is intentionally narrow. Every element on the results page earned its place. Here's the thinking
          behind the calls that shaped it.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {decisions.map((d) => (
            <div key={d.title} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary">
                  {d.icon}
                </span>
                <h3 className="font-semibold text-foreground">{d.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function UploadSection({
  onAnalyze,
  loading,
  error,
}: {
  onAnalyze: (file: File, jd: string) => void;
  loading: boolean;
  error: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (f: FileList | null) => {
    if (!f || !f[0]) return;
    const picked = f[0];
    if (picked.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    if (picked.size > 10 * 1024 * 1024) {
      alert("File is larger than 10 MB.");
      return;
    }
    setFile(picked);
  };

  return (
    <section className="mx-auto max-w-3xl px-6 pb-24">
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Start your review</p>
          <h2 className="mt-3 font-serif text-4xl text-primary">Upload your resume</h2>
          <p className="mt-3 text-muted-foreground">
            PDF format only. You can add a job description for more tailored feedback.
          </p>
        </div>

        <div className="mt-10">
          <WhatYouGet />
        </div>

        <div className="mt-10">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-accent/40 px-6 py-10 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background text-primary shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            {file ? (
              <p className="mt-4 font-serif text-xl text-primary">{file.name}</p>
            ) : (
              <p className="mt-4 text-muted-foreground">Drag & drop your PDF</p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">or</p>
            <label
              htmlFor="resume-upload"
              className="mt-2 inline-flex cursor-pointer rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Choose PDF
            </label>

            <input id="resume-upload" type="file" className="sr-only" onChange={(e) => handleFiles(e.target.files)} />
            <p className="mt-3 text-xs text-muted-foreground">One PDF, up to 10 MB</p>
          </div>

          {file && (
            <p className="mt-4 text-center text-sm text-primary">
              Your PDF is ready for review.{" "}
              <span className="text-muted-foreground">
                Takes about <b>30–60 seconds</b>
              </span>
            </p>
          )}
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="jd" className="font-semibold text-foreground">
              Job description <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <span className="text-sm text-muted-foreground">For role-specific insights</span>
          </div>
          <textarea
            id="jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste a job description here…"
            rows={6}
            className="w-full resize-y rounded-lg border border-border bg-background p-4 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mt-6 rounded-lg bg-accent p-4 text-sm text-foreground">
          <span className="font-semibold">Your resume stays private.</span>{" "}
          <span className="text-muted-foreground">
            We process it securely for this review and do not permanently store your PDF.
          </span>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={!file || loading}
          onClick={() => file && onAnalyze(file, jd)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Analyzing your resume…
            </>
          ) : (
            <>
              Analyze My Resume <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          You'll receive an ATS score, strengths, missing keywords, and clear recommendations.
        </p>
      </div>
    </section>
  );
}

function ScoreRing({ score }: { score: number }) {
  const size = 160;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "oklch(0.55 0.15 155)" : score >= 60 ? "oklch(0.6 0.13 90)" : "oklch(0.6 0.18 30)";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(0.9 0.02 130)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function Results({ data, onReset }: { data: ResumeAnalysis; onReset: () => void }) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your review</p>
          <h2 className="mt-2 font-serif text-4xl text-primary">Resume feedback</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" /> New review
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8">
          <div className="relative flex items-center justify-center">
            <ScoreRing score={data.ats_score} />
            <div className="absolute text-center">
              <div className="font-serif text-4xl font-bold text-primary">{data.ats_score}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">ATS Score</div>
            </div>
          </div>
          <p className="mt-4 max-w-[220px] text-center text-sm text-muted-foreground">{data.score_rationale}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="flex items-center gap-2 font-serif text-2xl text-primary">
            <FileText className="h-5 w-5" /> Resume summary
          </h3>
          <p className="mt-3 leading-relaxed text-foreground">{data.summary}</p>
          {data.strengths.length > 0 && (
            <>
              <h4 className="mt-6 font-semibold text-foreground">Strengths</h4>
              <ul className="mt-2 space-y-2">
                {data.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-8">
        <h3 className="flex items-center gap-2 font-serif text-2xl text-primary">
          <Target className="h-5 w-5" /> Missing keywords
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">Add these where they authentically match your experience.</p>
        {data.missing_keywords.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.missing_keywords.map((k) => (
              <span key={k} className="rounded-full border border-border bg-accent px-3 py-1 text-sm text-primary">
                {k}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No major gaps found, nice work.</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-8">
        <h3 className="flex items-center gap-2 font-serif text-2xl text-primary">
          <Sparkles className="h-5 w-5" /> Personalized suggestions
        </h3>
        <ol className="mt-4 space-y-4">
          {data.suggestions.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-foreground">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Index() {
  const analyze = useServerFn(analyzeResume);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  const handleAnalyze = async (file: File, jd: string) => {
    setLoading(true);
    setError(null);
    try {
      const pdfBase64 = await fileToBase64(file);
      const res = await analyze({
        data: { pdfBase64, fileName: file.name, jobDescription: jd || undefined },
      });
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {result ? (
        <Results data={result} onReset={() => setResult(null)} />
      ) : (
        <>
          <Hero />
          <UploadSection onAnalyze={handleAnalyze} loading={loading} error={error} />
          <DesignDecisions />
        </>
      )}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Built for your next opportunity.
      </footer>
    </div>
  );
}
