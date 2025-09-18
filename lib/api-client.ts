// API client for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  status: string;
  posted_by: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  resume_url?: string;
  applied_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    console.log('API Client - Token from localStorage:', token);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
      console.log('API Client - Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('API Client - No token found in localStorage');
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, role: string = 'candidate') {
    return this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getProfile() {
    return this.request<User>('/auth/profile');
  }

  // Jobs methods
  async getJobs(params?: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    job_type?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{ jobs: Job[]; total: number; page: number; totalPages: number }>(
      `/jobs${queryString ? `?${queryString}` : ''}`
    );
  }

  async getJob(id: string) {
    return this.request<Job>(`/jobs/${id}`);
  }

  async createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: string, updates: Partial<Job>) {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteJob(id: string) {
    return this.request<{ message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyJobs() {
    return this.request<Job[]>('/jobs/my-jobs');
  }

  // Applications methods
  async applyToJob(jobId: string, applicationData: {
    full_name: string;
    email: string;
    phone?: string;
    cover_letter?: string;
    resume_url?: string;
    resume_filename?: string;
  }) {
    return this.request<{ message: string; application: Application }>(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getJobApplications(jobId: string) {
    return this.request<Application[]>(`/jobs/${jobId}/applications`);
  }

  async getApplications(params?: { status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    
    const queryString = searchParams.toString();
    return this.request<Application[]>(`/applications${queryString ? `?${queryString}` : ''}`);
  }

  async updateApplicationStatus(id: string, status: string) {
    return this.request<Application>(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Job likes methods
  async likeJob(jobId: string) {
    return this.request<{ message: string; isLiked: boolean; likesCount: number }>(`/jobs/${jobId}/like`, {
      method: 'POST',
    });
  }

  async unlikeJob(jobId: string) {
    return this.request<{ message: string; isLiked: boolean; likesCount: number }>(`/jobs/${jobId}/like`, {
      method: 'DELETE',
    });
  }

  async getJobLikeStatus(jobId: string) {
    return this.request<{ isLiked: boolean; likesCount: number }>(`/jobs/${jobId}/like`);
  }

  // Admin methods
  async getUsers() {
    return this.request<User[]>('/users');
  }

  async getAdminStats() {
    return this.request<{
      totalJobs: number;
      totalApplications: number;
      totalUsers: number;
      recentActivity: any[];
    }>('/admin/stats');
  }

  async getAdminReports() {
    return this.request<{
      jobsByType: any[];
      applicationsByStatus: any[];
      usersByRole: any[];
    }>('/admin/reports');
  }
}

export const apiClient = new ApiClient();
export default apiClient;