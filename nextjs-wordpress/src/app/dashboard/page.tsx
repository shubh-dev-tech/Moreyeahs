'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.welcomeCard}>
          <h2>Welcome, {user.display_name}!</h2>
          <p>You are successfully authenticated.</p>
        </div>

        <div className={styles.userInfo}>
          <h3>User Information</h3>
          <dl>
            <dt>Username:</dt>
            <dd>{user.username}</dd>
            
            <dt>Email:</dt>
            <dd>{user.email}</dd>
            
            <dt>User ID:</dt>
            <dd>{user.id}</dd>
            
            <dt>Roles:</dt>
            <dd>{user.roles.join(', ')}</dd>
          </dl>
        </div>

        <div className={styles.securityInfo}>
          <h3>Security Status</h3>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}>🔒</span>
            <div>
              <strong>JWT Authentication</strong>
              <p>Your session is secured with JWT tokens</p>
            </div>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}>🛡️</span>
            <div>
              <strong>Nonce Protection</strong>
              <p>All requests are protected with WordPress nonces</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
