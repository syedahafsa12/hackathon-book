import React from 'react';
import RAGChatbot from '@site/src/components/RAGChatbot';
import { BetterAuthProvider } from '@site/src/components/Auth/BetterAuthProvider';
import ProgressTracker from '@site/src/components/ProgressTracker';

// Wrapper component to add global elements
export default function Root({children}) {
  return (
    <BetterAuthProvider>
      <ProgressTracker />
      {children}
      <RAGChatbot />
    </BetterAuthProvider>
  );
}
