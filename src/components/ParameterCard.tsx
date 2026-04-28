import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ParameterCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  weight: number;
  tag: string;
  delay?: number;
}

const ParameterCard = ({ icon, title, description, weight, tag, delay = 0 }: ParameterCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
  >
    <div className="mb-4 flex items-start justify-between">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
        {icon}
      </div>
      <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
        {tag}
      </span>
    </div>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Weight</span>
        <span className="font-semibold text-foreground">{weight}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${weight}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full gradient-primary"
        />
      </div>
    </div>
  </motion.div>
);

export default ParameterCard;
