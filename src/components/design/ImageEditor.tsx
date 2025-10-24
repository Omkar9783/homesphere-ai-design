import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette, Download, Undo } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImageEditorProps {
  originalImage: string;
  onClose: () => void;
}

export const ImageEditor = ({ originalImage, onClose }: ImageEditorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editedImage, setEditedImage] = useState(originalImage);
  const [editInstructions, setEditInstructions] = useState('');
  const [colorChange, setColorChange] = useState('');

  const applyEdits = async () => {
    if (!editInstructions && !colorChange) {
      toast({
        title: "No edits specified",
        description: "Please describe what you'd like to change",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let prompt = '';
      if (colorChange) {
        prompt = `Change the colors to ${colorChange}. `;
      }
      if (editInstructions) {
        prompt += editInstructions;
      }

      const { data, error } = await supabase.functions.invoke('generate-room-design', {
        body: {
          imageData: editedImage,
          editMode: true,
          editPrompt: prompt,
        }
      });

      if (error) throw error;

      if (data.image) {
        setEditedImage(data.image);
        toast({
          title: "Edits Applied!",
          description: "Your design has been customized.",
        });
        setEditInstructions('');
        setColorChange('');
      }
    } catch (error: any) {
      console.error('Error applying edits:', error);
      toast({
        title: "Error applying edits",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            <CardTitle>Customize Your Design</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Editor
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img src={editedImage} alt="Design being edited" className="w-full h-full object-cover" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="colorChange">Color Scheme</Label>
            <Input
              id="colorChange"
              placeholder="e.g., warm beige and brown tones"
              value={colorChange}
              onChange={(e) => setColorChange(e.target.value)}
            />
          </div>
          <div>
            <Label>Quick Actions</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditedImage(originalImage)}
              >
                <Undo className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = editedImage;
                  link.download = 'edited-design.png';
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="editInstructions">Custom Modifications</Label>
          <Textarea
            id="editInstructions"
            placeholder="Describe changes: e.g., make the sofa bigger, add more lighting, change curtain style..."
            value={editInstructions}
            onChange={(e) => setEditInstructions(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={applyEdits}
            disabled={loading || (!editInstructions && !colorChange)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying Changes...
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 mr-2" />
                Apply Customizations
              </>
            )}
          </Button>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> You can customize colors, furniture sizes, add or remove elements, 
            adjust lighting, and make any design modifications you want!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
