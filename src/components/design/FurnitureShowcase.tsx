import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sofa, Home, Bed, ShoppingCart } from 'lucide-react';
import sofaImage from '@/assets/sofa-modern.jpg';
import bedroomImage from '@/assets/bedroom-set.jpg';
import livingRoomImage from '@/assets/living-room-items.jpg';

export const FurnitureShowcase = () => {
  const furnitureItems = [
    {
      id: 1,
      name: 'Modern Gray Sofa',
      category: 'Living Room',
      price: 129900,
      image: sofaImage,
      icon: Sofa,
      description: 'Contemporary 3-seater sofa with wooden legs'
    },
    {
      id: 2,
      name: 'Elegant Bedroom Set',
      category: 'Bedroom',
      price: 249900,
      image: bedroomImage,
      icon: Bed,
      description: 'King size bed with nightstands and elegant decor'
    },
    {
      id: 3,
      name: 'Living Room Collection',
      category: 'Living Room',
      price: 329900,
      image: livingRoomImage,
      icon: Home,
      description: 'Complete living room furniture set with coffee table'
    },
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-accent" />
          <CardTitle>Featured Furniture</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Premium furniture pieces for your designed spaces</p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {furnitureItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="group">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">₹{item.price.toLocaleString('en-IN')}</span>
                  <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
