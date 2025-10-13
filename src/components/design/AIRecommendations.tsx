import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const AIRecommendations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [formData, setFormData] = useState({
    roomType: 'Living Room',
    style: 'Modern',
    budget: '',
    preferences: '',
  });

  const getAIRecommendation = async () => {
    if (!formData.budget) {
      toast({
        title: "Please enter a budget",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setRecommendation('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-design-recommendations', {
        body: formData
      });

      if (error) throw error;

      setRecommendation(data.recommendation);
      toast({
        title: "AI Recommendation Generated!",
        description: "Check out your personalized design plan below.",
      });
    } catch (error: any) {
      toast({
        title: "Error getting recommendation",
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
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle>AI Design Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label htmlFor="style">Style Preference</Label>
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
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g., 5000"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="preferences">Additional Preferences (optional)</Label>
            <Textarea
              id="preferences"
              placeholder="Any specific requirements or preferences..."
              value={formData.preferences}
              onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
              rows={3}
            />
          </div>

          <Button
            onClick={getAIRecommendation}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Recommendation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendation && (
        <Card className="bg-gradient-card border-primary/50">
          <CardHeader>
            <CardTitle className="text-primary">Your Personalized Design Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {recommendation}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};