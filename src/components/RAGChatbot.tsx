import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './RAGChatbot.module.css';
import { useBetterAuth } from './Auth/BetterAuthProvider';
import { useHistory } from '@docusaurus/router';

export default function RAGChatbot(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
        { role: 'ai', content: 'Hi! I am your AI assistant powered by Gemini 2.0 Flash. Ask me anything about the course content!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const { user, sessionToken, loading: authLoading } = useBetterAuth();
    const history = useHistory();

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    question: userMessage,
                    language: user?.profile?.preferred_language || 'en'
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
            } else if (response.status === 401) {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: "Your session has expired. Please log in again."
                }]);
            } else {
                throw new Error('Backend error');
            }
        } catch (error) {
            console.warn("Backend connection failed", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "I'm having trouble connecting to the backend. Please make sure the backend server is running at http://localhost:8000"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return null; // Don't show chatbot while auth is loading
    }

    return (
        <>
            <button
                className={clsx(styles.chatButton, 'chat-button-pulse')}
                onClick={toggleChat}
                aria-label="Ask AI"
            >
                {isOpen ? 'Close' : '🤖 Ask AI'}
            </button>

            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerTitle}>
                            <span className={styles.robotIcon}>🤖</span>
                            <h3>Chatbot {user ? `(${user.name.split(' ')[0]})` : ''}</h3>
                        </div>
                        <button onClick={toggleChat} className={styles.closeButton}>×</button>
                    </div>

                    {!user ? (
                        <div className={styles.chatMessages} style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
                            <div className={styles.robotIcon} style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                            <h3>Authentication Required</h3>
                            <p style={{ marginBottom: '20px', color: '#666' }}>
                                Please sign in to use the AI Assistant and get personalized answers.
                            </p>
                            <button
                                className="button button--primary button--lg"
                                onClick={() => {
                                    setIsOpen(false);
                                    history.push('/auth');
                                }}
                            >
                                Sign In / Sign Up
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.chatMessages}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={clsx(styles.message, styles[msg.role])}>
                                        <div className={styles.messageContent}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className={clsx(styles.message, styles.ai)}>
                                        <div className={styles.typingIndicator}>
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <form className={styles.chatInput} onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    disabled={isLoading}
                                />
                                <button type="submit" disabled={isLoading || !input.trim()}>
                                    {isLoading ? '...' : 'Send'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
