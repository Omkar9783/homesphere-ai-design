import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, User, Download, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Design {
  id: string;
  title: string;
  description: string;
  style: string;
  room_type: string;
  image_url: string;
  price: number;
  ai_generated?: boolean;
}

export default function Gallery() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured' | 'ai'>('all');
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDesigns();
  }, [filter]);

  const fetchDesigns = async () => {
    let query = supabase
      .from('room_designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'featured') {
      query = query.eq('is_featured', true);
    } else if (filter === 'ai') {
      query = query.eq('ai_generated', true);
    }

    const { data, error } = await query;

    if (data) {
      setDesigns(data);
    }
    setLoading(false);
  };

  const handleDownload = (imageUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
    toast({
      title: "Downloading design",
      description: "Your image is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <nav className="border-b bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Home Decor Management
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Design Gallery</h2>
          <p className="text-muted-foreground">Explore our interior design collection</p>
          
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Designs
            </Button>
            <Button
              variant={filter === 'featured' ? 'default' : 'outline'}
              onClick={() => setFilter('featured')}
            >
              Featured
            </Button>
            <Button
              variant={filter === 'ai' ? 'default' : 'outline'}
              onClick={() => setFilter('ai')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generated
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading designs...</div>
        ) : designs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No designs found. Try generating some AI designs!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Card 
                key={design.id} 
                className="hover:shadow-lg transition-shadow"
              >
                {design.image_url && (
                  <div className="relative">
                    <img 
                      src={design.image_url} 
                      alt={design.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {design.ai_generated && (
                      <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Generated
                      </div>
                    )}
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{design.title}</CardTitle>
                  <CardDescription>{design.room_type} • {design.style}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{design.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">${design.price}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(design.image_url, design.title);
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/design/${design.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
