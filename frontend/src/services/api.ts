import { Todo, CreateTodoInput, UpdateTodoInput, ApiError } from '../types/todo';

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
        const errorBody: ApiError = await response.json();
        if (Array.isArray(errorBody.message)) {
          errorMessage = errorBody.message.join(', ');
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Fallback to default message if body is not json
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getTodos(): Promise<Todo[]> {
    return this.request<Todo[]>('/todos');
  }

  async getTodo(id: number): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`);
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteTodo(id: number): Promise<void> {
    return this.request<void>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(BASE_URL);
export default api;
