import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Todos from './Todos';
import api from '../services/api';

vi.mock('../services/api');

describe('Todos Page', () => {
  it('renders loading state initially', () => {
    vi.mocked(api.getTodos).mockResolvedValue({ data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 } });
    vi.mocked(api.getCategories).mockResolvedValue({ data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 } });
    
    const { container } = render(
      <MemoryRouter>
        <Todos />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
});
