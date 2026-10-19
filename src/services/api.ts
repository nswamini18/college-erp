/**
 * University ERP Centralized API Client
 * Configurable base URL with JWT session management and safe network fallbacks.
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('college_erp_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...(options.headers || {})
    };

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err: any) {
      console.warn(`[API CLIENT] Network request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  async login(identifier: string, password: string, role?: string) {
    const res = await this.request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, role })
    });
    if (res.token) {
      localStorage.setItem('college_erp_token', res.token);
    }
    return res;
  }

  async getCurrentUser() {
    return this.request<{ success: boolean; user: any }>('/auth/me');
  }

  logout() {
    localStorage.removeItem('college_erp_token');
    localStorage.removeItem('college_erp_user');
  }

  // Student Endpoints
  async getStudentProfile() {
    return this.request<{ success: boolean; data: any }>('/students/profile');
  }

  async getStudentAttendance() {
    return this.request<{ success: boolean; data: any }>('/students/attendance');
  }

  async getStudentFees() {
    return this.request<{ success: boolean; data: any }>('/students/fees');
  }

  async getStudentLibrary() {
    return this.request<{ success: boolean; data: any }>('/students/library');
  }

  async getStudentExams() {
    return this.request<{ success: boolean; data: any }>('/students/exams');
  }

  async applyStudentExam(applicationData: { type: string; semester: string; subject_code?: string }) {
    return this.request<{ success: boolean; data: any }>('/students/exams/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  }

  async getStudentResults() {
    return this.request<{ success: boolean; data: any }>('/students/results');
  }

  async getStudentPlacement() {
    return this.request<{ success: boolean; data: any }>('/students/placement');
  }

  async applyStudentJobDrive(drive_id: number) {
    return this.request<{ success: boolean; message: string }>('/students/placement/apply', {
      method: 'POST',
      body: JSON.stringify({ drive_id })
    });
  }

  // Faculty Endpoints
  async getFacultyProfile() {
    return this.request<{ success: boolean; data: any }>('/faculty/profile');
  }

  async getFacultyDashboard() {
    return this.request<{ success: boolean; data: any }>('/faculty/dashboard');
  }

  async getFacultyAttendance() {
    return this.request<{ success: boolean; data: any }>('/faculty/attendance');
  }

  async saveFacultyAttendance(payload: any) {
    return this.request<{ success: boolean; sessionId: any }>('/faculty/attendance', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getFacultyGrading() {
    return this.request<{ success: boolean; data: any }>('/faculty/grading');
  }

  async saveFacultyGrading(payload: any) {
    return this.request<{ success: boolean; message: string }>('/faculty/grading', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getFacultyLeave() {
    return this.request<{ success: boolean; data: any }>('/faculty/leave');
  }

  async applyFacultyLeave(payload: any) {
    return this.request<{ success: boolean; data: any }>('/faculty/leave', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getFacultyPayroll() {
    return this.request<{ success: boolean; data: any }>('/faculty/payroll');
  }
}

export const api = new ApiClient();
export default api;
