import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Upload, FileText, X, Plus, Sparkles, Lightbulb, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import { useNavigate } from "react-router-dom";
import { analyzeCvFiles } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AnalyzePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [jobDesc, setJobDesc] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addFiles = (incomingFiles: FileList | File[]) => {
    const nextFiles = Array.from(incomingFiles).filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension && ["pdf", "docx", "txt"].includes(extension);
    });

    if (nextFiles.length === 0) {
      toast({
        title: "Unsupported files",
        description: "Please upload PDF, DOCX, or TXT resumes.",
        variant: "destructive",
      });
      return;
    }

    setFiles((currentFiles) => {
      const mergedFiles = [...currentFiles];
      nextFiles.forEach((file) => {
        const alreadyExists = mergedFiles.some(
          (existingFile) =>
            existingFile.name === file.name &&
            existingFile.size === file.size &&
            existingFile.lastModified === file.lastModified,
        );

        if (!alreadyExists) {
          mergedFiles.push(file);
        }
      });
      return mergedFiles;
    });
  };

  const removeFile = (name: string) => setFiles(files.filter((file) => file.name !== name));

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      addFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const addSkill = () => {
    const normalizedSkill = skillInput.trim();
    if (normalizedSkill && !skills.some((skill) => skill.toLowerCase() === normalizedSkill.toLowerCase())) {
      setSkills([...skills, normalizedSkill]);
      setSkillInput("");
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "No resumes uploaded",
        description: "Upload at least one CV before running analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDesc.trim()) {
      toast({
        title: "Job description required",
        description: "Paste the vacancy details so the backend can compare candidates properly.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const analysis = await analyzeCvFiles({
        jobDescription: jobDesc,
        preferredSkills: skills,
        files,
      });

      navigate(`/results?analysisId=${analysis.analysis_id}`, {
        state: { analysis },
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Something went wrong while analyzing the resumes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <SectionHeader
          badge="Resume Analysis"
          title="Upload & Analyze CVs"
          subtitle="Upload one or more resumes, define the job requirements, and let our AI do the heavy lifting."
        />

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="mb-3 text-sm font-semibold">Upload Resumes</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
                  dragActive ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">Drag & drop your resumes here</p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse files (PDF, DOCX, TXT)</p>
              </div>
            </motion.div>

            {files.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="mb-3 text-sm font-semibold">Uploaded Files ({files.length})</h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-card">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="h-5 w-5 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      <button onClick={() => removeFile(file.name)} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="mb-3 text-sm font-semibold">Job Description</h3>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDesc}
                onChange={(event) => setJobDesc(event.target.value)}
                className="min-h-[160px] resize-none bg-card"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="mb-3 text-sm font-semibold">Preferred Skills (optional)</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. React, Python, Leadership"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addSkill())}
                  className="bg-card"
                />
                <Button variant="outline" onClick={addSkill} className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      {skill}
                      <button onClick={() => setSkills(skills.filter((existingSkill) => existingSkill !== skill))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <h3 className="mb-3 font-semibold">Analysis Summary</h3>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-muted-foreground">Resumes</p>
                  <p className="text-lg font-bold">{files.length}</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-muted-foreground">Job Description</p>
                  <p className="text-lg font-bold">{jobDesc.length > 0 ? "Provided" : "Missing"}</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-muted-foreground">Custom Skills</p>
                  <p className="text-lg font-bold">{skills.length}</p>
                </div>
              </div>
              <Button
                size="lg"
                className="mt-5 w-full gradient-primary text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
                onClick={handleAnalyze}
                disabled={files.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Resumes...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Analyze Resumes
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                <h3 className="font-semibold text-foreground">Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Upload multiple CVs to compare candidates side by side.</li>
                <li className="flex gap-2"><span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Include the full job description for best accuracy.</li>
                <li className="flex gap-2"><span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Add preferred skills to weight your analysis criteria.</li>
                <li className="flex gap-2"><span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Supported formats: PDF, DOCX, and TXT.</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzePage;
