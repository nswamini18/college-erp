/**
 * University ERP Centralized API Client
 * Configurable base URL with JWT session management and safe network fallbacks.
 */

const PRIMARY_API_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
const FALLBACK_API_URL = 'http://localhost:5000/api';

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

    let url = `${PRIMARY_API_URL}${endpoint}`;

    try {
      let response: Response;
      try {
        response = await fetch(url, {
          ...options,
          headers
        });
      } catch (networkErr: any) {
        if (PRIMARY_API_URL === '/api') {
          console.warn(`[API CLIENT] Primary route ${url} failed (${networkErr.message}), retrying fallback ${FALLBACK_API_URL}${endpoint}`);
          url = `${FALLBACK_API_URL}${endpoint}`;
          response = await fetch(url, {
            ...options,
            headers
          });
        } else {
          throw networkErr;
        }
      }

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
    const res = await this.request<{ success: boolean; token: string; user: any; message?: string }>('/auth/login', {
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

  // Registration Endpoints
  async getRegistrationOptions() {
    return this.request<{
      success: boolean;
      data: {
        departments: Array<{ department_id: number; department_name: string; branch_code: string }>;
        designations: Array<{ designation_id: number; designation_name: string; category: string }>;
        sections: Array<{ section_id: number; section_name: string; department_id: number }>;
      };
    }>('/auth/registration-options');
  }

  async registerStudent(payload: any) {
    return this.request<{ success: boolean; message: string; student: any }>('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async registerFaculty(payload: any) {
    return this.request<{ success: boolean; message: string; faculty: any }>('/auth/register/faculty', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Student Endpoints
  async getStudentProfile() {
    return this.request<{ success: boolean; data: any }>('/students/profile');
  }

  async getStudentDashboard() {
    return this.request<{ success: boolean; data: any }>('/students/dashboard');
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

  async getFacultyAttendance(queryString?: string) {
    const url = queryString ? `/faculty/attendance?${queryString}` : '/faculty/attendance';
    return this.request<{ success: boolean; data: any }>(url);
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

  // Faculty Timetable Operations
  async getFacultyTimetable() {
    return this.request<{ success: boolean; data: any[] }>('/faculty/timetable');
  }

  async createFacultyTimetable(payload: any) {
    return this.request<{ success: boolean; message: string; timetable_id: number }>('/faculty/timetable', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateFacultyTimetable(id: number, payload: any) {
    return this.request<{ success: boolean; message: string }>(`/faculty/timetable/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteFacultyTimetable(id: number) {
    return this.request<{ success: boolean; message: string }>(`/faculty/timetable/${id}`, {
      method: 'DELETE'
    });
  }

  // Faculty Preview Mode (Demonstration Student View)
  async getFacultyStudentPreview(studentId: number) {
    return this.request<{
      success: boolean;
      previewMode: boolean;
      notice: string;
      student: any;
      attendance: any[];
      timetable: any[];
      feeSummary: any;
    }>(`/faculty/preview-student/${studentId}`);
  }

  // ─────────────────────────────────────────────
  // Staff Shared
  // ─────────────────────────────────────────────
  async getStaffProfile() { return this.request<{ success: boolean; data: any }>('/staff/profile'); }

  // ─────────────────────────────────────────────
  // TNP Head
  // ─────────────────────────────────────────────
  async getTNPDashboard() { return this.request<{ success: boolean; data: any }>('/staff/tnp/dashboard'); }
  async getTNPCompanies() { return this.request<{ success: boolean; data: any[] }>('/staff/tnp/companies'); }
  async addCompany(payload: any) { return this.request<{ success: boolean; message: string; data: any }>('/staff/tnp/companies', { method: 'POST', body: JSON.stringify(payload) }); }
  async updateCompany(id: number, payload: any) { return this.request<{ success: boolean; message: string }>(`/staff/tnp/companies/${id}`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async getTNPDrives() { return this.request<{ success: boolean; data: any[] }>('/staff/tnp/drives'); }
  async addDrive(payload: any) { return this.request<{ success: boolean; message: string; drive_id: number }>('/staff/tnp/drives', { method: 'POST', body: JSON.stringify(payload) }); }
  async updateDriveStatus(id: number, status: string) { return this.request<{ success: boolean; message: string }>(`/staff/tnp/drives/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); }
  async getTNPApplications(driveId?: number, status?: string) {
    const q = new URLSearchParams();
    if (driveId) q.append('drive_id', String(driveId));
    if (status) q.append('status', status);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/staff/tnp/applications${qs}`);
  }
  async shortlistApplication(id: number, payload: any) { return this.request<{ success: boolean; message: string }>(`/staff/tnp/applications/${id}/shortlist`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async getTNPPlacements() { return this.request<{ success: boolean; data: any[] }>('/staff/tnp/placements'); }

  // ─────────────────────────────────────────────
  // Finance Officer
  // ─────────────────────────────────────────────
  async getFinanceDashboard() { return this.request<{ success: boolean; data: any }>('/staff/finance/dashboard'); }
  async getStudentsWithFees(params?: { dept?: number | string; search?: string; status?: string } | number) {
    if (typeof params === 'number') {
      return this.request<{ success: boolean; data: any[] }>(`/staff/finance/students?dept=${params}`);
    }
    const q = new URLSearchParams();
    if (params?.dept) q.append('dept', String(params.dept));
    if (params?.search) q.append('search', params.search);
    if (params?.status) q.append('status', params.status);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/staff/finance/students${qs}`);
  }
  async getStudentFeeDetails(studentId: number) { return this.request<{ success: boolean; data: any }>(`/staff/finance/fees/${studentId}`); }
  async recordPayment(studentFeeId: number, payload: any) { return this.request<{ success: boolean; message: string; data?: any }>(`/staff/finance/fees/${studentFeeId}/payment`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async getFeeStructures() { return this.request<{ success: boolean; data: any[] }>('/staff/finance/fee-structures'); }
  async addFeeStructure(payload: any) { return this.request<{ success: boolean; message: string }>('/staff/finance/fee-structures', { method: 'POST', body: JSON.stringify(payload) }); }
  async getAllPayments() { return this.request<{ success: boolean; data: any[] }>('/staff/finance/payments'); }

  // ─────────────────────────────────────────────
  // Librarian
  // ─────────────────────────────────────────────
  async getLibraryDashboard() { return this.request<{ success: boolean; data: any }>('/staff/library/dashboard'); }
  async getLibraryBooks(search?: string, category?: string) {
    const q = new URLSearchParams();
    if (search) q.append('search', search);
    if (category) q.append('category', category);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/staff/library/books${qs}`);
  }
  async addBook(payload: any) { return this.request<{ success: boolean; message: string }>('/staff/library/books', { method: 'POST', body: JSON.stringify(payload) }); }
  async updateBook(isbn: string, payload: any) { return this.request<{ success: boolean; message: string }>(`/staff/library/books/${isbn}`, { method: 'PUT', body: JSON.stringify(payload) }); }
  async getLibraryIssues(status?: string, studentId?: number) {
    const q = new URLSearchParams();
    if (status) q.append('status', status);
    if (studentId) q.append('student_id', String(studentId));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<{ success: boolean; data: any[] }>(`/staff/library/issues${qs}`);
  }
  async issueBook(payload: any) { return this.request<{ success: boolean; message: string; issue_id?: number }>('/staff/library/issues', { method: 'POST', body: JSON.stringify(payload) }); }
  async returnBook(issueId: number, payload?: any) {
    return this.request<{ success: boolean; message: string }>(`/staff/library/issues/${issueId}/return`, {
      method: 'PUT',
      ...(payload ? { body: JSON.stringify(payload) } : {})
    });
  }
  async getOverdueBooks() { return this.request<{ success: boolean; data: any[] }>('/staff/library/overdue'); }
}

export const api = new ApiClient();
export default api;
