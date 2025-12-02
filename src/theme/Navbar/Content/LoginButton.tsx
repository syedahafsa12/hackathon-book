import React from 'react';
import { useBetterAuth } from '@site/src/components/Auth/BetterAuthProvider';
import { useHistory } from '@docusaurus/router';

export default function LoginButton() {
    const { user, logout } = useBetterAuth();
    const history = useHistory();

    if (user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                    onClick={() => history.push('/auth')}
                    style={{
                        background: 'linear-gradient(135deg, #6A0DAD 0%, #A45EE5 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={user.name}
                >
                    👤
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => history.push('/auth')}
            style={{
                background: 'linear-gradient(135deg, #6A0DAD 0%, #A45EE5 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(106, 13, 173, 0.3)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(106, 13, 173, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(106, 13, 173, 0.3)';
            }}
        >
            🔐 Login
        </button>
    );
}
