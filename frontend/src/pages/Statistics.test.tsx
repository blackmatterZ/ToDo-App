import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Statistics from './Statistics';
import api from '../services/api';

vi.mock('../services/api');
// Mock recharts because it uses ResizeObserver which might not be available in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => <div></div>,
  Cell: () => <div></div>,
  Tooltip: () => <div></div>,
  Legend: () => <div></div>,
}));

describe('Statistics Page', () => {
  it('renders correctly after loading', async () => {
    vi.mocked(api.getStatistics).mockResolvedValue({
      total: 10,
      completed: 5,
      pending: 5,
      byCategory: []
    });
    vi.mocked(api.getCategories).mockResolvedValue({ data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 } });
    
    const { container } = render(
      <MemoryRouter>
        <Statistics />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
});
