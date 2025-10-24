import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Design {
  id: string;
  title: string;
  description: string;
  style: string;
  room_type: string;
  image_url: string;
  price: number;
}

export default function Gallery() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    const { data, error } = await supabase
      .from('room_designs')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (data) {
      setDesigns(data);
    }
    setLoading(false);
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
          <p className="text-muted-foreground">Explore our featured AI-generated interior designs</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading designs...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Card 
                key={design.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/design/${design.id}`)}
              >
                {design.image_url && (
                  <img 
                    src={design.image_url} 
                    alt={design.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <CardHeader>
                  <CardTitle>{design.title}</CardTitle>
                  <CardDescription>{design.room_type} • {design.style}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{design.description}</p>
                  <p className="text-lg font-bold text-primary">${design.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
