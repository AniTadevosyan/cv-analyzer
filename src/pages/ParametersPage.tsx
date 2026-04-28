import {
  Code, Briefcase, GraduationCap, Search, FileText, Award, Heart, Calculator,
} from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import ParameterCard from "@/components/ParameterCard";

const parameters = [
  { icon: <Code className="h-5 w-5" />, title: "Skills Match", description: "Measures how well the candidate's listed skills match the required skills in the job description.", weight: 25, tag: "Core" },
  { icon: <Briefcase className="h-5 w-5" />, title: "Work Experience Relevance", description: "Evaluates whether the candidate's experience aligns with the target role and industry.", weight: 20, tag: "Core" },
  { icon: <GraduationCap className="h-5 w-5" />, title: "Education Match", description: "Checks whether the education background fits the job expectations and requirements.", weight: 15, tag: "Standard" },
  { icon: <Search className="h-5 w-5" />, title: "Keyword Match", description: "Identifies whether important role-specific terms and technologies appear in the CV.", weight: 12, tag: "Standard" },
  { icon: <FileText className="h-5 w-5" />, title: "Job Description Similarity", description: "Compares the overall content and tone of the CV with the job description.", weight: 10, tag: "AI" },
  { icon: <Award className="h-5 w-5" />, title: "Certifications", description: "Detects relevant certifications that strengthen the candidate's profile.", weight: 8, tag: "Bonus" },
  { icon: <Heart className="h-5 w-5" />, title: "Soft Skills", description: "Highlights communication, leadership, teamwork, and similar qualities when found.", weight: 5, tag: "Bonus" },
  { icon: <Calculator className="h-5 w-5" />, title: "Overall Score Weighting", description: "Combines all criteria into the final candidate score using weighted averages.", weight: 100, tag: "Final" },
];

const ParametersPage = () => (
  <Layout>
    <div className="container py-12 md:py-16">
      <SectionHeader
        badge="Analysis Criteria"
        title="How We Score Your Candidates"
        subtitle="Each resume is analyzed across multiple dimensions. Here's what our AI evaluates and how each parameter is weighted."
      />
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {parameters.map((p, i) => (
          <ParameterCard key={p.title} {...p} delay={i * 0.08} />
        ))}
      </div>
    </div>
  </Layout>
);

export default ParametersPage;
