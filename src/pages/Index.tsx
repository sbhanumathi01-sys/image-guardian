import { Link } from "react-router-dom";
import { 
  Shield, 
  Search, 
  BarChart3, 
  Zap, 
  Brain, 
  Image as ImageIcon,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const features = [
  {
    icon: ImageIcon,
    title: "Error Level Analysis",
    description: "Detect compression inconsistencies that reveal image manipulation through advanced ELA algorithms.",
  },
  {
    icon: Brain,
    title: "CNN Deep Learning",
    description: "Trained on CASIA and Columbia datasets with 96%+ accuracy for reliable forgery detection.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Get instant results with our optimized inference pipeline and visual heatmap overlays.",
  },
];

const stats = [
  { value: "96.4%", label: "Model Accuracy" },
  { value: "1.2s", label: "Avg. Processing" },
  { value: "50K+", label: "Images Analyzed" },
  { value: "CASIA v2", label: "Dataset" },
];

const workflowSteps = [
  "Upload your image (JPG or PNG)",
  "System generates ELA representation",
  "CNN model analyzes for tampering",
  "View results with confidence score",
  "Examine heatmap for forged regions",
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Shield className="h-4 w-4" />
              Academic Research Project
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Image Forgery Detection using{" "}
              <span className="gradient-text">ELA & Deep Learning</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Detect manipulated images with Error Level Analysis and Convolutional Neural Networks. 
              Built for academic evaluation and real-world forensic applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/detect">
                  <Search className="mr-2 h-5 w-5" />
                  Start Detection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/dashboard">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Model Metrics
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Core Technology</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Combining classical image forensics with modern deep learning for accurate forgery detection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group glass-card rounded-2xl p-8 hover:border-accent/50 transition-all duration-300"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-3 text-muted-foreground">
                Our system uses a multi-stage pipeline to detect image manipulation with high accuracy.
              </p>

              <div className="mt-8 space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <Button asChild className="mt-8">
                <Link to="/detect">
                  Try It Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-2">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                    <ChevronRight className="h-12 w-12 text-accent" />
                    <Brain className="h-12 w-12 text-muted-foreground/50" />
                    <ChevronRight className="h-12 w-12 text-accent" />
                    <CheckCircle className="h-12 w-12 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload → ELA → CNN → Result
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl bg-primary p-12 text-primary-foreground text-center">
            <h2 className="text-3xl font-bold">Ready to Detect Forgeries?</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
              Upload your image and let our CNN model analyze it for signs of tampering.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8"
            >
              <Link to="/detect">
                <Search className="mr-2 h-5 w-5" />
                Start Detection
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
