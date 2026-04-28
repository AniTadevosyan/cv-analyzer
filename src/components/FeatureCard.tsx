import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
  >
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">
      {icon}
    </div>
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
  </motion.div>
);

export default FeatureCard;
