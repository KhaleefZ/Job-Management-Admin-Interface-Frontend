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
    const url = `${this.baseUrl}${endpoint}`;
    
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

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      console.log('✅ Backend connection test:', data);
      return response.ok;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
  }

  // Simple jobs fetch without relationships
  async getJobsSimple() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs?simple=true&no_embed=true`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('✅ Simple jobs fetch:', data);
      return data;
    } catch (error) {
      console.error('❌ Simple jobs fetch failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, role: string = 'candidate') {
    return this.request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getProfile() {
    return this.request<User>('/api/auth/profile');
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
    
    // Add parameter to avoid relationship embedding issues
    searchParams.append('simple', 'true');
    
    const queryString = searchParams.toString();
    return this.request<{ jobs: Job[]; total: number; page: number; totalPages: number }>(
      `/api/jobs${queryString ? `?${queryString}` : ''}`
    );
  }

  async getJob(id: string) {
    return this.request<Job>(`/api/jobs/${id}`);
  }

  async createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<Job>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: string, updates: Partial<Job>) {
    return this.request<Job>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteJob(id: string) {
    return this.request<{ message: string }>(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyJobs() {
    return this.request<Job[]>('/api/jobs/my-jobs');
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
    return this.request<{ message: string; application: Application }>(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async submitApplication(applicationData: {
    jobId: string;
    jobTitle: string;
    company: string;
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    currentCompany: string;
    currentRole: string;
    noticePeriod: string;
    expectedSalary: string;
    coverLetter?: string;
    linkedinProfile?: string;
    portfolioWebsite?: string;
    whyInterested: string;
    availableForInterview: string;
  }, resumeFile: File) {
    const url = `${this.baseUrl}/api/applications`;
    
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.entries(applicationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    // Add resume file
    formData.append('resume', resumeFile);
    
    const config: RequestInit = {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - let the browser set it with boundary
    };

    // Add auth token if available (for FormData requests)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      console.log('Submitting application to:', url);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        console.error('Application submission failed:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Application submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  async getJobApplications(jobId: string) {
    return this.request<Application[]>(`/api/jobs/${jobId}/applications`);
  }

  async getApplications(params?: { status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    
    const queryString = searchParams.toString();
    return this.request<Application[]>(`/api/applications${queryString ? `?${queryString}` : ''}`);
  }

  async updateApplicationStatus(id: string, status: string) {
    return this.request<Application>(`/api/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Job likes methods
  async likeJob(jobId: string) {
    return this.request<{ message: string; isLiked: boolean; likesCount: number }>(`/api/jobs/${jobId}/like`, {
      method: 'POST',
    });
  }

  async unlikeJob(jobId: string) {
    return this.request<{ message: string; isLiked: boolean; likesCount: number }>(`/api/jobs/${jobId}/like`, {
      method: 'DELETE',
    });
  }

  async getJobLikeStatus(jobId: string) {
    return this.request<{ isLiked: boolean; likesCount: number }>(`/api/jobs/${jobId}/like`);
  }

  // Admin methods
  async getUsers() {
    return this.request<User[]>('/api/users');
  }

  async getAdminStats() {
    return this.request<{
      totalJobs: number;
      totalApplications: number;
      totalUsers: number;
      recentActivity: any[];
    }>('/api/admin/stats');
  }

  async getAdminReports() {
    return this.request<{
      jobsByType: any[];
      applicationsByStatus: any[];
      usersByRole: any[];
    }>('/api/admin/reports');
  }
}

export const apiClient = new ApiClient();
export default apiClient;