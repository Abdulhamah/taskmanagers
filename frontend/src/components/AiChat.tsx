import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
}

interface AiChatProps {
  userId?: string;
}

export default function AiChat({ userId: propUserId }: AiChatProps) {
  const userId = propUserId || localStorage.getItem('userId') || '';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/${userId}`);
      const data = await response.json();
      setMessages(data.reverse());
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: userMessage })
      });

      const data = await response.json();
      setMessages([...messages, data]);

      // If the message was about creating a task, notify the user
      if (userMessage.toLowerCase().includes('create task')) {
        // You could trigger a task refresh here
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition duration-200 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              AI Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm mt-8">
                <p className="mb-2">👋 Hello! I'm your AI assistant.</p>
                <p className="text-xs">Try "create task: [task name]" or ask for help!</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg max-w-xs">
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg max-w-xs">
                    <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={loading}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
