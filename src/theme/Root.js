import React from 'react';
import RAGChatbot from '../components/RAGChatbot';
import { BetterAuthProvider } from '../components/Auth/BetterAuthProvider';
import ProgressTracker from '../components/ProgressTracker';

// Default implementation, that you can customize
export default function Root({ children }) {
    return (
        <BetterAuthProvider>
            <ProgressTracker />
            <>{children}</>
            <RAGChatbot />
        </BetterAuthProvider>
    );
}
