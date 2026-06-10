export interface User {
  id: string;
  name: string;
  phone: string;
  role: "citizen" | "worker" | "admin";
  avatar?: string;
  employeeId?: string;
}

export interface Complaint {
  id: string | number;
  formattedId?: string;
  complaintStatus: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" | string;
  severityScore: number;
  location: string;
  trashType: string;
  createdAt: string;
  updatedAt?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  cleanedImageUrl?: string;
  citizenId?: string;
  citizenName?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  aiAnalysis?: string;
  cleaned?: boolean;
}

export interface AdminComplaintData {
  formattedId: string;
  trashType: string;
  location: string;
  citizenName: string;
  severityScore: number;
  volumeEstimate: string;
  complaintStatus: string;
  workerName: string;
  date: string;
}

export interface WorkerRouteComplaint {
  id: number;
  complaintId: string | number;
  latitude: number;
  longitude: number;
  locationName: string;
  imageUrl: string;
  complaintStatus: string;
  sequenceNo: number;
  severityScore: number;
  wasteType: string;
}

export interface Worker {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  status: "on-shift" | "off-duty" | "on-leave";
  assignedRoute?: string;
  avatar?: string;
  shiftStart?: string;
  shiftEnd?: string;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  vehicleId: string;
  type: string;
  vehicleStatus: "ACTIVE" | "MAINTENANCE" | "IDLE";
  assignedDriver?: string;
  workerName?: string;
}

export interface Route {
  id: string;
  name: string;
  ward: string;
  status: "ACTIVE" | "COMPLETED" | "PENDING";
  assignedWorker?: string;
  assignedVehicle?: string;
  stops: { sequenceNo: number; complaintId: string }[];
  distance: string;
  estimatedTime: string;
  startTime?: string;
  endTime?: string;
}

export interface AdminDashboardData {
  name: string;
  totalComplaints: number;
  totalWorkers: number;
  totalCitizens: number;
  totalPendingComplaints: number;
  totalActiveVehicles: number;
  totalVehicles: number;
  efficiency: number;
  activeRoutes: any[];
  recentComplaints: any[];
}

export interface CitizenDashboardData {
  resolvedPercentage: number;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  name: string;
}

export interface WorkerDashboardData {
  name: string;
  empId: string;
  vehicleNo: string;
  routeStatus: string;
  totalComplaints: number;
  completedComplaints: number;
  pendingComplaints: number;
  complaints: any[];
  routeId: string;
}

export interface WorkerProfileData {
  name: string;
  empId: string;
  phone: string;
  totalCompletedRoutes: number;
  totalVerifications: number;
}

export interface CitizenProfileData {
  name: string;
  username: string;
  phone: string;
  createdAt: string;
}

export interface AdminWorkerResponse {
  workerId: string;
  workerName: string;
  phoneNo: string;
  vehicleNo: string;
}

export interface AdminVehicleResponse {
  vehicleId: string;
  vehicleNo: string;
  vehicleStatus: "ACTIVE" | "MAINTENANCE" | "IDLE";
  workerName: string;
}


export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "success" | "error" | "info" | "pending";
  timestamp: string;
  read: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => string;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}
