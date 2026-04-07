import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { SCHOOL_DATA } from '../services/schoolData';
import { SPORTS, ACADEMICS, SCHOOL_INFO } from '../constants';

const SYSTEM_INSTRUCTION = `
You are Pol, the official AI assistant for Power of Love Primary School in Kokstad.
Your goal is to provide accurate information to parents, students, and visitors.

Key Information You Have Access To:
- School Info: ${JSON.stringify(SCHOOL_INFO)}
- Directions: ${SCHOOL_DATA.directions}
- Application Process: ${SCHOOL_DATA.applicationProcess}
- Principal: ${SCHOOL_DATA.principal.name} (${SCHOOL_DATA.principal.contact}, ${SCHOOL_DATA.principal.email})
- Teachers & Staff: ${JSON.stringify(SCHOOL_DATA.teachers)}
- Academic Programs: ${JSON.stringify(ACADEMICS)}
- Extracurricular Activities (Sports): ${JSON.stringify(SPORTS)}
- News: ${JSON.stringify(SCHOOL_DATA.news)}
- Notices: ${JSON.stringify(SCHOOL_DATA.notices)}
- Application Tracking: You can track applications if given an application number (e.g., APP001).
  Current Applications: ${JSON.stringify(SCHOOL_DATA.applications)}

Guidelines:
1. Be polite, professional, and helpful.
2. Always refer to yourself as Pol.
3. Do not re-introduce yourself (e.g., "I am Pol") in every response if you have already introduced yourself at the start of the conversation.
4. If asked for directions, provide the specific address (24 Main Street, Kokstad) and the guidance provided.
5. If asked about applications, explain the process and offer to track an application if they have a number.
6. If asked for a teacher's contact, ask for the grade first, then provide the name and contact details.
7. If asked about academic programs (like Spelling Bee or Chess), provide details about the program and how to participate.
8. If asked about sports, discuss the teams, their descriptions, and the required kits.
9. If asked for news or notices, provide the most recent ones.
10. If you don't know the answer, politely suggest they contact the admin office at admin@powerofloveprimary.co.za or +27 (0) 39 727 1234.
11. Use Markdown for formatting (bolding, lists, etc.).
`;

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hello! I'm Pol, the Power of Love Primary School assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";

      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      // We send the full history to maintain context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chat.sendMessage({
        message: userMessage,
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our office directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 mr-2"
          >
            <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-100 relative">
              <p className="text-xs font-bold text-navy-900 whitespace-nowrap">
                For assistance, please talk to Pol
              </p>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
            </div>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[350px] md:w-[400px] overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-navy-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Pol</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-navy-200 uppercase tracking-wider font-medium">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-navy-900 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none">
                        <Loader2 className="w-4 h-4 animate-spin text-navy-900" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask me anything..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 disabled:opacity-50 disabled:hover:bg-navy-900 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-gray-400 mt-3">
                    Powered by Pol AI Assistant
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`w-14 h-14 bg-navy-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
