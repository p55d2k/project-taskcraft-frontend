export interface UserProjectStatus {
  id: string; // pid
  name: string;
  role: "owner" | "member" | "mentor";
}

export interface TaskData {
  id: string; // tid
  description: string;
  status: "completed" | "pending" | "progress" | "rejected" | "overdue";
  priority: "low" | "medium" | "high";

  assignedTo: string[]; // uid
  assignedBy: string; // uid

  createdAt: number;
  dueDate: number;
}

export interface UserData {
  createdAt: number;
  email: string;
  name: string;
  ips: string[];

  notifications: string[]; // the message
  projects: UserProjectStatus[];
  tasks: string[]; // tid
}

export interface ProjectData {
  id: string; // pid
  name: string;
  status: "active" | "completed" | "archived" | "paused" | "deleted";

  createdAt: number;

  owner: string; // uid
  members: string[]; // does not include owner, uid
  mentors: string[]; // uid

  tasks_pending: string[]; // tid
  tasks_completed: string[]; // tid
  tasks_rejected: string[]; // tid
  tasks_overdue: string[]; // tid
}

/*
- users -> uid -> { email, name, ips, projects, tasks }
- projects -> pid -> { name, description, owner, members, mentors, tasks_pending, tasks_progress, tasks_completed }
- tasks -> tid -> { description, status, assignedTo, assignedBy, createdAt, dueDate }
*/
