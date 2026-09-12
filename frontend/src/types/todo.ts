export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
}
