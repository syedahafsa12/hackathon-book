import React, { useState } from 'react';
import Layout from '@theme/Layout';
import BetterSignupForm from '../components/Auth/BetterSignupForm';
import BetterSigninForm from '../components/Auth/BetterSigninForm';
import { useBetterAuth } from '../components/Auth/BetterAuthProvider';
import { useHistory } from '@docusaurus/router';
import styles from '../components/Auth/Auth.module.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const { user, logout } = useBetterAuth();
    const history = useHistory();

    const handleSuccess = () => {
        history.push('/');
    };

    return (
        <Layout title="Authentication" description="Login or Signup">
            <div className={styles.pageContainer}>
                {user ? (
                    <div className={styles.authContainer}>
                        <h2>Welcome, {user.name}!</h2>
                        <p className={styles.subtitle}>You are successfully logged in.</p>

                        {user.profile && (
                            <div className={styles.profileCard}>
                                <h4>Your Profile:</h4>
                                <p><strong>Software:</strong> {user.profile.software_background || 'Not specified'}</p>
                                <p><strong>Hardware:</strong> {user.profile.hardware_background || 'Not specified'}</p>
                                <p><strong>OS:</strong> {user.profile.operating_system || 'Not specified'}</p>
                                <p style={{ marginBottom: 0 }}><strong>Experience:</strong> {user.profile.experience_level || 'beginner'}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                className="button button--primary button--lg"
                                onClick={logout}
                            >
                                Logout
                            </button>
                            <button
                                className="button button--secondary button--lg"
                                onClick={() => history.push('/')}
                            >
                                Go to Course
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {isLogin ? (
                            <BetterSigninForm onSuccess={handleSuccess} />
                        ) : (
                            <BetterSignupForm onSuccess={handleSuccess} />
                        )}

                        <button
                            className={styles.toggleButton}
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </>
                )}
            </div>
        </Layout>
    );
}
