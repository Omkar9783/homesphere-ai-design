import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Bot, ShoppingBag, Palette, Sparkles, LogOut, Edit, Trash2, Plus, User, Eye, Camera } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DesignEditor } from '@/components/design/DesignEditor';
import { AIRecommendations } from '@/components/design/AIRecommendations';
import { RoomPhotoUpload } from '@/components/design/RoomPhotoUpload';
import { FurnitureShowcase } from '@/components/design/FurnitureShowcase';
import { useNavigate } from 'react-router-dom';

interface Design {
  id: string;
  title: string;
  description: string;
  style: string;
  price: number;
  room_type: string;
  image_url?: string;
  created_at: string;
}

const CustomerDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [myDesigns, setMyDesigns] = useState<Design[]>([]);
  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRoomUpload, setShowRoomUpload] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | undefined>();

  useEffect(() => {
    fetchMyDesigns();
    fetchFeaturedDesigns();
  }, []);

  const fetchMyDesigns = async () => {
    const { data } = await supabase
      .from('room_designs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setMyDesigns(data);
  };

  const fetchFeaturedDesigns = async () => {
    const { data } = await supabase
      .from('room_designs')
      .select('*')
      .eq('is_featured', true)
      .limit(3);
    
    if (data) setFeaturedDesigns(data);
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
      fetchMyDesigns();
    }
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingDesign(undefined);
    fetchMyDesigns();
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
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/gallery')}>
              <Eye className="w-4 h-4 mr-2" />
              Gallery
            </Button>
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" onClick={signOut} className="hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Your Design Studio</h1>
          <p className="text-muted-foreground">Create, edit, and explore AI-powered room designs</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card 
            className="bg-gradient-card border-border/50 hover:shadow-glow-primary transition-all cursor-pointer"
            onClick={() => setShowRoomUpload(true)}
          >
            <CardHeader>
              <Camera className="w-10 h-10 text-primary mb-2" />
              <CardTitle>AI Room Designer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Upload room photo for AI design</p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Upload & Design
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-card border-border/50 hover:shadow-glow-primary transition-all cursor-pointer"
            onClick={() => setShowAIDialog(true)}
          >
            <CardHeader>
              <Bot className="w-10 h-10 text-primary mb-2" />
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Get personalized AI advice</p>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Get Recommendations
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-card border-border/50 hover:shadow-glow-secondary transition-all cursor-pointer"
            onClick={() => setShowEditor(true)}
          >
            <CardHeader>
              <Plus className="w-10 h-10 text-secondary mb-2" />
              <CardTitle>Create New Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Design your dream room</p>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Start Designing
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-glow-primary transition-all">
            <CardHeader>
              <ShoppingBag className="w-10 h-10 text-accent mb-2" />
              <CardTitle>Browse Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Explore curated designs</p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => navigate('/gallery')}
              >
                Explore Gallery
              </Button>
            </CardContent>
          </Card>
        </div>

        <FurnitureShowcase />

        {featuredDesigns.length > 0 && (
          <Card className="bg-gradient-card border-border/50 mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <CardTitle>Featured Designs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredDesigns.map((design) => (
                  <div key={design.id} className="group">
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {design.image_url ? (
                        <img src={design.image_url} alt={design.title} className="w-full h-full object-cover" />
                      ) : (
                        <Palette className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{design.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{design.style} • {design.room_type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-accent">${design.price}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/design/${design.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Designs</CardTitle>
            <Button onClick={() => setShowEditor(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Design
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myDesigns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No designs yet. Create your first design!
                </p>
              ) : (
                myDesigns.map((design) => (
                  <div key={design.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {design.image_url ? (
                        <img src={design.image_url} alt={design.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Home className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{design.title}</h4>
                      <p className="text-sm text-muted-foreground">{design.style} • {design.room_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">${design.price}</p>
                    </div>
                    <div className="flex gap-2">
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
                        onClick={() => handleDelete(design.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
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

      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Design Recommendations</DialogTitle>
          </DialogHeader>
          <AIRecommendations />
        </DialogContent>
      </Dialog>

      <Dialog open={showRoomUpload} onOpenChange={setShowRoomUpload}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Room Design Generator</DialogTitle>
          </DialogHeader>
          <RoomPhotoUpload />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDashboard;
