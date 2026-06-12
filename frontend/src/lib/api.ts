const API_BASE_URL = "https://chokho-backend.onrender.com";

export type AuthResponse = {
  token: string;
  name: string;
  role: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  } as Record<string, string>;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || "Something went wrong");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return (await response.text()) as unknown as T;
}

export const authApi = {
  // POST /auth/register — citizen registration
  register: (data: any) => apiRequest<string>("/auth/register", { 
    method: "POST", 
    body: JSON.stringify(data) 
  }),
  // POST /auth/login — login for all roles
  login: (data: any) => apiRequest<AuthResponse>("/auth/login", { 
    method: "POST", 
    body: JSON.stringify(data) 
  }),
};

export const citizenApi = {
  // GET /citizen/dashboard
  getDashboard: () => apiRequest<any>("/citizen/dashboard"),
  // GET /citizen/complaints
  getComplaints: () => apiRequest<any[]>("/citizen/complaints"),
  // GET /citizen/complaints/{id} — complaint detail
  getComplaintDetail: (id: string | number) => apiRequest<any>(`/citizen/complaints/${id}`),
  // GET /citizen/profile
  getProfile: () => apiRequest<any>("/citizen/profile"),
  // POST /citizen/complaint — submit new complaint
  reportComplaint: (formData: FormData) => apiRequest<string>("/citizen/complaint", {
    method: "POST",
    body: formData
  }),
  
  logout: () => Promise.resolve(localStorage.clear()),
};

export const workerApi = {
  // GET /worker/dashboard
  getDashboard: () => apiRequest<any>("/worker/dashboard"),
  // GET /worker/my-route
  getRoute: () => apiRequest<any[]>("/worker/my-route"),
  // GET /worker/profile
  getProfile: () => apiRequest<any>("/worker/profile"),
  // POST /worker/verify/{complaintId} — verify cleanup
  verifyCleanup: (complaintId: string | number, formData: FormData) => apiRequest<string>(`/worker/verify/${complaintId}`, {
    method: "POST",
    body: formData
  }),
  // POST /worker/finish-route
  finishRoute: () => apiRequest<string>("/worker/finish-route", { method: "POST" }),
  
  logout: () => Promise.resolve(localStorage.clear()),
};

export const adminApi = {
  // GET /admin/dashboard
  getDashboard: () => apiRequest<any>("/admin/dashboard"),
  // GET /admin/complaints
  getComplaints: () => apiRequest<any[]>("/admin/complaints"),
  // GET /admin/workers
  getWorkers: () => apiRequest<any[]>("/admin/workers"),
  // GET /admin/vehicles
  getVehicles: () => apiRequest<any[]>("/admin/vehicles"),
  // GET /admin/routes
  getRoutes: () => apiRequest<any[]>("/admin/routes"),
  // POST /admin/routes/optimize — trigger route optimization
  optimizeRoutes: () => apiRequest<string>("/admin/routes/optimize", { method: "POST" }),
  
  // POST /admin/registerVehicle
  registerVehicle: (data: any) => apiRequest<string>("/admin/registerVehicle", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  // POST /admin/registerWorker
  registerWorker: (data: any) => apiRequest<string>("/admin/registerWorker", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  
  logout: () => Promise.resolve(localStorage.clear()),
};

export const complaintApi = {
  // GET /heatmap — active complaints for heatmap
  getHeatmap: () => apiRequest<any[]>("/heatmap"),
};
