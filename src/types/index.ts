// ── Auth ────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  role: { role_name: 'Admin' | 'User' }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ── Category ────────────────────────────────────────────
export interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
  _count?: { services: number }
}

// ── Service ─────────────────────────────────────────────
export interface Service {
  id: number
  category_id: number
  title: string
  description: string | null
  application_process: string | null
  fees: string | null
  processing_time: string | null
  view_count: number
  created_at: string
  updated_at: string
  category?: { id: number; name: string }
  steps?: ServiceStep[]
  required_documents?: RequiredDocument[]
  service_offices?: ServiceOffice[]
  feedbacks?: Feedback[]
  eligibility_rules?: EligibilityRule[]
  _count?: { feedbacks: number; bookmarks: number }
}

export interface ServiceStep {
  id: number
  service_id: number
  step_number: number
  step_title: string
  step_description: string | null
}

export interface RequiredDocument {
  id: number
  service_id: number
  document_name: string
  description: string | null
}

// ── Office ──────────────────────────────────────────────
export interface GovernmentOffice {
  id: number
  name: string
  office_type: string | null
  address: string | null
  district: string | null
  upazila: string | null
  phone: string | null
  email: string | null
  office_hours: string | null
}

export interface ServiceOffice {
  id: number
  service_id: number
  office_id: number
  office: GovernmentOffice
}

// ── Feedback ────────────────────────────────────────────
export interface Feedback {
  id: number
  user_id: number
  service_id: number
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  user?: { id: number; name: string }
  service?: { id: number; title: string }
}

// ── Bookmark ────────────────────────────────────────────
export interface Bookmark {
  id: number
  user_id: number
  service_id: number
  created_at: string
  service?: Service
}

// ── Eligibility ─────────────────────────────────────────
export interface EligibilityRule {
  id: number
  service_id: number
  question: string
  answer_type: 'yes_no' | 'age' | 'text'
  expected: string
  description: string | null
}

export interface EligibilityAnswer {
  rule_id: number
  answer: string
}

export interface EligibilityResult {
  eligible: boolean
  service_id: number
  service_title: string
  results: {
    rule_id: number
    question: string
    passed: boolean
    reason: string
  }[]
}

// ── Pagination ──────────────────────────────────────────
export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedServices {
  services: Service[]
  pagination: Pagination
}

// ── API Response ────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: unknown
}

// ── Admin Stats ─────────────────────────────────────────
export interface DashboardStats {
  overview: {
    total_users: number
    active_users: number
    inactive_users: number
    new_users_last_30_days: number
    total_services: number
    total_categories: number
    total_offices: number
    total_bookmarks: number
    total_feedbacks: number
    average_rating: number | null
  }
  top_viewed_services: Service[]
  top_bookmarked_services: Service[]
  services_per_category: (Category & { _count: { services: number } })[]
}
