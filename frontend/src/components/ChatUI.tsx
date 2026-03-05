import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
    role: 'bot' | 'user';
    content: string;
}

const suggestedQuestions = [
    'What is glaucoma?',
    'How accurate is the AI?',
    'What does fundus imaging mean?',
    'Should I see a doctor?',
];

export function ChatUI() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'bot', content: 'Hello! I\'m the MediPredict AI Assistant. I can help you understand eye conditions, our screening process, and what your results mean. How can I help you today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg = text.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                role: 'bot',
                content: generateResponse(userMsg)
            }]);
        }, 1200 + Math.random() * 800);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleChipClick = (question: string) => {
        sendMessage(question);
    };

    return (
        <div className="chat-container">
            {/* Suggested questions */}
            <div className="chat-suggestions">
                {suggestedQuestions.map((q, i) => (
                    <button key={i} className="chat-chip" onClick={() => handleChipClick(q)}>
                        {q}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-msg ${msg.role}`}>
                        <div className="chat-avatar">
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className="chat-bubble">{msg.content}</div>
                    </div>
                ))}

                {isTyping && (
                    <div className="chat-typing">
                        <div className="chat-avatar" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
                            <Bot size={16} />
                        </div>
                        <div className="typing-dots">
                            <span /><span /><span />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-bar">
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <input
                        className="chat-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question here…"
                    />
                    <button type="submit" className="chat-send-btn" disabled={!input.trim() || isTyping}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

function generateResponse(question: string): string {
    const q = question.toLowerCase();
    if (q.includes('glaucoma')) {
        return 'Glaucoma is a group of eye conditions that damage the optic nerve, often caused by abnormally high intraocular pressure. It\'s one of the leading causes of irreversible blindness. Early detection through regular screening is crucial, as vision loss from glaucoma cannot be recovered. Our AI model screens for glaucoma with high confidence using fundus imagery.';
    }
    if (q.includes('accurate') || q.includes('accuracy')) {
        return 'Our DenseNet121-based model achieves approximately 94.2% accuracy across 16 eye conditions when validated against clinical datasets. However, AI screening is a supplementary tool — it should not replace a comprehensive eye exam by a qualified ophthalmologist.';
    }
    if (q.includes('fundus')) {
        return 'Fundus imaging is a technique that captures a photograph of the interior surface of the eye, including the retina, optic disc, macula, and surrounding blood vessels. It\'s the primary imaging modality our AI uses for screening, as many eye diseases leave visible signatures on the fundus.';
    }
    if (q.includes('doctor') || q.includes('professional') || q.includes('specialist')) {
        return 'If our AI detects any condition with moderate to high severity, we strongly recommend scheduling an appointment with an ophthalmologist or optometrist. AI screening is a helpful first step, but a professional examination is essential for confirmed diagnosis and treatment planning.';
    }
    if (q.includes('diabetic') || q.includes('retinopathy')) {
        return 'Diabetic retinopathy is damage to the retinal blood vessels caused by diabetes. It\'s a leading cause of preventable blindness. Our model classifies it as high severity because early intervention can significantly slow progression.';
    }
    if (q.includes('cataract')) {
        return 'A cataract is a clouding of the eye\'s natural lens that affects vision clarity. It typically develops gradually and is very common in older adults. Our AI can detect cataract signatures from fundus scans and classifies it as moderate severity.';
    }
    return `That's a great question about "${question}". While I can provide general educational information about eye health and our screening process, please remember that I'm an AI assistant and cannot provide personalized medical advice. For specific health concerns, please consult a qualified eye care professional.`;
}
