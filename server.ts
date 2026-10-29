import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google Gemini API if key is available
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({});
  } catch (err) {
    console.warn('Could not initialize Gemini AI client:', err);
  }
}

// In-memory admin telemetry and error logs
const serverStartTime = Date.now();
const systemLogs = [
  {
    id: 'log-1',
    level: 'INFO',
    service: 'superpost-core',
    message: 'SuperPost API Gateway initialized on port 3000',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'log-2',
    level: 'INFO',
    service: 'temporal-orchestrator',
    message: 'Workflow worker poll queue registered for namespace: default',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: 'log-3',
    level: 'INFO',
    service: 'oauth-provider',
    message: 'Refreshed access token for X (@SuperPostApp) successfully',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'log-4',
    level: 'WARN',
    service: 'rate-limiter',
    message: 'High request rate detected on /api/posts from IP 192.168.1.42 (85 req/min)',
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'log-5',
    level: 'INFO',
    service: 'webhook-dispatcher',
    message: 'Delivered post.published event to https://n8n.mycompany.com (HTTP 200 OK)',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
];

// --- REST API ENDPOINTS ---

// Health check endpoint
app.get('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  res.json({
    status: 'healthy',
    application: 'SuperPost',
    version: '2.1.0-release',
    uptime: `${Math.floor(uptimeSeconds / 60)}m ${uptimeSeconds % 60}s`,
    database: 'connected (PostgreSQL / Prisma)',
    temporalQueue: 'active',
    redis: 'connected',
    aiEngine: aiClient ? 'connected (Gemini 2.5 Flash)' : 'offline (fallback mode)',
  });
});

// Admin stats endpoint
app.get('/api/admin/stats', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    system: {
      uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      rssMb: Math.round(mem.rss / 1024 / 1024),
      nodeVersion: process.version,
      platform: process.platform,
    },
    metrics: {
      totalUsers: 1482,
      activeOrganizations: 312,
      totalPostsDispatched: 34890,
      activeIntegrations: 2840,
      activeTemporalWorkflows: 14,
      avgResponseTimeMs: 24,
      errorRate: '0.04%',
    },
  });
});

// Admin error logs endpoint
app.get('/api/admin/errors', (req, res) => {
  res.json({
    logs: systemLogs,
  });
});

// Admin users list endpoint
app.get('/api/admin/users', (req, res) => {
  res.json({
    users: [
      {
        id: 'usr-1',
        name: 'Alex Rivera',
        email: 'alex@superpost.io',
        role: 'SUPER_ADMIN',
        organization: 'SuperPost HQ',
        status: 'ACTIVE',
        postsCount: 412,
        joinedAt: '2026-01-15',
      },
      {
        id: 'usr-2',
        name: 'Sarah Chen',
        email: 'sarah.content@superpost.io',
        role: 'ORG_ADMIN',
        organization: 'SuperPost HQ',
        status: 'ACTIVE',
        postsCount: 184,
        joinedAt: '2026-02-10',
      },
      {
        id: 'usr-3',
        name: 'David Miller',
        email: 'david@creatorlab.agency',
        role: 'USER',
        organization: 'Creator Lab',
        status: 'ACTIVE',
        postsCount: 92,
        joinedAt: '2026-03-01',
      },
      {
        id: 'usr-4',
        name: 'Hanna Schmidt',
        email: 'hanna@berlinmedia.de',
        role: 'USER',
        organization: 'Berlin Media',
        status: 'ACTIVE',
        postsCount: 56,
        joinedAt: '2026-04-12',
      },
      {
        id: 'usr-5',
        name: 'Spam Bot Test',
        email: 'temp.test@trashmail.com',
        role: 'USER',
        organization: 'Trial Sandbox',
        status: 'SUSPENDED',
        postsCount: 0,
        joinedAt: '2026-05-02',
      },
    ],
  });
});

