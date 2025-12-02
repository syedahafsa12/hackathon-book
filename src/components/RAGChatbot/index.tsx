import React, { useState, useRef } from 'react';
import styles from './styles.module.css';

const RAGChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {role: 'user', content: input}]);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'This is a placeholder response. Connect the backend API to enable full functionality.'
      }]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className={styles.chatbotContainer}>
        <button
          className={styles.chatButton}
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <span className={styles.chatIcon}>💬</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>🤖</span>
            <div className={styles.headerTitle}>Course Assistant</div>
          </div>
          <button
            className={styles.iconButton}
            onClick={() => setIsOpen(false)}
            title="Close chat"
          >
            ✕
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.length === 0 && (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeIcon}>👋</div>
              <h3>Welcome!</h3>
              <p>I can help you with questions about the course.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${styles[message.role]}`}
            >
              <div className={styles.messageContent}>
                {message.content}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <textarea
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            rows={2}
          />
          <button
            className={styles.sendButton}
            onClick={sendMessage}
            disabled={!input.trim()}
          >
            <span className={styles.sendIcon}>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RAGChatbot;
