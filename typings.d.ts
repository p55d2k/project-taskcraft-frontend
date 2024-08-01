export interface UserProjectStatus {
  id: string; // pid
  name: string;
  role: Role;
}

export type Role = "owner" | "member" | "mentor" | "admin";

export interface TaskData {
  id: string; // tid
  project: string; // pid
  description: string;
  status: "completed" | "progress" | "overdue";
  priority: "low" | "medium" | "high";

  assignedTo: string[]; // uid
  assignedBy: string; // uid

  createdAt: number;
  completedAt: number;
  dueDate: number;
}

export interface UserData {
  createdAt: number;
  email: string;
  name: string;
  ips: string[];

  notifications: string[]; // the message
  projects: UserProjectStatus[];
}

export interface ChatMessage {
  id: string; // uid
  name: string;
  message: string;
  timestamp: number;
}

export type ProjectStatus =
  | "active"
  | "completed"
  | "archived"
  | "paused"
  | "deleted";

export interface ProjectData {
  id: string; // pid
  name: string;
  status: ProjectStatus;

  createdAt: number;

  chat: ChatMessage[];

  owner: string; // uid
  members: string[]; // does not include owner, uid
  mentors: string[]; // uid

  tasks_progress: string[]; // tid
  tasks_completed: string[]; // tid
  tasks_overdue: string[]; // tid
}
