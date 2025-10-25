import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LogOut, Home, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Design {
  id: string;
  title: string;
  description: string;
  style: string;
  room_type: string;
  image_url: string;
  price: number;
  ai_generated: boolean;
  created_at: string;
}

export default function DesignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDesign();
    }
  }, [id]);

  const fetchDesign = async () => {
    const { data, error } = await supabase
      .from('room_designs')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setDesign(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Design not found</h2>
          <Button onClick={() => navigate('/gallery')}>Back to Gallery</Button>
        </div>
      </div>
    );
  }

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {design.image_url && (
              <img 
                src={design.image_url} 
                alt={design.title}
                className="w-full rounded-lg shadow-lg"
              />
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-3xl">{design.title}</CardTitle>
                  {design.ai_generated && (
                    <Badge variant="secondary">AI Generated</Badge>
                  )}
                </div>
                <CardDescription className="text-lg">
                  {design.room_type} • {design.style}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{design.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Style</p>
                      <p className="font-medium">{design.style}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Room Type</p>
                      <p className="font-medium">{design.room_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {new Date(design.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium text-primary text-xl">₹{design.price?.toLocaleString('en-IN') || '0'}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Purchase Design
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
