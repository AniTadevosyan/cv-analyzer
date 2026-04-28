import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StepCardProps {
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
  isLast?: boolean;
}

const StepCard = ({ step, icon, title, description, delay = 0, isLast = false }: StepCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="relative flex gap-6"
  >
    {/* Timeline line */}
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground font-bold text-lg shadow-glow">
        {step}
      </div>
      {!isLast && <div className="mt-2 w-px flex-1 bg-border" />}
    </div>
    <div className="pb-12">
      <div className="mb-2 flex items-center gap-2 text-primary">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

export default StepCard;
