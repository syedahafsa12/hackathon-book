import React, { useState } from 'react';
import styles from './Auth.module.css';
import { useBetterAuth } from './BetterAuthProvider';

export default function BetterSigninForm({ onSuccess }: { onSuccess: () => void }) {
    const { login } = useBetterAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                login(data.session_token);
                onSuccess();
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Network error. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.authContainer} onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <p className={styles.subtitle}>Sign in to continue learning</p>

            {error && <div className={styles.authError}>{error}</div>}

            <div className={styles.formGroup}>
                <label>Email</label>
                <input
                    className={styles.authInput}
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Password</label>
                <input
                    className={styles.authInput}
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                />
            </div>

            <button className={styles.authButton} type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
}
