import { Todo, CreateTodoInput, UpdateTodoInput, PaginatedResponse, Category, Statistics } from '../types/todo';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorBody: any = await response.json();
        if (errorBody?.error?.message) {
          errorMessage = errorBody.error.message;
        } else if (errorBody?.message) {
          errorMessage = Array.isArray(errorBody.message) ? errorBody.message.join(', ') : errorBody.message;
        }
      } catch {
        // Fallback
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getTodos(page = 1, pageSize = 10, search?: string, categoryId?: string): Promise<PaginatedResponse<Todo>> {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) query.append('search', search);
    if (categoryId) query.append('categoryId', categoryId);
    return this.request<PaginatedResponse<Todo>>(`/todos?${query.toString()}`);
  }

  async getTodo(id: string): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`);
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteTodo(id: string): Promise<void> {
    return this.request<void>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(page = 1, pageSize = 100): Promise<PaginatedResponse<Category>> {
    return this.request<PaginatedResponse<Category>>(`/categories?page=${page}&pageSize=${pageSize}`);
  }

  async createCategory(input: { name: string; color: string }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Statistics
  async getStatistics(): Promise<Statistics> {
    return this.request<Statistics>('/statistics');
  }
}

export const api = new ApiClient(BASE_URL);
export default api;
