export interface UserProjectStatus {
  id: string; // pid
  name: string;
  role: Role;
}

export type Role = "owner" | "member" | "mentor";

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
  name: string;
  email: string;
  imageUrl: string;

  createdAt: number;

  projects: UserProjectStatus[];
}

export interface ChatMessage {
  name: string;
  message: string;
  timestamp: number;
}

export interface ProjectData {
  id: string; // pid
  name: string;

  createdAt: number;

  updateDocumentAccess: boolean;
  isLocked: boolean;
  // status: "locked" | "request" | "open";

  chat: ChatMessage[];

  owner: string; // uid
  members: string[]; // does not include owner, uid
  mentors: string[]; // uid

  tasks_progress: string[]; // tid
  tasks_completed: string[]; // tid
  tasks_overdue: string[]; // tid
}
