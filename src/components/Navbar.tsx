import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/parameters", label: "Parameters" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/results", label: "Results" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <FileSearch className="h-4 w-4 text-primary-foreground" />
          </div>
          CVAnalyzer
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex">
          <Link to="/analyze">
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
              Start Analyzing
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-card md:hidden"
          >
            <div className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/analyze" onClick={() => setOpen(false)} className="mt-2">
                <Button className="w-full gradient-primary text-primary-foreground">Start Analyzing</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
