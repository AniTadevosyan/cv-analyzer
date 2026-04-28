import {
  Upload, FileText, ScanSearch, GitCompare, Calculator, Sparkles,
} from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import StepCard from "@/components/StepCard";

const steps = [
  { icon: <Upload className="h-5 w-5" />, title: "Upload Resume", description: "Drag and drop your CV files (PDF or DOCX) into the upload area. You can upload multiple resumes at once for batch analysis." },
  { icon: <FileText className="h-5 w-5" />, title: "Add Job Description", description: "Paste the full job description so the AI knows exactly what to compare against. Include requirements, responsibilities, and preferred qualifications." },
  { icon: <ScanSearch className="h-5 w-5" />, title: "Extract CV Content", description: "Our parser extracts structured data from each resume — skills, experience, education, certifications, and more — ready for analysis." },
  { icon: <GitCompare className="h-5 w-5" />, title: "Compare Skills & Experience", description: "Each extracted element is compared with the job requirements using semantic matching, not just keyword overlap." },
  { icon: <Calculator className="h-5 w-5" />, title: "Calculate Matching Score", description: "Scores are computed for each parameter, then combined into a weighted overall match score per candidate." },
  { icon: <Sparkles className="h-5 w-5" />, title: "Generate Insights & Recommendation", description: "Finally, you receive a dashboard with scores, strengths, gaps, and a clear hiring recommendation for each candidate." },
];

const HowItWorksPage = () => (
  <Layout>
    <div className="container py-12 md:py-16">
      <SectionHeader
        badge="Step by Step"
        title="How CVAnalyzer Works"
        subtitle="From upload to recommendation in six simple steps. Here's the full process."
      />
      <div className="mx-auto max-w-2xl">
        {steps.map((s, i) => (
          <StepCard key={s.title} step={i + 1} {...s} delay={i * 0.12} isLast={i === steps.length - 1} />
        ))}
      </div>
    </div>
  </Layout>
);

export default HowItWorksPage;
