import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileSearch, Upload, BarChart3, Target, Zap, Shield, Users, CheckCircle,
  ArrowRight, Star, TrendingUp, Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import FeatureCard from "@/components/FeatureCard";
import SectionHeader from "@/components/SectionHeader";

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, hsl(217 91% 60% / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(230 91% 65% / 0.08) 0%, transparent 50%)"
      }} />
      <div className="container relative py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <Zap className="h-3 w-3" /> AI-Powered Platform
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl"
          >
            AI-Powered CV Analysis for{" "}
            <span className="text-primary">Smarter Hiring</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            Upload resumes, compare them with job requirements, and get fast, structured insights to make better hiring decisions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link to="/analyze">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity px-8">
                Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="px-8">See How It Works</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>

    {/* What it does */}
    <section className="container py-20">
      <SectionHeader
        badge="About the Platform"
        title="Understand your candidates better"
        subtitle="CVAnalyzer uses AI to extract, compare, and score resumes against job descriptions — giving recruiters clear, actionable insights in seconds."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <FeatureCard icon={<Upload className="h-5 w-5" />} title="Upload & Parse" description="Drag-and-drop your resumes and we'll extract structured data automatically." delay={0} />
        <FeatureCard icon={<Target className="h-5 w-5" />} title="Match & Score" description="Compare extracted data against job descriptions with weighted analysis criteria." delay={0.1} />
        <FeatureCard icon={<BarChart3 className="h-5 w-5" />} title="Review & Decide" description="Get detailed dashboards with scores, strengths, gaps, and hiring recommendations." delay={0.2} />
      </div>
    </section>

    {/* Benefits */}
    <section className="bg-card border-y border-border">
      <div className="container py-20">
        <SectionHeader badge="Benefits" title="Why teams choose CVAnalyzer" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Zap className="h-5 w-5" />, title: "10x Faster Screening", desc: "Analyze dozens of resumes in minutes, not hours." },
            { icon: <Shield className="h-5 w-5" />, title: "Bias-Free Insights", desc: "Objective scoring based on skills and experience." },
            { icon: <Brain className="h-5 w-5" />, title: "Smart Matching", desc: "AI understands context, not just keywords." },
            { icon: <TrendingUp className="h-5 w-5" />, title: "Better Hires", desc: "Data-driven decisions lead to stronger teams." },
          ].map((b, i) => (
            <FeatureCard key={b.title} icon={b.icon} title={b.title} description={b.desc} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="container py-20">
      <SectionHeader badge="Features" title="Everything you need for smart hiring" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: <FileSearch className="h-5 w-5" />, title: "Multi-Resume Upload", desc: "Upload and analyze multiple CVs in a single session." },
          { icon: <Target className="h-5 w-5" />, title: "Custom Criteria", desc: "Define your own skills, requirements, and weightings." },
          { icon: <BarChart3 className="h-5 w-5" />, title: "Visual Dashboard", desc: "Beautiful charts and scores at a glance." },
          { icon: <Users className="h-5 w-5" />, title: "Candidate Ranking", desc: "Automatically rank candidates by match score." },
          { icon: <CheckCircle className="h-5 w-5" />, title: "Gap Analysis", desc: "Identify missing skills and experience gaps." },
          { icon: <Star className="h-5 w-5" />, title: "Recommendations", desc: "Get clear hiring recommendations per candidate." },
        ].map((f, i) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.desc} delay={i * 0.08} />
        ))}
      </div>
    </section>

    {/* How it works mini */}
    <section className="bg-card border-y border-border">
      <div className="container py-20">
        <SectionHeader badge="Quick Overview" title="How it works" />
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { n: "1", title: "Upload CVs", desc: "Drop your resume files into the platform." },
              { n: "2", title: "Set Criteria", desc: "Add job description and required skills." },
              { n: "3", title: "Get Results", desc: "Review scores, insights, and recommendations." },
            ].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground text-lg font-bold shadow-glow">
                  {s.n}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="container py-20">
      <SectionHeader badge="Trusted by Teams" title="What our users say" />
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { name: "Sarah Chen", role: "Head of Talent, Nexora", quote: "CVAnalyzer cut our screening time by 80%. The match scoring is incredibly accurate." },
          { name: "Marcus Thompson", role: "HR Director, Voltaire Labs", quote: "Finally a tool that understands context — not just keyword matching. Game changer." },
          { name: "Elena Petrova", role: "Recruiter, Apex Dynamics", quote: "The dashboard makes it so easy to compare candidates and present findings to hiring managers." },
        ].map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="container pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mx-auto max-w-2xl rounded-2xl gradient-primary p-10 text-center text-primary-foreground shadow-glow"
      >
        <h2 className="text-2xl font-bold md:text-3xl">Ready to hire smarter?</h2>
        <p className="mt-2 opacity-90">Start analyzing resumes in minutes. No setup required.</p>
        <Link to="/analyze">
          <Button size="lg" variant="secondary" className="mt-6 px-8 font-semibold">
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </section>
  </Layout>
);

export default Index;
