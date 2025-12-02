import React, { useState } from 'react';
import styles from './Auth.module.css';
import { useBetterAuth } from './BetterAuthProvider';

export default function BetterSignupForm({ onSuccess }: { onSuccess: () => void }) {
    const { login } = useBetterAuth();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        software_background: '',
        hardware_background: '',
        operating_system: '',
        gpu_hardware: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/signup', {
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
                const errData = await response.json();
                setError(errData.detail || 'Signup failed');
            }
        } catch (err) {
            setError('Network error. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.authContainer} onSubmit={handleSubmit}>
            <h2>Create Your Account</h2>
            <p className={styles.subtitle}>Join the Physical AI learning community</p>

            {error && <div className={styles.authError}>{error}</div>}

            <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                    className={styles.authInput}
                    name="name"
                    placeholder="John Doe"
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label>Email *</label>
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
                <label>Password *</label>
                <input
                    className={styles.authInput}
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.divider}>
                <span>Tell us about your background</span>
            </div>

            <div className={styles.formGroup}>
                <label>Software Background</label>
                <select className={styles.authInput} name="software_background" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="Python">Python</option>
                    <option value="C++">C++</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="ROS 1">ROS 1</option>
                    <option value="Beginner">Beginner</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Hardware/Robotics Background</label>
                <select className={styles.authInput} name="hardware_background" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="Arduino">Arduino</option>
                    <option value="Raspberry Pi">Raspberry Pi</option>
                    <option value="NVIDIA Jetson">NVIDIA Jetson</option>
                    <option value="None">None</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Operating System</label>
                <select className={styles.authInput} name="operating_system" onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="Ubuntu">Ubuntu</option>
                    <option value="Windows">Windows</option>
                    <option value="macOS">macOS</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>GPU/Hardware</label>
                <input
                    className={styles.authInput}
                    name="gpu_hardware"
                    placeholder="e.g., NVIDIA RTX 3060"
                    onChange={handleChange}
                />
            </div>

            <button className={styles.authButton} type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
    );
}
