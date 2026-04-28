import { motion } from "framer-motion";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

const SectionHeader = ({ badge, title, subtitle }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mx-auto mb-12 max-w-2xl text-center"
  >
    {badge && (
      <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
        {badge}
      </span>
    )}
    <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
    {subtitle && <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>}
  </motion.div>
);

export default SectionHeader;
