
export interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  progress: number;
}