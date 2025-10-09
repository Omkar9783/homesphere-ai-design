import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Bot, ShoppingBag, Palette, Sparkles, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const recommendations = [
    { id: 1, title: "Modern Minimalist Living Room", style: "Minimalist", price: "$2,499" },
    { id: 2, title: "Cozy Scandinavian Bedroom", style: "Scandinavian", price: "$1,899" },
    { id: 3, title: "Industrial Loft Kitchen", style: "Industrial", price: "$3,299" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

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
          <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Your personalized design workspace</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50 hover:shadow-glow-primary transition-all cursor-pointer">
            <CardHeader>
              <Palette className="w-10 h-10 text-primary mb-2" />
              <CardTitle>3D Visualizer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Transform your space in real-time with AI</p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Open Visualizer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-glow-secondary transition-all cursor-pointer">
            <CardHeader>
              <Bot className="w-10 h-10 text-secondary mb-2" />
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Get personalized design recommendations</p>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Chat with AI
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-glow-primary transition-all cursor-pointer">
            <CardHeader>
              <ShoppingBag className="w-10 h-10 text-accent mb-2" />
              <CardTitle>Shop Designs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Browse curated room collections</p>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Browse Shop
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="bg-gradient-card border-border/50 mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <CardTitle>AI-Curated Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="group">
                  <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <div className="text-muted-foreground">Preview Image</div>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{rec.style}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-accent">{rec.price}</span>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Home className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Living Room Design {i}</h4>
                    <p className="text-sm text-muted-foreground">Last edited 2 days ago</p>
                  </div>
                  <Button variant="ghost" size="sm">Open</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
