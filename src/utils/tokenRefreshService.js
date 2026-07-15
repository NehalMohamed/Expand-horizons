// tokenRefreshService.js
import { manualTokenRefresh } from './axiosInterceptor';
import { jwtDecode } from 'jwt-decode';

class TokenRefreshService {
  constructor() {
    this.refreshTimer = null;
  }

  start() {
    this.scheduleTokenRefresh();
    console.log('🔄 Token refresh service started');
  }

  stop() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    console.log('🛑 Token refresh service stopped');
  }

  scheduleTokenRefresh() {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      console.log('Token expiry:', {
        expiresAt: new Date(expiresAt),
        now: new Date(now),
        timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + ' seconds'
      });

      const refreshBuffer = 30 * 1000; // 30 seconds before expiry
      const refreshTime = timeUntilExpiry - refreshBuffer;

      if (refreshTime <= 0) {
        console.log('Token about to expire, refreshing now...');
        this.refreshToken();
        return;
      }

      console.log(`⏰ Scheduling refresh in ${Math.round(refreshTime / 1000)} seconds`);
      
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }

      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);

    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  }

  async refreshToken() {
    try {
      console.log('🔄 Starting automatic token refresh...');
      await manualTokenRefresh();
      console.log('✅ Automatic token refresh successful');
      this.scheduleTokenRefresh(); // Schedule next refresh
    } catch (error) {
      console.error('❌ Automatic token refresh failed:', error);
      setTimeout(() => this.scheduleTokenRefresh(), 10000);
    }
  }
}

export const tokenRefreshService = new TokenRefreshService();
