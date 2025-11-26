import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const DesignRequestSchema = z.object({
  imageData: z.string().regex(/^data:image/, 'Invalid image data format'),
  style: z.enum(['Modern', 'Minimalist', 'Traditional', 'Industrial', 'Scandinavian', 'Contemporary', 'Bohemian', 'Rustic']).optional(),
  roomType: z.enum(['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Office', 'Study', 'Home Office']).optional(),
  description: z.string().max(500).optional(),
  editMode: z.boolean().optional(),
  editPrompt: z.string().max(300).optional()
}).refine((data) => {
  // If not in edit mode, style and roomType are required
  if (!data.editMode) {
    return data.style && data.roomType;
  }
  return true;
}, {
  message: "style and roomType are required when not in edit mode"
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Unauthorized request - missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const requestBody = await req.json();
    
    // Validate input
    const validationResult = DesignRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { imageData, style, roomType, description, editMode, editPrompt } = validationResult.data;
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Construct the prompt for room design
    let designPrompt: string;
    if (editMode && editPrompt) {
      designPrompt = `Modify this room design: ${editPrompt}. Keep the overall room structure but apply the requested changes to colors, furniture sizes, or design elements. Make it look professional and realistic.`;
    } else {
      designPrompt = `Transform this empty room into a beautifully designed ${style} style ${roomType}. ${description ? description + '. ' : ''}Add appropriate furniture, decorations, lighting, and color scheme that matches the ${style} aesthetic. Make it look professional and inviting.`;
    }

    console.log('Generating design with prompt:', designPrompt);

    // Try Lovable AI first
    let generatedImage: string | null = null;
    
    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: designPrompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      
      // If credits exhausted, try OpenAI fallback
      if (response.status === 402) {
        console.log('Lovable AI credits exhausted, attempting OpenAI fallback');
        const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
        
        if (!OPENAI_API_KEY) {
          return new Response(
            JSON.stringify({ error: 'AI credits exhausted and no fallback configured. Please add credits or configure OpenAI API key.' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
          );
        }

        // Use OpenAI DALL-E as fallback
        const openaiResponse = await fetch('https://api.openai.com/v1/images/edits', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: (() => {
            const formData = new FormData();
            // Convert base64 to blob
            const base64Data = imageData.split(',')[1];
            const binaryData = atob(base64Data);
            const bytes = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
              bytes[i] = binaryData.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'image/png' });
            formData.append('image', blob, 'room.png');
            formData.append('prompt', designPrompt);
            formData.append('n', '1');
            formData.append('size', '1024x1024');
            return formData;
          })(),
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error('OpenAI fallback error:', openaiResponse.status, errorText);
          throw new Error(`OpenAI fallback failed: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        generatedImage = openaiData.data?.[0]?.url;
        console.log('Image generated using OpenAI fallback');
      } else if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Gateway error:', response.status, errorText);
        throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
      } else {
        const data = await response.json();
        console.log('AI response received from Lovable AI');
        generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      }
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }

    if (!generatedImage) {
      throw new Error('No image generated from AI response');
    }

    return new Response(
      JSON.stringify({ 
        image: generatedImage,
        message: 'Design generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-room-design function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: 'Please try again or contact support if the issue persists'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
