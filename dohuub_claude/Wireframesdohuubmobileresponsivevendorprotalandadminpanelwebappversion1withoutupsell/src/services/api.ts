import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private client: AxiosInstance;
  private tokenKey = 'dohuub_auth_token';
  private refreshTokenKey = 'dohuub_refresh_token';

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearTokens();
          // Optionally redirect to login
          // window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data ?? response.data as T;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data ?? response.data as T;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data.data ?? response.data as T;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data ?? response.data as T;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data ?? response.data as T;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post<{
      success: boolean;
      data: {
        user: any;
        token: string;
        refreshToken?: string;
      };
    }>('/auth/login', { email, password });

    if (response.data.success && response.data.data.token) {
      this.setToken(response.data.data.token);
      if (response.data.data.refreshToken) {
        this.setRefreshToken(response.data.data.refreshToken);
      }
    }

    return response.data;
  }

  async register(data: { email: string; password: string; name: string; role?: string }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async logout() {
    this.clearTokens();
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }

  // Admin - Vendor endpoints
  async getVendors(params?: { status?: string; page?: number; limit?: number }) {
    return this.get('/admin/vendors', { params });
  }

  async getVendorById(id: string) {
    return this.get(`/admin/vendors/${id}`);
  }

  async updateVendorStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'APPROVED' | 'REJECTED') {
    return this.patch(`/admin/vendors/${id}/status`, { status });
  }

  // Admin - Listing endpoints
  async getListings(params?: { type?: string; status?: string; vendorId?: string }) {
    return this.get('/admin/listings', { params });
  }

  async updateListingStatus(type: string, id: string, status: 'ACTIVE' | 'INACTIVE' | 'FLAGGED') {
    return this.patch(`/admin/listings/${type}/${id}/status`, { status });
  }

  // Admin - Order endpoints
  async getOrders(params?: { status?: string; page?: number }) {
    return this.get('/admin/orders', { params });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.patch(`/admin/orders/${id}/status`, { status });
  }

  // Vendor - Store endpoints
  async getMyStores() {
    return this.get('/stores/my');
  }

  async createStore(data: FormData | object) {
    const isFormData = data instanceof FormData;
    return this.post('/stores', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  }

  async getStoreById(id: string) {
    return this.get(`/stores/${id}`);
  }

  async updateStore(id: string, data: FormData | object) {
    const isFormData = data instanceof FormData;
    return this.put(`/stores/${id}`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  }

  async deleteStore(id: string) {
    return this.delete(`/stores/${id}`);
  }

  async activateStore(id: string) {
    return this.patch(`/stores/${id}/activate`, {});
  }

  async deactivateStore(id: string) {
    return this.patch(`/stores/${id}/deactivate`, {});
  }

  async assignStoreRegions(storeId: string, regionIds: string[]) {
    return this.post(`/stores/${storeId}/regions`, { regionIds });
  }

  // File upload endpoints
  async uploadImage(file: File, type: string = 'general') {
    const formData = new FormData();
    formData.append('image', file);

    return this.post(`/upload/image?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async uploadImages(files: File[], type: string = 'general') {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    return this.post(`/upload/images?type=${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteFile(fileId: string, bucket: string = 'uploads') {
    return this.delete(`/upload/${fileId}?bucket=${bucket}`);
  }

  // Settings endpoints
  async getVendorSettings() {
    return this.get('/settings/vendor');
  }

  async updateVendorSettings(data: object) {
    return this.put('/settings/vendor', data);
  }

  async getAdminSettings() {
    return this.get('/settings/admin');
  }

  async updateAdminSettings(data: object) {
    return this.put('/settings/admin', data);
  }

  // Regions
  async getRegions() {
    return this.get('/regions');
  }

  // Dashboard Stats
  async getAdminDashboardStats() {
    return this.get('/stats/admin/dashboard');
  }

  async getVendorDashboardStats() {
    return this.get('/stats/vendor/dashboard');
  }

  // Michelle Profiles
  async getMichelleProfiles(params?: { category?: string; status?: string }) {
    return this.get('/admin/michelle-profiles', { params });
  }

  async getMichelleProfileById(id: string) {
    return this.get(`/admin/michelle-profiles/${id}`);
  }

  async createMichelleProfile(data: object) {
    return this.post('/admin/michelle-profiles', data);
  }

  async updateMichelleProfile(id: string, data: object) {
    return this.put(`/admin/michelle-profiles/${id}`, data);
  }

  async deleteMichelleProfile(id: string) {
    return this.delete(`/admin/michelle-profiles/${id}`);
  }

  async getMichelleProfileListings(profileId: string) {
    return this.get(`/admin/michelle-profiles/${profileId}/listings`);
  }

  async getMichelleProfileAnalytics(profileId: string, params?: { dateRange?: string }) {
    return this.get(`/admin/michelle-profiles/${profileId}/analytics`, { params });
  }

  // Listing CRUD - Food
  async createFoodListing(data: object) {
    return this.post('/food', data);
  }

  async getFoodListings(params?: object) {
    return this.get('/food', { params });
  }

  async getFoodListingById(id: string) {
    return this.get(`/food/${id}`);
  }

  async updateFoodListing(id: string, data: object) {
    return this.put(`/food/${id}`, data);
  }

  async deleteFoodListing(id: string) {
    return this.delete(`/food/${id}`);
  }

  // Listing CRUD - Beauty Products
  async createBeautyProductListing(data: object) {
    return this.post('/beauty-products', data);
  }

  async getBeautyProductListings(params?: object) {
    return this.get('/beauty-products', { params });
  }

  async getBeautyProductListingById(id: string) {
    return this.get(`/beauty-products/${id}`);
  }

  async updateBeautyProductListing(id: string, data: object) {
    return this.put(`/beauty-products/${id}`, data);
  }

  async deleteBeautyProductListing(id: string) {
    return this.delete(`/beauty-products/${id}`);
  }

  // Listing CRUD - Ride Assistance
  async createRideAssistanceListing(data: object) {
    return this.post('/ride-assistance', data);
  }

  async getRideAssistanceListings(params?: object) {
    return this.get('/ride-assistance', { params });
  }

  async getRideAssistanceListingById(id: string) {
    return this.get(`/ride-assistance/${id}`);
  }

  async updateRideAssistanceListing(id: string, data: object) {
    return this.put(`/ride-assistance/${id}`, data);
  }

  async deleteRideAssistanceListing(id: string) {
    return this.delete(`/ride-assistance/${id}`);
  }

  // Listing CRUD - Companionship
  async createCompanionshipListing(data: object) {
    return this.post('/companionship', data);
  }

  async getCompanionshipListings(params?: object) {
    return this.get('/companionship', { params });
  }

  async getCompanionshipListingById(id: string) {
    return this.get(`/companionship/${id}`);
  }

  async updateCompanionshipListing(id: string, data: object) {
    return this.put(`/companionship/${id}`, data);
  }

  async deleteCompanionshipListing(id: string) {
    return this.delete(`/companionship/${id}`);
  }

  // Listing CRUD - Cleaning
  async createCleaningListing(data: object) {
    return this.post('/cleaning', data);
  }

  async getCleaningListings(params?: object) {
    return this.get('/cleaning', { params });
  }

  async getCleaningListingById(id: string) {
    return this.get(`/cleaning/${id}`);
  }

  async updateCleaningListing(id: string, data: object) {
    return this.put(`/cleaning/${id}`, data);
  }

  async deleteCleaningListing(id: string) {
    return this.delete(`/cleaning/${id}`);
  }

  // Listing CRUD - Handyman
  async createHandymanListing(data: object) {
    return this.post('/handyman', data);
  }

  async getHandymanListings(params?: object) {
    return this.get('/handyman', { params });
  }

  async getHandymanListingById(id: string) {
    return this.get(`/handyman/${id}`);
  }

  async updateHandymanListing(id: string, data: object) {
    return this.put(`/handyman/${id}`, data);
  }

  async deleteHandymanListing(id: string) {
    return this.delete(`/handyman/${id}`);
  }

  // Listing CRUD - Beauty Services
  async createBeautyListing(data: object) {
    return this.post('/beauty', data);
  }

  async getBeautyListings(params?: object) {
    return this.get('/beauty', { params });
  }

  async getBeautyListingById(id: string) {
    return this.get(`/beauty/${id}`);
  }

  async updateBeautyListing(id: string, data: object) {
    return this.put(`/beauty/${id}`, data);
  }

  async deleteBeautyListing(id: string) {
    return this.delete(`/beauty/${id}`);
  }

  // Listing CRUD - Groceries
  async createGroceryListing(data: object) {
    return this.post('/groceries', data);
  }

  async getGroceryListings(params?: object) {
    return this.get('/groceries', { params });
  }

  async getGroceryListingById(id: string) {
    return this.get(`/groceries/${id}`);
  }

  async updateGroceryListing(id: string, data: object) {
    return this.put(`/groceries/${id}`, data);
  }

  async deleteGroceryListing(id: string) {
    return this.delete(`/groceries/${id}`);
  }

  // Listing CRUD - Rentals
  async createRentalListing(data: object) {
    return this.post('/rentals', data);
  }

  async getRentalListings(params?: object) {
    return this.get('/rentals', { params });
  }

  async getRentalListingById(id: string) {
    return this.get(`/rentals/${id}`);
  }

  async updateRentalListing(id: string, data: object) {
    return this.put(`/rentals/${id}`, data);
  }

  async deleteRentalListing(id: string) {
    return this.delete(`/rentals/${id}`);
  }

  // Reports & Analytics
  async getPlatformReports(params?: { dateRange?: string }) {
    return this.get('/admin/reports/platform', { params });
  }

  async exportPlatformReport(format: 'csv' | 'pdf', params?: object) {
    return this.get(`/admin/reports/platform/export?format=${format}`, { params });
  }

  // Customers
  async getCustomers(params?: { status?: string; search?: string }) {
    return this.get('/admin/customers', { params });
  }

  async getCustomerById(id: string) {
    return this.get(`/admin/customers/${id}`);
  }

  async updateCustomerStatus(id: string, status: string) {
    return this.patch(`/admin/customers/${id}/status`, { status });
  }

  // Reviews
  async getReviews(params?: { rating?: number; status?: string }) {
    return this.get('/admin/reviews', { params });
  }

  async flagReview(id: string, reason: string) {
    return this.post(`/admin/reviews/${id}/flag`, { reason });
  }

  async deleteReview(id: string) {
    return this.delete(`/admin/reviews/${id}`);
  }

  // Reports (Moderation)
  async getReportedContent(params?: { status?: string; type?: string }) {
    return this.get('/admin/reports', { params });
  }

  async updateReportStatus(id: string, status: string, resolution?: string) {
    return this.patch(`/admin/reports/${id}/status`, { status, resolution });
  }

  // Notifications
  async sendPushNotification(data: { title: string; body: string; targetType: string; targetIds?: string[] }) {
    return this.post('/admin/push-notifications', data);
  }

  async getNotificationHistory() {
    return this.get('/admin/notifications/history');
  }

  // Subscriptions
  async getSubscriptionPlans() {
    return this.get('/subscriptions/plans');
  }

  async getCurrentSubscription() {
    return this.get('/subscriptions/current');
  }

  async changePlan(planId: string) {
    return this.post('/subscriptions/change-plan', { planId });
  }

  async updatePaymentMethod(paymentMethodId: string) {
    return this.put('/subscriptions/payment-method', { paymentMethodId });
  }

  async cancelSubscription(reason?: string) {
    return this.post('/subscriptions/cancel', { reason });
  }

  async getInvoices() {
    return this.get('/subscriptions/invoices');
  }

  // Store Listings
  async getStoreListings(storeId: string, params?: object) {
    return this.get(`/stores/${storeId}/listings`, { params });
  }

  // Vendor Orders
  async getVendorOrders(params?: { status?: string }) {
    return this.get('/orders', { params });
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for testing
export { ApiService };
