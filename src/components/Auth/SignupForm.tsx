import React, { useState } from 'react';
import styles from './Auth.module.css';
import { useAuth } from './AuthProvider';

export default function SignupForm({ onSuccess }: { onSuccess: () => void }) {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        software_background: 'Python',
        hardware_background: 'Arduino'
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access_token);
                onSuccess();
            } else {
                const errData = await response.json();
                setError(errData.detail || 'Signup failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <form className={styles.authContainer} onSubmit={handleSubmit}>
            <h3>Create Account</h3>
            {error && <p className={styles.authError}>{error}</p>}

            <input className={styles.authInput} name="full_name" placeholder="Full Name" onChange={handleChange} required />
            <input className={styles.authInput} name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input className={styles.authInput} name="password" type="password" placeholder="Password" onChange={handleChange} required />

            <label>Software Background:</label>
            <select className={styles.authInput} name="software_background" onChange={handleChange}>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="ROS 1">ROS 1</option>
                <option value="Beginner">Beginner</option>
            </select>

            <label>Hardware Background:</label>
            <select className={styles.authInput} name="hardware_background" onChange={handleChange}>
                <option value="Arduino">Arduino</option>
                <option value="Raspberry Pi">Raspberry Pi</option>
                <option value="None">None</option>
            </select>

            <button className={styles.authButton} type="submit">Sign Up</button>
        </form>
    );
}
