'use client'

import { useState, useRef, useEffect } from 'react';
import { getChatResponse } from './server/actions';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Terminal, Send, User } from "lucide-react" 

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 1. New State: Store the full history of messages
  // Format: { role: 'user' | 'model', parts: [{ text: '...' }] }
  const [messages, setMessages] = useState([]);

  // Auto-scroll to bottom ref
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput(''); // Clear input immediately
    setLoading(true);

    // 2. Create the new user message object
    const newUserMessage = { role: 'user', parts: [{ text: userText }] };

    // 3. Update UI immediately with user's message
    const newHistory = [...messages, newUserMessage];
    setMessages(newHistory);

    // 4. Send the ENTIRE history + new message to the server
    // Note: We pass 'messages' (the history before this new one) 
    // because the AI SDK adds the new message automatically when we call sendMessage.
    const result = await getChatResponse(messages, userText);

    if (result.success) {
      // 5. Add AI response to the list
      const newAiMessage = { role: 'model', parts: [{ text: result.text }] };
      setMessages([...newHistory, newAiMessage]);
    } else {
       // Handle error (optional)
       alert("Failed to get response");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4 text-black font-mono">
      <Card className="w-full max-w-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none h-[80vh] flex flex-col">
        
        <CardHeader className="border-b-2 border-black bg-black text-white p-4 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <CardTitle className="text-lg font-bold">TERMINAL_CHAT_V2</CardTitle>
          </div>
          <CardDescription className="text-gray-400 text-xs">
            History Enabled • Memory Active
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Welcome Message if chat is empty */}
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <p>SYSTEM READY.</p>
              <p className="text-xs">Start typing to initialize session...</p>
            </div>
          )}

          {/* 6. Map through messages to display conversation */}
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 border-2 border-black rounded-none ${
                  msg.role === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 border-b border-gray-500/50 pb-1">
                   {msg.role === 'user' ? <User size={12}/> : <Terminal size={12}/>}
                   <span className="text-[10px] uppercase font-bold tracking-wider">
                     {msg.role === 'user' ? 'YOU' : 'SYSTEM'}
                   </span>
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.parts[0].text}
                </p>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
               <div className="p-3 bg-gray-100 border-2 border-gray-300 text-gray-400 text-xs rounded-none animate-pulse">
                 PROCESSING_DATA...
               </div>
            </div>
          )}
          
          <div ref={bottomRef} />
        </CardContent>

        {/* Input Area (Fixed at bottom) */}
        <div className="p-4 border-t-2 border-black bg-white shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command..."
              disabled={loading}
              className="rounded-none border-2 border-black focus-visible:ring-0 h-12"
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="rounded-none h-12 px-6 bg-black hover:bg-gray-800 text-white border-2 border-black"
            >
              {loading ? '...' : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>

      </Card>
    </div>
  );
}