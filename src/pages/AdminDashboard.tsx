import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Package, TrendingUp, Users, Bot, LogOut, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 7000 },
  ];

  const inventoryItems = [
    { id: 1, name: "Modern Sofa Set", stock: 45, category: "Furniture" },
    { id: 2, name: "LED Ambient Lights", stock: 120, category: "Lighting" },
    { id: 3, name: "Wall Art Collection", stock: 33, category: "Decor" },
  ];

  const aiTrends = [
    { trend: "Biophilic Design", growth: "+45%", color: "text-green-400" },
    { trend: "Smart Home Integration", growth: "+62%", color: "text-blue-400" },
    { trend: "Minimalist Luxury", growth: "+38%", color: "text-purple-400" },
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
            <span className="ml-4 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">Admin</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage inventory, analytics, and AI insights</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Total Customers", value: "12,543", change: "+12%" },
            { icon: Package, label: "Products", value: "856", change: "+8%" },
            { icon: TrendingUp, label: "Revenue", value: "$94.2K", change: "+24%" },
            { icon: BarChart3, label: "Orders", value: "3,247", change: "+18%" },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-gradient-card border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8 text-primary" />
                  <span className="text-sm text-green-400">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Trend Insights */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-secondary" />
                <CardTitle>AI Trend Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiTrends.map((trend, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{trend.trend}</h4>
                    <span className={`font-bold ${trend.color}`}>{trend.growth}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary" 
                      style={{ width: trend.growth }}
                    />
                  </div>
                </div>
              ))}
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Generate New Trends
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Management</CardTitle>
              <Button className="bg-primary hover:bg-primary/90">
                <Package className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Stock</div>
                      <div className="font-semibold">{item.stock} units</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
