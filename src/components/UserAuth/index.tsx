import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
// import styles from './navbar.module.css';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

const UserAuth: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Login form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    try {
      // Load user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: User = {
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
    };

    try {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setShowLogin(false);
      alert(`Welcome ${name}!`);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      setShowProfile(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <>
        <button
          className={styles.loginButton}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer"
          }}
        >
          <Link
            to="/auth"
            className={styles.loginLink}
            style={{
              color: "#ffffff",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 600
            }}
          >
            <span className={styles.icon} style={{ color: "#ffffff" }}>👤</span>
            Login
          </Link>
        </button>



        {showLogin && (
          <div className={styles.modal} onClick={() => setShowLogin(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setShowLogin(false)}>×</button>
              <h2>Welcome!</h2>
              <p>Create your profile</p>

              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Create Profile
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={styles.userSection}>
      <button className={styles.profileButton} onClick={() => setShowProfile(!showProfile)}>
        {user.avatar && <img src={user.avatar} alt={user.name} className={styles.avatar} />}
        <span className={styles.userName}>{user.name}</span>
      </button>

      {showProfile && (
        <div className={styles.profileDropdown}>
          <div className={styles.profileHeader}>
            {user.avatar && <img src={user.avatar} alt={user.name} className={styles.avatarLarge} />}
            <div>
              <div className={styles.profileName}>{user.name}</div>
              <div className={styles.profileEmail}>{user.email}</div>
            </div>
          </div>

          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
