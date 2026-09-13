export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  completed?: boolean;
  categoryId?: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  categoryId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface Statistics {
  total: number;
  completed: number;
  pending: number;
  byCategory: {
    categoryId: string | null;
    name: string;
    count: number;
  }[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: any;
  };
}
