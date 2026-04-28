import { motion } from "framer-motion";

interface ScoreCardProps {
  label: string;
  score: number;
  color?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-destructive";
};

const ScoreCard = ({ label, score }: ScoreCardProps) => (
  <div className="rounded-xl border border-border bg-card p-5 shadow-card">
    <p className="mb-2 text-sm text-muted-foreground">{label}</p>
    <div className="flex items-end gap-1">
      <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
      <span className="mb-1 text-sm text-muted-foreground">/100</span>
    </div>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full gradient-primary"
      />
    </div>
  </div>
);

export default ScoreCard;
