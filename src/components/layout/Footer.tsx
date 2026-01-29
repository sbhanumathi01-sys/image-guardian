import { Shield, Github, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">ForgeGuard</p>
              <p className="text-xs text-muted-foreground">
                Image Forgery Detection using ELA & CNN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Research Paper
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>
            Built for academic research. Trained on CASIA & Columbia datasets.
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} ForgeGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
