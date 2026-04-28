import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Briefcase, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import FeatureCard from "@/components/FeatureCard";

const AboutPage = () => (
  <Layout>
    <div className="container py-12 md:py-16">
      <SectionHeader
        badge="About Us"
        title="Built for Modern Recruiting"
        subtitle="CVAnalyzer was created to help hiring teams make faster, smarter, and more objective decisions — powered by AI."
      />

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mx-auto mb-16 max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-elevated"
      >
        <Heart className="mx-auto mb-4 h-8 w-8 text-primary" />
        <h3 className="text-xl font-bold">Our Mission</h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          To eliminate guesswork from the hiring process. We believe every candidate deserves a fair, thorough evaluation — and every recruiter deserves tools that save time without sacrificing quality.
        </p>
      </motion.div>

      {/* Who it helps */}
      <SectionHeader title="Who is CVAnalyzer for?" />
      <div className="mx-auto mb-16 grid max-w-4xl gap-6 md:grid-cols-3">
        <FeatureCard icon={<Users className="h-5 w-5" />} title="Recruiters" description="Screen candidates faster and present data-driven shortlists to hiring managers." delay={0} />
        <FeatureCard icon={<Briefcase className="h-5 w-5" />} title="Hiring Managers" description="Get clear insights into each candidate's fit without reading every resume." delay={0.1} />
        <FeatureCard icon={<Target className="h-5 w-5" />} title="HR Teams" description="Standardize your evaluation process and reduce unconscious bias in screening." delay={0.2} />
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mx-auto max-w-2xl rounded-2xl gradient-primary p-10 text-center text-primary-foreground shadow-glow"
      >
        <h2 className="text-2xl font-bold">Start making better hiring decisions</h2>
        <p className="mt-2 opacity-90">Try CVAnalyzer today — no setup, no credit card.</p>
        <Link to="/analyze">
          <Button size="lg" variant="secondary" className="mt-6 px-8 font-semibold">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </Layout>
);

export default AboutPage;
