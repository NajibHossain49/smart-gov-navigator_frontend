import api from './axios'
import type {
  AuthResponse, User, Category, Service, PaginatedServices,
  GovernmentOffice, Bookmark, Feedback, EligibilityAnswer,
  EligibilityResult, DashboardStats,
} from '@/types'

// ── Auth ────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ success: boolean; data: User }>('/auth/me'),
}

// ── Users ───────────────────────────────────────────────
export const userApi = {
  getProfile: () => api.get<{ success: boolean; data: User }>('/users/profile'),

  updateProfile: (data: { name?: string; password?: string }) =>
    api.put<{ success: boolean; data: User }>('/users/profile', data),

  deleteAccount: () => api.delete('/users/account'),

  getRecentlyViewed: () =>
    api.get<{ success: boolean; data: { services: Service[] } }>('/users/recently-viewed'),

  clearRecentlyViewed: () => api.delete('/users/recently-viewed'),
}

// ── Categories ──────────────────────────────────────────
export const categoryApi = {
  getAll: () =>
    api.get<{ success: boolean; data: Category[] }>('/categories'),

  getById: (id: number) =>
    api.get<{ success: boolean; data: Category }>(`/categories/${id}`),

  // Admin
  create: (data: { name: string; description?: string }) =>
    api.post('/admin/categories', data),

  update: (id: number, data: { name?: string; description?: string }) =>
    api.put(`/admin/categories/${id}`, data),

  delete: (id: number) => api.delete(`/admin/categories/${id}`),
}

// ── Services ────────────────────────────────────────────
export const serviceApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<{ success: boolean; data: PaginatedServices }>(`/services?page=${page}&limit=${limit}`),

  getById: (id: number) =>
    api.get<{ success: boolean; data: Service }>(`/services/${id}`),

  search: (q: string) =>
    api.get<{ success: boolean; data: Service[] }>(`/services/search?q=${encodeURIComponent(q)}`),

  getByCategory: (categoryId: number) =>
    api.get<{ success: boolean; data: { category: Category; services: Service[] } }>(
      `/services/category/${categoryId}`
    ),

  getSteps: (id: number) =>
    api.get(`/services/${id}/steps`),

  getDocuments: (id: number) =>
    api.get(`/services/${id}/documents`),

  getOffices: (id: number) =>
    api.get(`/services/${id}/offices`),

  getFeedbacks: (id: number, page = 1) =>
    api.get(`/services/${id}/feedbacks?page=${page}`),

  getRelated: (id: number) =>
    api.get<{ success: boolean; data: { related_services: Service[] } }>(`/services/${id}/related`),

  getEligibilityRules: (id: number) =>
    api.get(`/services/${id}/eligibility-rules`),

  checkEligibility: (id: number, answers: EligibilityAnswer[]) =>
    api.post<{ success: boolean; data: EligibilityResult }>(
      `/services/${id}/check-eligibility`,
      { answers }
    ),

  // Admin
  create: (data: Partial<Service>) => api.post('/admin/services', data),
  update: (id: number, data: Partial<Service>) => api.put(`/admin/services/${id}`, data),
  delete: (id: number) => api.delete(`/admin/services/${id}`),
}

// ── Offices ─────────────────────────────────────────────
export const officeApi = {
  getAll: (params?: { district?: string; upazila?: string }) =>
    api.get<{ success: boolean; data: GovernmentOffice[] }>('/offices', { params }),

  getById: (id: number) =>
    api.get<{ success: boolean; data: GovernmentOffice }>(`/offices/${id}`),
}

// ── Bookmarks ───────────────────────────────────────────
export const bookmarkApi = {
  getAll: () =>
    api.get<{ success: boolean; data: { bookmarks: Bookmark[] } }>('/bookmarks'),

  add: (service_id: number) =>
    api.post<{ success: boolean; data: Bookmark }>('/bookmarks', { service_id }),

  remove: (id: number) => api.delete(`/bookmarks/${id}`),
}

// ── Feedbacks ───────────────────────────────────────────
export const feedbackApi = {
  create: (data: { service_id: number; rating: number; comment?: string }) =>
    api.post<{ success: boolean; data: Feedback }>('/feedbacks', data),

  update: (id: number, data: { rating?: number; comment?: string }) =>
    api.put(`/feedbacks/${id}`, data),

  delete: (id: number) => api.delete(`/feedbacks/${id}`),
}

// ── Admin ───────────────────────────────────────────────
export const adminApi = {
  getDashboardStats: () =>
    api.get<{ success: boolean; data: DashboardStats }>('/admin/stats/dashboard'),

  getAllUsers: (params?: { page?: number; limit?: number; search?: string; is_active?: boolean }) =>
    api.get('/admin/users', { params }),

  toggleUserStatus: (id: number) =>
    api.patch(`/admin/users/${id}/toggle-status`),

  changeUserRole: (id: number, role_name: string) =>
    api.patch(`/admin/users/${id}/change-role`, { role_name }),

  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),

  getAllFeedbacks: () =>
    api.get('/admin/feedbacks'),

  deleteFeedback: (id: number) =>
    api.delete(`/admin/feedbacks/${id}`),

  getServiceStats: (id: number) =>
    api.get(`/admin/stats/services/${id}`),
}
