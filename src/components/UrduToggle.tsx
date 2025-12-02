import React from 'react';
import Admonition from '@theme/Admonition';

// This is a simple wrapper. In a real scenario, you might use a Context to toggle visibility globally.
// For now, we rely on Docusaurus Admonitions with a specific title.

export default function UrduNote({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div dir="rtl" className="urdu-note">
            <Admonition type="tip" title="اردو ترجمہ (Urdu Translation)">
                <p style={{ fontFamily: 'Noto Nastaliq Urdu, Arial, sans-serif', fontSize: '1.1em' }}>
                    {children}
                </p>
            </Admonition>
        </div>
    );
}
