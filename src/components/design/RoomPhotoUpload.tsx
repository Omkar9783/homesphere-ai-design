import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Image as ImageIcon, Wand2, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ImageEditor } from './ImageEditor';

export const RoomPhotoUpload = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    style: 'Modern',
    roomType: 'Living Room',
    description: '',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedImage(null);
    }
  };

  const generateDesign = async () => {
    if (!imageFile) {
      toast({
        title: "No image selected",
        description: "Please upload a room photo first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const { data, error } = await supabase.functions.invoke('generate-room-design', {
          body: {
            imageData: base64Image,
            style: formData.style,
            roomType: formData.roomType,
            description: formData.description,
          }
        });

        if (error) throw error;

        if (data.image) {
          setGeneratedImage(data.image);
          
          // Calculate price in Indian Rupees based on style and room type
          const calculatePrice = () => {
            const styleMultipliers: Record<string, number> = {
              'Modern': 1.2,
              'Minimalist': 1.0,
              'Traditional': 1.1,
              'Industrial': 1.3,
              'Scandinavian': 1.2,
              'Contemporary': 1.4,
            };
            
            const roomBasePrices: Record<string, number> = {
              'Living Room': 35000,
              'Bedroom': 28000,
              'Kitchen': 45000,
              'Bathroom': 25000,
              'Dining Room': 32000,
              'Office': 30000
            };
            
            const styleMultiplier = styleMultipliers[formData.style] || 1.0;
            const basePrice = roomBasePrices[formData.roomType] || 30000;
            
            return Math.round(basePrice * styleMultiplier);
          };

          // Save to database
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error: saveError } = await supabase
              .from('room_designs')
              .insert({
                user_id: user.id,
                title: `AI ${formData.style} ${formData.roomType}`,
                description: formData.description || `AI-generated ${formData.style} style ${formData.roomType} design`,
                style: formData.style,
                room_type: formData.roomType,
                image_url: data.image,
                ai_generated: true,
                price: calculatePrice()
              });

            if (saveError) {
              console.error('Error saving design:', saveError);
            }
          }

          toast({
            title: "Design Generated & Saved!",
            description: "Your AI-designed room is ready and saved to gallery.",
          });
        }
      };
    } catch (error: any) {
      console.error('Error generating design:', error);
      toast({
        title: "Error generating design",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            <CardTitle>AI Room Design Generator</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Upload your empty room photo and let AI design it for you</p>
          <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border/50">
            <p className="text-xs font-medium text-muted-foreground">
              <span className="font-semibold text-foreground">Powered by:</span> Google Gemini 2.5 Flash Image Preview
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Advanced AI model specialized in image generation and room design visualization
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Upload Room Photo</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>

          {imagePreview && (
            <div className="space-y-2">
              <Label>Your Room Photo</Label>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Room preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomType">Room Type</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => setFormData({ ...formData, roomType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Living Room">Living Room</SelectItem>
                  <SelectItem value="Bedroom">Bedroom</SelectItem>
                  <SelectItem value="Kitchen">Kitchen</SelectItem>
                  <SelectItem value="Bathroom">Bathroom</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Dining Room">Dining Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="style">Design Style</Label>
              <Select
                value={formData.style}
                onValueChange={(value) => setFormData({ ...formData, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modern">Modern</SelectItem>
                  <SelectItem value="Minimalist">Minimalist</SelectItem>
                  <SelectItem value="Scandinavian">Scandinavian</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Contemporary">Contemporary</SelectItem>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Design Preferences (optional)</Label>
            <Textarea
              id="description"
              placeholder="e.g., Add plants, warm colors, cozy atmosphere..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <Button
            onClick={generateDesign}
            disabled={loading || !imageFile}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Design...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate AI Design
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedImage && !showEditor && (
        <Card className="bg-gradient-card border-primary/50">
          <CardHeader>
            <CardTitle className="text-primary">Your AI-Generated Design</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img src={generatedImage} alt="AI generated room design" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => setShowEditor(true)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Palette className="w-4 h-4 mr-2" />
                Customize Design
              </Button>
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = 'ai-room-design.png';
                  link.click();
                }}
                variant="outline"
                className="flex-1"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedImage(null);
                  setImagePreview(null);
                  setImageFile(null);
                }}
              >
                New Design
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedImage && showEditor && (
        <ImageEditor
          originalImage={generatedImage}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};
