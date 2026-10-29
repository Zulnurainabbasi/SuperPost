import React, { useState } from 'react';
import {
  Bot,
  Brain,
  Check,
  CheckCircle2,
  Copy,
  Layers,
  MessageSquare,
  Play,
  Plus,
  Send,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Wand2,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { AIAgent } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  draftPost?: string;
  time: string;
}

export const AgentsCopilotView: React.FC = () => {
  const { agents, toggleAgent, openComposer } = useSuperPost();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "👋 Hi! I am your SuperPost AI Agent Copilot. I can brainstorm viral content hooks, convert articles into multi-channel threads, or plan your entire weekly calendar across 28+ channels.\n\nTry asking: 'Write 3 viral LinkedIn hooks about AI automation tools for developers.'",
      time: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputPrompt.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = inputPrompt.trim();
    setInputPrompt('');
    setIsGenerating(true);

    (async () => {
      let aiText = '';
      let generatedDraft = '';

      try {
        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (data && data.text) {
          aiText = data.text;
          generatedDraft = data.text.length > 250 ? data.text.slice(0, 250) + '...' : data.text;
        }
      } catch {
        if (prompt.toLowerCase().includes('hook') || prompt.toLowerCase().includes('linkedin')) {
          aiText = "Here are 3 high-converting hooks crafted for LinkedIn & X:\n\n1. Most founders spend 15 hours/week on social media. We cut it down to 45 minutes.\n2. Why 95% of social scheduling tools fail in 2026 (and how open architecture changed the game).\n3. The exact 30-day framework we used to 4x cross-channel engagement without paid ads.\n\nI also drafted a full post for you below ready for the scheduler!";
          generatedDraft = "Most founders spend 15 hours a week manually copying and pasting social updates across 10 platforms.\n\nHere is our 3-step automation workflow:\n\n1. Centralize draft creation with live platform previews\n2. Auto-schedule at peak algorithmic hours\n3. Leverage first-comment automation for external links\n\nWhat tool in your stack saves you the most time? #Productivity #SaaS";
        } else if (prompt.toLowerCase().includes('thread') || prompt.toLowerCase().includes('x') || prompt.toLowerCase().includes('twitter')) {
          aiText = "I have drafted a punchy 4-part thread ready to broadcast:";
          generatedDraft = "🧵 1/4 The anatomy of a high-converting social post in 2026:\n\n• First line curiosity hook\n• Clean whitespace for mobile scanners\n• Data or personal contrarian insight\n• High-intent call to discussion\n\n#BuildingInPublic #Growth";
        } else {
          aiText = `Here is a custom content strategy for "${prompt}":\n\nConsistent posting isn't about working harder—it's about building an automated distribution pipeline. When you publish across multiple networks simultaneously, your reach compounds exponentially.`;
          generatedDraft = `Are you treating your social media like an afterthought or a distribution engine?\n\nKey takeaway: Focus on one core pillar insight each week, then repurpose into:\n- Short tweet hook\n- Detailed LinkedIn case study\n- Visual carousel\n\n#SuperPost #ContentStrategy`;
        }
      }

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: aiText,
        draftPost: generatedDraft,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
      setIsGenerating(false);
    })();
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>AI Copilot & Autonomous Agents</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-normal">
              MCP-Powered
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automate social ideation, viral hook generation, and cross-channel repurposing with AI
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>SuperPost Intelligence v2.1 • Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Copilot Chat */}
        <div className="lg:col-span-7 flex flex-col h-[580px] rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">SuperPost Copilot</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Model Connected
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'm-reset',
                    sender: 'assistant',
                    text: 'Chat cleared! What shall we brainstorm today?',
                    time: 'Just now',
                  },
                ])
              }
              className="text-[11px] text-slate-500 hover:text-slate-300"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* If assistant returned a generated draft post */}
                  {msg.draftPost && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-violet-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-violet-300 font-bold uppercase tracking-wider">
                        <span>✨ Generated Social Post Draft</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        {msg.draftPost}
                      </p>
                      <button
                        onClick={() => openComposer({ content: msg.draftPost })}
                        className="w-full py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Open & Schedule in Composer</span>
                      </button>
                    </div>
                  )}

                  <span className="block mt-1 text-[9px] text-slate-400 text-right font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-2 text-xs text-violet-400 p-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>SuperPost AI is reasoning and composing viral hooks...</span>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask Copilot: 'Write 3 LinkedIn hooks about building a SaaS'..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputPrompt.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Pre-Configured Autonomous Agents */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Configured Autonomous Agents</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {agents.filter((a) => a.enabled).length} Enabled
            </span>
          </div>

          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{agent.name}</div>
                      <div className="text-[10px] text-indigo-300 font-medium">
                        {agent.category} • {agent.frequency}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {agent.enabled ? (
                      <ToggleRight className="w-7 h-7 text-indigo-500 fill-indigo-500/20" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {agent.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">
                    Template: &quot;{agent.promptTemplate.slice(0, 36)}...&quot;
                  </span>
                  <button
                    onClick={() => {
                      setInputPrompt(agent.promptTemplate);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Run in Chat →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
