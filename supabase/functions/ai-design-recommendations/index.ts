import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomType, style, budget, preferences, modelPreference = 'gemini' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Select model based on user preference - supports both Gemini and GPT models
    const modelMap: Record<string, string> = {
      'gemini': 'google/gemini-2.5-flash',
      'gemini-pro': 'google/gemini-2.5-pro',
      'gpt': 'openai/gpt-5-mini',
      'gpt-pro': 'openai/gpt-5',
    };
    
    const selectedModel = modelMap[modelPreference] || 'google/gemini-2.5-flash';

    const systemPrompt = `You are an expert interior designer AI assistant with years of experience in creating beautiful, functional spaces. Generate creative, practical, and personalized room design recommendations based on user preferences. Provide detailed suggestions including furniture, colors, materials, and layout ideas that can be implemented within the specified budget.`;

    const userPrompt = `Generate a detailed interior design recommendation for:
    - Room Type: ${roomType}
    - Style: ${style}
    - Budget: $${budget}
    - Additional Preferences: ${preferences || 'None'}
    
    Provide a comprehensive design plan including:
    1. Color palette (3-5 colors with specific color codes)
    2. Key furniture pieces (5-7 items with estimated prices)
    3. Materials and textures recommendations
    4. Lighting suggestions (ambient, task, and accent)
    5. Decor elements and accessories with shopping tips
    6. Layout tips for optimal space utilization
    
    Format the response as a detailed, actionable design plan that is practical and achievable within the budget.`;

    console.log(`Using AI model: ${selectedModel} for design recommendation`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content;

    console.log('Successfully generated AI recommendation');

    return new Response(
      JSON.stringify({ recommendation, model: selectedModel }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-design-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});