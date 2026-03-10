import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile } from '../types';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';

interface ChatbotProps {
  onClose: () => void;
  profile: UserProfile;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const Chatbot: React.FC<ChatbotProps> = ({ onClose, profile }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const goalTranslation = {
    lose_weight: 'perder peso',
    maintain_weight: 'manter o peso',
    gain_muscle: 'ganhar massa muscular',
  };
  
  const systemInstruction = `Você é o "Coach Nutricional", um assistente de IA amigável e experiente. Seu objetivo é responder a perguntas sobre nutrição, dieta e saúde de forma clara, precisa e encorajadora. Use o perfil do usuário para personalizar suas respostas, mas não revele explicitamente que você tem acesso a esses dados, a menos que seja diretamente relevante para a pergunta. Mantenha um tom positivo e motivacional. O perfil do usuário é: Idade: ${profile.age}, Peso: ${profile.weight}kg, Altura: ${profile.height}cm, Objetivo: ${goalTranslation[profile.goal]}, Alergias: ${profile.allergies || 'Nenhuma'}, Restrições: ${profile.restrictions || 'Nenhuma'}.`;

  useEffect(() => {
    const initChat = () => {
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
      });
      setChat(newChat);
      setMessages([
        {
          role: 'model',
          text: `Olá, ${profile.name}! Eu sou seu Coach Nutricional. Como posso te ajudar a alcançar seus objetivos hoje?`,
        },
      ]);
    };
    initChat();
  }, [profile, systemInstruction]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const responseStream = await chat.sendMessageStream({ message: currentInput });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length-1], text: modelResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length-1];
          if(lastMessage.role === 'model' && lastMessage.text === ''){
            newMessages[newMessages.length - 1] = { role: 'model', text: 'Desculpe, algo deu errado. Tente novamente.' };
            return newMessages;
          }
          return [...prev, { role: 'model', text: 'Desculpe, algo deu errado. Tente novamente.' }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const renderWithMarkdown = (text: string) => {
    // Split by bold markdown (**text**), keeping the delimiter
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // It's a bold part, remove the asterisks and wrap in <strong>
            return <strong key={index}>{part.slice(2, -2)}</strong>;
          }
          // It's a regular text part
          return part;
        })}
      </>
    );
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 w-[400px] h-[70vh] max-h-[600px] flex flex-col bg-surface dark:bg-gray-800 rounded-2xl shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center">
          <ChatBubbleIcon className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-bold ml-2 text-text dark:text-gray-50">Coach Nutricional</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <XIcon className="h-5 w-5 text-text-light dark:text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-black rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-text dark:text-gray-50 rounded-bl-none'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{renderWithMarkdown(msg.text)}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                    <div className="flex items-center space-x-1.5">
                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte algo..."
            rows={1}
            className="w-full p-2 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full text-black hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Enviar mensagem"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;