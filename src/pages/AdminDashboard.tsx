import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Package, TrendingUp, Users, Bot, LogOut, BarChart3, Edit, Trash2, Plus } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DesignEditor } from '@/components/design/DesignEditor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Design {
  id: string;
  title: string;
  description: string;
  style: string;
  price: number;
  room_type: string;
  is_featured: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [allDesigns, setAllDesigns] = useState<Design[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | undefined>();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchAllDesigns();
    fetchStats();
  }, []);

  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 7000 },
  ];

  const fetchAllDesigns = async () => {
    const { data } = await supabase
      .from('room_designs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAllDesigns(data);
  };

  const fetchStats = async () => {
    const { data: designs } = await supabase
      .from('room_designs')
      .select('price');
    
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id');
    
    setStats({
      totalCustomers: profiles?.length || 0,
      totalProducts: designs?.length || 0,
      totalRevenue: designs?.reduce((sum, d) => sum + (d.price || 0), 0) || 0,
      totalOrders: designs?.length || 0,
    });
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('room_designs')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating design",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Design updated successfully" });
      fetchAllDesigns();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('room_designs')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting design",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Design deleted successfully" });
      fetchAllDesigns();
      fetchStats();
    }
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingDesign(undefined);
    fetchAllDesigns();
    fetchStats();
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
          <Button variant="ghost" onClick={signOut} className="hover:text-destructive">
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

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Total Customers", value: stats.totalCustomers.toString() },
            { icon: Package, label: "Products", value: stats.totalProducts.toString() },
            { icon: TrendingUp, label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
            { icon: BarChart3, label: "Designs", value: stats.totalOrders.toString() },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-gradient-card border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8 text-primary" />
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

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Recent Designs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allDesigns.slice(0, 5).map((design) => (
                  <div key={design.id} className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{design.title}</h4>
                        <p className="text-sm text-muted-foreground">{design.style} • {design.room_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">${design.price}</span>
                        {design.is_featured && (
                          <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Design Management</CardTitle>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowEditor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Design
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allDesigns.map((design) => (
                <div key={design.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex-1">
                    <h4 className="font-semibold">{design.title}</h4>
                    <p className="text-sm text-muted-foreground">{design.style} • {design.room_type}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-semibold text-primary">${design.price}</div>
                      {design.is_featured && (
                        <div className="text-xs text-accent">Featured</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleFeatured(design.id, design.is_featured)}
                      >
                        {design.is_featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditingDesign(design);
                          setShowEditor(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleDelete(design.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEditor} onOpenChange={(open) => {
        setShowEditor(open);
        if (!open) setEditingDesign(undefined);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDesign ? 'Edit Design' : 'Create New Design'}</DialogTitle>
          </DialogHeader>
          <DesignEditor
            design={editingDesign}
            onSave={handleSave}
            onCancel={() => {
              setShowEditor(false);
              setEditingDesign(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
