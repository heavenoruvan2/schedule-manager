import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing from environment.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Natural Language Event Parsing API
app.post('/api/ai/parse-event', async (req, res) => {
  try {
    const { prompt, referenceDate } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();
    const todayStr = referenceDate || new Date().toISOString().split('T')[0];

    const systemInstruction = `You are FocusFlow AI's Natural Language Event Parser.
Today's date is: ${todayStr}.
Extract event details from user text input (e.g. "Tomorrow 3 PM Gym 1hr priority high").
Return valid structured JSON matching the requested schema.
Select category from: ["Study", "College", "Work", "Exercise", "Meeting", "Shopping", "Health", "Finance", "Travel", "Personal"].
Priority from: ["high", "medium", "low"].
Select appropriate Lucide icon name (e.g. Code, GraduationCap, Dumbbell, Users, ShoppingCart, Heart, DollarSign, Plane, BookOpen, Coffee, Sun).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Parse this scheduling request into an event object: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            date: { type: Type.STRING, description: 'YYYY-MM-DD' },
            startTime: { type: Type.STRING, description: 'HH:mm in 24h format e.g. 15:00' },
            endTime: { type: Type.STRING, description: 'HH:mm in 24h format e.g. 16:00' },
            durationMinutes: { type: Type.NUMBER },
            priority: { type: Type.STRING, description: 'high, medium, or low' },
            category: { type: Type.STRING },
            icon: { type: Type.STRING },
            notes: { type: Type.STRING },
            location: { type: Type.STRING },
            reminderMinutesBefore: { type: Type.NUMBER },
          },
          required: ['title', 'date', 'startTime', 'endTime', 'durationMinutes', 'priority', 'category'],
        },
      },
    });

    const parsedText = response.text || '{}';
    const eventData = JSON.parse(parsedText);

    res.json({ success: true, event: eventData });
  } catch (error: any) {
    console.error('Error parsing event with Gemini:', error);
    res.status(500).json({
      error: 'Failed to parse natural language event',
      message: error?.message || String(error),
    });
  }
});

// 2. Schedule Optimizer API
app.post('/api/ai/optimize-schedule', async (req, res) => {
  try {
    const { events, userPreferences } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are FocusFlow AI's Master Productivity & Schedule Optimizer.
Analyze the user's daily events.
Your tasks:
1. Identify any overlapping schedule conflicts.
2. Automatically adjust start/end times of low-priority tasks into free time slots to eliminate overlaps.
3. Insert necessary 15-minute rest/break blocks after long deep-work blocks (>= 90 mins).
4. Provide a clear summary explanation of changes made and productivity advice.

Return JSON response with two keys:
- "advice": clear bulleted summary string explaining your recommendations and changes.
- "optimizedEvents": updated array of event objects with non-overlapping startTime and endTime.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Optimize this schedule list: ${JSON.stringify(events)}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            optimizedEvents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  date: { type: Type.STRING },
                  startTime: { type: Type.STRING },
                  endTime: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  category: { type: Type.STRING },
                  aiReasoning: { type: Type.STRING },
                },
                required: ['title', 'startTime', 'endTime'],
              },
            },
          },
          required: ['advice', 'optimizedEvents'],
        },
      },
    });

    const parsedText = response.text || '{}';
    const result = JSON.parse(parsedText);
    res.json({ success: true, result });
  } catch (error: any) {
    console.error('Error optimizing schedule:', error);
    res.status(500).json({ error: 'Failed to optimize schedule', message: error?.message || String(error) });
  }
});

// 3. AI Coach Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, currentEvents } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are FocusFlow Assistant, an encouraging, highly practical AI Productivity Coach embedded in a Notion/Todoist/TickTick-style mobile productivity app.
You help users plan routines, overcome procrastination, build habits, organize study schedules, and stay focused.
Keep answers structured, concise, friendly, and actionable with markdown and bullet points.`;

    const formattedContents = messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');
    const promptWithContext = `Current User Events Context: ${JSON.stringify(currentEvents || [])}\n\nConversation:\n${formattedContents}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptWithContext,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Error in AI chat endpoint:', error);
    res.status(500).json({ error: 'Failed to generate AI response', message: error?.message || String(error) });
  }
});

async function startServer() {
  // Serve static assets / Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FocusFlow Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
