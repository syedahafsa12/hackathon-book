import React, { useEffect, useState } from 'react';
import styles from './ProgressTracker.module.css';
import { useLocation } from '@docusaurus/router';

export default function ProgressTracker() {
    const [progress, setProgress] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, [location]);

    if (location.pathname === '/') return null; // Don't show on homepage

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            <div className={styles.progressText}>{Math.round(progress)}% Read</div>
        </div>
    );
}
