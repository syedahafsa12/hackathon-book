import React, { useState } from 'react';
import styles from './PersonalizeButton.module.css';
import { useBetterAuth } from './Auth/BetterAuthProvider';

interface PersonalizeButtonProps {
    content: string;
    chapterTitle: string;
}

export default function PersonalizeButton({ content, chapterTitle }: PersonalizeButtonProps) {
    const { user, sessionToken, isAuthenticated } = useBetterAuth();
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [personalizedContent, setPersonalizedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handlePersonalize = async () => {
        if (!isAuthenticated) {
            alert('Please login to personalize content!');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/personalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                credentials: 'include',
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const data = await response.json();
                setPersonalizedContent(data.personalized_content);
                setIsPersonalized(true);
                setShowModal(true);
            } else {
                alert('Failed to personalize content. Please try again.');
            }
        } catch (error) {
            console.error('Personalization error:', error);
            alert('Backend connection failed. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setIsPersonalized(false);
        setPersonalizedContent('');
        setShowModal(false);
    };

    return (
        <>
            <div className={styles.personalizeContainer}>
                <button
                    className={styles.personalizeButton}
                    onClick={handlePersonalize}
                    disabled={loading || isPersonalized}
                >
                    {loading ? '⏳ Personalizing...' : isPersonalized ? '✅ Personalized!' : '✨ Personalize for Me'}
                </button>

                {isPersonalized && (
                    <button className={styles.resetButton} onClick={handleReset}>
                        🔄 Reset to Original
                    </button>
                )}

                {user && (
                    <div className={styles.profileInfo}>
                        <span>📊 Adapted for: {user.profile?.software_background || 'your profile'}</span>
                    </div>
                )}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>✨ Personalized Content</h3>
                            <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.personalizedText}>
                                {personalizedContent}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.resetButton} onClick={handleReset}>
                                🔄 Reset to Original
                            </button>
                            <button className={styles.closeModalButton} onClick={() => setShowModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
