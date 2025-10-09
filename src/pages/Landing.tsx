import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Home, Palette, Bot } from "lucide-react";
import heroImage from "@/assets/hero-interior.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-lg bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI HomeSphere
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-primary hover:bg-primary/90 shadow-glow-primary transition-all hover:shadow-glow-primary hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">AI-Powered Interior Design</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Space </span>
              with AI
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Experience the future of home décor. Visualize, design, and shop curated interiors 
              powered by cutting-edge artificial intelligence.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-glow-primary text-lg px-8 py-6">
                  Start Designing
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border hover:bg-card text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center border border-border/50">
                  <Palette className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold">3D Visualization</h3>
                <p className="text-sm text-muted-foreground">See your space transform in real-time</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center border border-border/50">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Personalized design recommendations</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center border border-border/50">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold">Curated Shop</h3>
                <p className="text-sm text-muted-foreground">Premium décor at your fingertips</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full"></div>
            <img 
              src={heroImage} 
              alt="Futuristic AI-powered interior design"
              className="relative rounded-2xl shadow-2xl border border-border/50"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { value: "50K+", label: "Designs Created" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "10K+", label: "Happy Customers" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-8 rounded-xl bg-gradient-card border border-border/50">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
