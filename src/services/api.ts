const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    name: string;
    role: string;
    email: string;
  };
  token: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayPatients: number;
  todaySales: number;
  monthlyRegistrations: number;
  dailySales: Array<{
    name: string;
    sales: number;
    registrations: number;
  }>;
  monthlyData: Array<{
    month: string;
    sales: number;
    registrations: number;
  }>;
  programData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    patient: string;
    time: string;
  }>;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    phone: string;
    username: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken(token: string): Promise<ApiResponse<{ user: any }>> {
    return this.makeRequest<{ user: any }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats(params?: { dateRange?: string; selectedDate?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest<any>(`/dashboard/stats${queryParams}`);
  }

  async getSalesReport(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/dashboard/sales-report');
  }

  async getHourlyRegistrations(params?: { selectedDate?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest<any>(`/dashboard/hourly-registrations${queryParams}`);
  }

  async getHourlySales(params?: { selectedDate?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest<any>(`/dashboard/hourly-sales${queryParams}`);
  }

  async getAgeGroups(params?: { selectedDate?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest<any>(`/dashboard/age-groups${queryParams}`);
  }

  async getMonthlySales(params?: { year?: string; month?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest<any>(`/dashboard/monthly-sales${queryParams}`);
  }

  async getDepartmentSales(params?: { year?: string; month?: string; department?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest<any>(`/dashboard/department-sales${queryParams}`);
  }

  async getMonthlyVisits(params?: { year?: string; month?: string }): Promise<ApiResponse<any>> {
    const queryParams = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest<any>(`/dashboard/monthly-visits${queryParams}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
