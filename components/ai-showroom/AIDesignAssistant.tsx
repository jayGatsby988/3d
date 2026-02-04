'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, TrendingUp, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import useShowroomStore from '@/lib/showroomStore';
import { buildDesignContextSummary } from '@/lib/designContext';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

type AIDesignAssistantProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const QUICK_PROMPTS = [
  {
    label: 'Design tip',
    icon: Sparkles,
    prompt: 'Give me one short design suggestion or tip for my current selections—e.g. a pairing that works well or something most homeowners choose.',
  },
  {
    label: 'Resale value',
    icon: TrendingUp,
    prompt: 'In one or two sentences, does anything in my current design typically help resale value? Keep it general, no made-up percentages.',
  },
  {
    label: 'Summarize for consultation',
    icon: FileText,
    prompt: 'Summarize my current design and estimate in a short paragraph a designer can read in 30 seconds: key materials, upgrades, total estimate range, and timeline. No fluff.',
  },
];

export default function AIDesignAssistant({ open: controlledOpen, onOpenChange }: AIDesignAssistantProps = {}) {
  const { settings, estimate } = useShowroomStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const designContext = buildDesignContextSummary(settings, estimate);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToApi = async (userContent: string) => {
    const userMessage: ChatMessage = { role: 'user', content: userContent };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    const chatMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          designContext,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const assistantContent = data.message?.content ?? 'No response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Something went wrong';
      setError(errMsg);
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    sendToApi(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (loading) return;
    sendToApi(prompt);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 p-0 shadow-lg bg-gray-900 hover:bg-gray-800 text-white"
          aria-label="Open AI design assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0"
      >
        <SheetHeader className="p-4 border-b border-gray-200">
          <SheetTitle className="text-lg font-semibold text-gray-900">
            AI Design Assistant
          </SheetTitle>
          <p className="text-sm text-gray-500 font-normal">
            Get tips, resale insights, and a consultation summary—powered by your current design.
          </p>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Ask anything about your design, or try:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map(({ label, icon: Icon, prompt }) => (
                      <Button
                        key={label}
                        variant="outline"
                        size="sm"
                        className="text-left h-auto py-2 px-3 whitespace-normal"
                        onClick={() => handleQuickPrompt(prompt)}
                        disabled={loading}
                      >
                        <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2.5 bg-gray-100 border border-gray-200 inline-flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {error && (
            <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-t border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your design, materials, or pricing…"
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="shrink-0 h-11 w-11">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
