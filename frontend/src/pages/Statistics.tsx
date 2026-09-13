import React, { useState, useEffect, useCallback } from 'react';
import { IonSpinner } from '@ionic/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import api from '../services/api';
import { Statistics as StatsType } from '../types/todo';
import { useCategory } from '../context/CategoryContext';

const Statistics: React.FC = () => {
  const { categories } = useCategory();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const statsRes = await api.getStatistics();
      setStats(statsRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !stats) {
    return (
      <Layout title="Statistics">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <IonSpinner name="dots" />
        </div>
      </Layout>
    );
  }

  const chartData = stats.byCategory.map(item => {
    const cat = categories.find(c => c.id === item.categoryId);
    return {
      name: item.name,
      value: item.count,
      color: cat ? cat.color : '#8884d8'
    };
  });

  return (
    <Layout title="Statistics">
      {/* ── Summary Stats Grid ────────────────────────── */}
      <div className="stats-grid animate-in">
        <div className="stat-card">
          <div className="stat-label">Total Todos</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            {stats.total}
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: '0.05s' }}>
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ color: 'var(--accent-success)' }}>
            {stats.completed}
          </div>
        </div>

        <div className="stat-card" style={{ animationDelay: '0.1s' }}>
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: 'var(--accent-warning)' }}>
            {stats.pending}
          </div>
        </div>
      </div>

      {/* ── Chart Card ────────────────────────────────── */}
      <div className="app-card animate-in" style={{ animationDelay: '0.15s', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'var(--text)' }}>
          By Category
        </h3>
        
        {chartData.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 0' }}>
            <span style={{ fontSize: '2rem' }}>📊</span>
            <p>No category data available yet.</p>
          </div>
        ) : (
          <div style={{ height: '340px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface)', 
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }}
                  itemStyle={{ color: 'var(--text)' }}
                />
                <Legend wrapperStyle={{ color: 'var(--text)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Statistics;
