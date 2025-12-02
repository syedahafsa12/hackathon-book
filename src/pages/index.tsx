import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { useBetterAuth } from '@site/src/components/Auth/BetterAuthProvider';
import { useHistory } from '@docusaurus/router';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { user, logout } = useBetterAuth();
  const history = useHistory();

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.heroTitle}>
              {siteConfig.title}
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <p className={styles.heroDescription}>
              Master ROS 2, Gazebo, NVIDIA Isaac, and Vision-Language-Action models
              to build the next generation of intelligent robots.
            </p>

            <div className={styles.heroButtons}>
              <Link
                className={clsx('button button--primary button--lg', styles.primaryButton)}
                to="/docs/module0-intro/what-is-physical-ai">
                🚀 Start Learning
              </Link>

              {user ? (
                <button
                  className={clsx('button button--secondary button--lg', styles.secondaryButton)}
                  onClick={() => history.push('/auth')}>
                  👤 {user.name}
                </button>
              ) : (
                <Link
                  className={clsx('button button--secondary button--lg', styles.secondaryButton)}
                  to="/auth">
                  🔐 Sign In / Sign Up
                </Link>
              )}
            </div>

            {user && (
              <div className={styles.userWelcome}>
                <p>✨ Welcome back, {user.name}! Ready to continue your journey?</p>
              </div>
            )}
          </div>

          <div className={styles.heroImage}>
            <div className={styles.robotAnimation}>
              <div className={styles.robotIcon}>🤖</div>
              <div className={styles.pulseRing}></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <div className={styles.featureContent}>
        <div className={styles.featureIcon}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Home"
      description="Learn Physical AI and Humanoid Robotics with ROS 2, Gazebo, and NVIDIA Isaac">
      <HomepageHeader />

      <main>
        {/* Features Section */}
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <FeatureCard
                icon="🤖"
                title="Physical AI"
                description="Learn to build AI systems that interact with the real world through sensors and actuators."
              />
              <FeatureCard
                icon="🧠"
                title="Humanoid Robotics"
                description="Master bipedal locomotion, manipulation, and the complexities of human-like robots."
              />
              <FeatureCard
                icon="🌐"
                title="Multilingual"
                description="Available in English and Urdu with AI-powered personalization for your background."
              />
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className={styles.modules}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Course Modules</h2>
            <div className="row">
              <div className={clsx('col col--6', styles.moduleCard)}>
                <div className={styles.moduleContent}>
                  <div className={styles.moduleNumber}>01</div>
                  <h3>Introduction to Physical AI</h3>
                  <p>Understand embodied intelligence and the transition from digital to physical AI.</p>
                  <Link to="/docs/module0-intro/what-is-physical-ai" className={styles.moduleLink}>
                    Explore Module →
                  </Link>
                </div>
              </div>

              <div className={clsx('col col--6', styles.moduleCard)}>
                <div className={styles.moduleContent}>
                  <div className={styles.moduleNumber}>02</div>
                  <h3>ROS 2 - Robotic Nervous System</h3>
                  <p>Master nodes, topics, services, and URDF for humanoid robots.</p>
                  <Link to="/docs/module1-ros2/ros2-overview" className={styles.moduleLink}>
                    Explore Module →
                  </Link>
                </div>
              </div>

              <div className={clsx('col col--6', styles.moduleCard)}>
                <div className={styles.moduleContent}>
                  <div className={styles.moduleNumber}>03</div>
                  <h3>Gazebo & Unity Simulation</h3>
                  <p>Simulate robots in realistic environments before deploying to hardware.</p>
                  <Link to="/docs/module2-gazebo-unity/intro" className={styles.moduleLink}>
                    Explore Module →
                  </Link>
                </div>
              </div>

              <div className={clsx('col col--6', styles.moduleCard)}>
                <div className={styles.moduleContent}>
                  <div className={styles.moduleNumber}>04</div>
                  <h3>NVIDIA Isaac</h3>
                  <p>Leverage GPU-accelerated simulation and AI for robotics.</p>
                  <Link to="/docs/module3-isaac/intro" className={styles.moduleLink}>
                    Explore Module →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaContent}>
              <h2>Ready to Build the Future?</h2>
              <p>Join thousands of students learning to create intelligent robots</p>
              <Link
                className={clsx('button button--primary button--lg', styles.ctaButton)}
                to="/docs/module0-intro/what-is-physical-ai">
                Start Your Journey
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
