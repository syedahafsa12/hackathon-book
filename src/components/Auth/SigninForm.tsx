import React, { useState } from 'react';
import styles from './Auth.module.css';
import { useAuth } from './AuthProvider';

export default function SigninForm({ onSuccess }: { onSuccess: () => void }) {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const formBody = new URLSearchParams();
        formBody.append('username', formData.username);
        formBody.append('password', formData.password);

        try {
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access_token);
                onSuccess();
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <form className={styles.authContainer} onSubmit={handleSubmit}>
            <h3>Sign In</h3>
            {error && <p className={styles.authError}>{error}</p>}
            <input className={styles.authInput} name="username" type="email" placeholder="Email" onChange={handleChange} required />
            <input className={styles.authInput} name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button className={styles.authButton} type="submit">Sign In</button>
        </form>
    );
}
