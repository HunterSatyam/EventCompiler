import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

const CareerCompassAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hi there! I'm CareerCompass AI. \n\nI can help you search jobs, internships, build a resume, or create a skill roadmap. What's on your mind today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Mock API response delay
        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1500));

            const botResponse = generateMockResponse(inputValue);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                content: botResponse
            }]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Mock Logic for CareerCompass AI
    const generateMockResponse = (input) => {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('job') || lowerInput.includes('internship') || lowerInput.includes('search')) {
            return "I can help with that! EventCompiler has many opportunities.\n\nCould you tell me:\n• Your target role?\n• Preferred location (or remote)?\n• Your experience level?";
        }

        if (lowerInput.includes('resume') || lowerInput.includes('cv')) {
            return "Building a strong resume is key! \n\nI can help optimize your resume for ATS. Please share:\n• Your target role\n• Key skills\n• Brief project details";
        }

        if (lowerInput.includes('roadmap') || lowerInput.includes('learn') || lowerInput.includes('skill')) {
            return "A learning roadmap is a great idea! \n\nWhat role are you aiming for? (e.g., Frontend Dev, Data Scientist, Product Manager)";
        }

        if (lowerInput.includes('hackathon') || lowerInput.includes('competition')) {
            return "Competitions are a fantastic way to prove your skills! \n\nCheck out the 'Hackathons' section on our platform. I can also suggest some if you tell me your tech stack.";
        }

        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! How can I assist you with your career journey today?";
        }

        return "That sounds interesting! \n\nCould you give me a bit more detail so I can guide you better? I can help with jobs, internships, resumes, or skill roadmaps.";
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                onClick={toggleChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden"
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    CareerCompass AI
                                    <Sparkles size={14} className="text-yellow-300" />
                                </h3>
                                <p className="text-xs text-indigo-100 opacity-90">Your AI Career Assistant</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                    max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.type === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'}
                  `}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-indigo-600" />
                                        <span className="text-xs text-gray-500">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask about jobs, resume, skills..."
                                className="flex-1 p-2 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none transition-all"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CareerCompassAI;
