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
  // Using dev-login for testing (skips OTP verification)
  async login(email: string, password: string) {
    const response = await this.client.post<{
      success: boolean;
      data: {
        user: any;
        token: string;
        refreshToken?: string;
      };
    }>('/auth/dev-login', { email });

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

  async updateVendorStatus(id: string, status: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED') {
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

  // Vendor Dashboard Stats
  async getVendorDashboardStats() {
    return this.get('/stats/vendor/dashboard');
  }

  async getVendorEarnings(period?: 'week' | 'month' | 'quarter' | 'year') {
    return this.get('/stats/vendor/earnings', { params: { period } });
  }

  // Vendor Bookings/Orders
  async getVendorBookings(params?: { status?: string; page?: number; limit?: number }) {
    return this.get('/bookings/vendor', { params });
  }

  async updateBookingStatus(id: string, status: 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECLINED' | 'CANCELLED', note?: string) {
    return this.put(`/bookings/${id}/status`, { status, note });
  }

  // Store Listings - fetch listings for a specific store
  async getStoreListings(storeId: string, params?: { type?: string; status?: string }) {
    return this.get(`/stores/${storeId}`, { params });
  }

  // =====================
  // Listing CRUD Operations
  // =====================

  // Cleaning listings
  async createCleaningListing(data: {
    title: string;
    description?: string;
    cleaningType: string;
    basePrice: number;
    duration?: number;
    images?: string[];
  }) {
    return this.post('/cleaning', data);
  }

  async updateCleaningListing(id: string, data: object) {
    return this.put(`/cleaning/${id}`, data);
  }

  // Handyman listings
  async createHandymanListing(data: {
    title: string;
    description?: string;
    serviceType: string;
    basePrice: number;
    images?: string[];
  }) {
    return this.post('/handyman', data);
  }

  async updateHandymanListing(id: string, data: object) {
    return this.put(`/handyman/${id}`, data);
  }

  // Beauty service listings
  async createBeautyListing(data: {
    title: string;
    description?: string;
    serviceType: string;
    basePrice: number;
    duration?: number;
    images?: string[];
  }) {
    return this.post('/beauty', data);
  }

  async updateBeautyListing(id: string, data: object) {
    return this.put(`/beauty/${id}`, data);
  }

  // Food listings
  async createFoodListing(data: {
    title: string;
    description?: string;
    foodType: string;
    basePrice: number;
    images?: string[];
  }) {
    return this.post('/food', data);
  }

  async updateFoodListing(id: string, data: object) {
    return this.put(`/food/${id}`, data);
  }

  // Grocery listings
  async createGroceryListing(data: {
    name: string;
    description?: string;
    category: string;
    price: number;
    images?: string[];
  }) {
    return this.post('/groceries', data);
  }

  async updateGroceryListing(id: string, data: object) {
    return this.put(`/groceries/${id}`, data);
  }

  // Rental listings
  async createRentalListing(data: {
    title: string;
    description?: string;
    propertyType: string;
    pricePerMonth: number;
    images?: string[];
  }) {
    return this.post('/rentals', data);
  }

  async updateRentalListing(id: string, data: object) {
    return this.put(`/rentals/${id}`, data);
  }

  // Companionship listings
  async createCompanionshipListing(data: {
    title: string;
    description?: string;
    serviceType: string;
    hourlyRate: number;
    images?: string[];
  }) {
    return this.post('/companionship', data);
  }

  async updateCompanionshipListing(id: string, data: object) {
    return this.put(`/companionship/${id}`, data);
  }

  // Ride assistance listings
  async createRideAssistanceListing(data: {
    title: string;
    description?: string;
    vehicleType: string;
    pricePerKm: number;
    images?: string[];
  }) {
    return this.post('/ride-assistance', data);
  }

  async updateRideAssistanceListing(id: string, data: object) {
    return this.put(`/ride-assistance/${id}`, data);
  }

  // Generic listing methods (for admin use)
  async createListing(type: string, data: object) {
    const endpoints: Record<string, string> = {
      cleaning: '/cleaning',
      handyman: '/handyman',
      beauty: '/beauty',
      food: '/food',
      groceries: '/groceries',
      rentals: '/rentals',
      companionship: '/companionship',
      'ride-assistance': '/ride-assistance',
    };
    const endpoint = endpoints[type];
    if (!endpoint) throw new Error(`Unknown listing type: ${type}`);
    return this.post(endpoint, data);
  }

  async updateListing(type: string, id: string, data: object) {
    const endpoints: Record<string, string> = {
      cleaning: '/cleaning',
      handyman: '/handyman',
      beauty: '/beauty',
      food: '/food',
      groceries: '/groceries',
      rentals: '/rentals',
      companionship: '/companionship',
      'ride-assistance': '/ride-assistance',
    };
    const endpoint = endpoints[type];
    if (!endpoint) throw new Error(`Unknown listing type: ${type}`);
    return this.put(`${endpoint}/${id}`, data);
  }

  async deleteListing(type: string, id: string) {
    const endpoints: Record<string, string> = {
      cleaning: '/cleaning',
      handyman: '/handyman',
      beauty: '/beauty',
      food: '/food',
      groceries: '/groceries',
      rentals: '/rentals',
      companionship: '/companionship',
      'ride-assistance': '/ride-assistance',
    };
    const endpoint = endpoints[type];
    if (!endpoint) throw new Error(`Unknown listing type: ${type}`);
    return this.delete(`${endpoint}/${id}`);
  }

  // Admin - Reports/Moderation endpoints
  async getReportedListings(params?: { status?: string; page?: number; limit?: number }) {
    return this.get('/reports', { params });
  }

  async resolveReport(reportId: string, status: 'RESOLVED' | 'DISMISSED', resolution?: string) {
    return this.put(`/reports/${reportId}`, { status, resolution });
  }

  // Admin - Customer suspend/unsuspend
  async updateCustomerStatus(customerId: string, status: 'ACTIVE' | 'SUSPENDED') {
    return this.patch(`/admin/customers/${customerId}/status`, { status });
  }

  // Admin - Vendor suspend/unsuspend
  async suspendVendor(vendorId: string) {
    return this.patch(`/admin/vendors/${vendorId}/status`, { status: 'SUSPENDED' });
  }

  async unsuspendVendor(vendorId: string) {
    return this.patch(`/admin/vendors/${vendorId}/status`, { status: 'APPROVED' });
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for testing
export { ApiService };
