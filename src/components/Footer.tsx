import { Link } from "react-router-dom";
import { FileSearch } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
              <FileSearch className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            CVAnalyzer
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered resume analysis for smarter, faster hiring decisions.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/analyze" className="hover:text-foreground transition-colors">Analyze</Link>
            <Link to="/parameters" className="hover:text-foreground transition-colors">Parameters</Link>
            <Link to="/results" className="hover:text-foreground transition-colors">Results</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Learn</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="cursor-default">Privacy Policy</span>
            <span className="cursor-default">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CVAnalyzer. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
