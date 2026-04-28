import { User, Star, AlertTriangle, FileText } from "lucide-react";
import { motion } from "framer-motion";

type Recommendation = "Strong Match" | "Good Match" | "Moderate Match" | "Low Match";

interface CandidateCardProps {
  name: string;
  score: number;
  strengths: string[];
  missing: string[];
  recommendation: Recommendation;
  filename?: string;
  preview?: string;
  delay?: number;
}

const recStyles: Record<Recommendation, string> = {
  "Strong Match": "bg-success/10 text-success border-success/20",
  "Good Match": "bg-primary/10 text-primary border-primary/20",
  "Moderate Match": "bg-warning/10 text-warning border-warning/20",
  "Low Match": "bg-destructive/10 text-destructive border-destructive/20",
};

const CandidateCard = ({ name, score, strengths, missing, recommendation, filename, preview, delay = 0 }: CandidateCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
  >
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{name}</h3>
          {filename && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span className="truncate">{filename}</span>
            </div>
          )}
          <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${recStyles[recommendation]}`}>
            {recommendation}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-2xl font-bold text-primary">{score}</div>
        <div className="text-xs text-muted-foreground">/ 100</div>
      </div>
    </div>

    <div className="mb-3 h-2 overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        className="h-full rounded-full gradient-primary"
      />
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-success">
          <Star className="h-3 w-3" /> Strengths
        </div>
        <div className="flex flex-wrap gap-1">
          {strengths.map((strength) => (
            <span key={strength} className="rounded-md bg-success/10 px-2 py-0.5 text-xs text-success">{strength}</span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-destructive">
          <AlertTriangle className="h-3 w-3" /> Missing
        </div>
        <div className="flex flex-wrap gap-1">
          {missing.map((item) => (
            <span key={item} className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs text-destructive">{item}</span>
          ))}
        </div>
      </div>
    </div>

    {preview && (
      <div className="mt-4 rounded-lg bg-secondary/60 p-3 text-sm text-muted-foreground">
        <p className="line-clamp-4">{preview}</p>
      </div>
    )}
  </motion.div>
);

export default CandidateCard;