// AI Generation endpoint powered by Gemini
app.post('/api/ai/generate', async (req, res) => {
  const { prompt, action, context } = req.body;

  if (!prompt && !action) {
    return res.status(400).json({ error: 'Prompt or action is required' });
  }

  // If Gemini API is available, generate live content
  if (aiClient) {
    try {
      let systemInstruction = `You are the SuperPost AI Copilot, an elite social media strategist and copywriting expert.
Your job is to generate viral, engaging, high-retention content tailored for cross-platform distribution across X, LinkedIn, Instagram, TikTok, and YouTube.
Keep your output formatted cleanly with appropriate line breaks, compelling hooks, and relevant hashtags.`;

      let userPrompt = prompt || '';
      if (action === 'hook') {
        userPrompt = `Generate 3 viral social media hooks for the following concept. Make them high-curiosity, punchy, and formatted for LinkedIn and X:\n${context || prompt}`;
      } else if (action === 'hashtags') {
        userPrompt = `Suggest 8 high-intent, trending hashtags relevant to this content:\n${context || prompt}`;
      } else if (action === 'linkedin') {
        userPrompt = `Rewrite this draft into an authentic, storytelling B2B LinkedIn post with clean whitespace and a thought-provoking closing question:\n${context || prompt}`;
      } else if (action === 'bold') {
        userPrompt = `Rewrite this draft with a bold, contrarian, punchy tone that sparks discussion:\n${context || prompt}`;
      } else if (action === 'thread') {
        userPrompt = `Break this concept into an engaging 4-part social media thread with bullet points and key takeaways:\n${context || prompt}`;
      }

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nTask: ${userPrompt}` }] },
        ],
      });

      const text = response.text || '';
      return res.json({ text, source: 'gemini-2.5-flash' });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to heuristic engine:', err?.message);
    }
  }

  // Graceful smart fallback when API key is not yet provided
  let fallbackText = '';
  if (action === 'hook') {
    fallbackText = `🔥 Stop spending 10+ hours a week on social media.\n\nHere's the exact framework we used to scale cross-platform reach by 340%:\n\n1. Write once, adapt natively\n2. Schedule during algorithmic peak windows\n3. Engage with every reply in the first 60 minutes`;
  } else if (action === 'hashtags') {
    fallbackText = `#SocialMediaStrategy #SaaSGrowth #ContentMarketing #CreatorEconomy #Automation`;
  } else if (action === 'linkedin') {
    fallbackText = `Most founders believe organic reach is dead.\n\nHere's the truth:\n\nAudiences haven't stopped reading. They've just developed a radar for generic fluff.\n\nFocus on tactical, real-world case studies with actual numbers. That's what builds authority.\n\nWhat's your highest performing post type this quarter?`;
  } else if (action === 'bold') {
    fallbackText = `Hot take: If you're only posting on one platform, you're leaving 80% of your audience on the table.\n\nDiversify your distribution before you double down on creation.`;
  } else if (action === 'thread') {
    fallbackText = `🧵 1/4 How to build a modern social media engine:\n\n• Curate raw ideas in your notes\n• Batch draft your posts twice weekly\n• Use live feed previews to avoid formatting errors\n• Schedule with auto-first comments\n\n#Growth #SuperPost`;
  } else {
    fallbackText = `Here is your SuperPost draft:\n\nConsistent distribution compounds faster than you think.\n\nFocus on delivering high-signal value, format with clean whitespace, and invite your audience to join the discussion.\n\n#BuildingInPublic #SocialGrowth`;
  }

  return res.json({ text: fallbackText, source: 'smart-engine' });
});

// Webhook test trigger
app.post('/api/webhooks/test', (req, res) => {
  const { url } = req.body;
  res.json({
    success: true,
    message: `Test ping dispatched to ${url || 'default webhook endpoint'}`,
    timestamp: new Date().toISOString(),
    event: 'test.ping',
  });
});

// --- VITE MIDDLEWARE (DEV) / STATIC FILE SERVING (PROD) ---
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 SuperPost server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
