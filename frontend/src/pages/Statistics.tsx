import React, { useState, useEffect, useCallback } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
} from '@ionic/react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import api from '../services/api';
import { Statistics as StatsType, Category } from '../types/todo';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, catsRes] = await Promise.all([
        api.getStatistics(),
        api.getCategories(1, 100)
      ]);
      setStats(statsRes);
      setCategories(catsRes.data);
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
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <IonSpinner />
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
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <IonCard style={{ margin: 0, '--background': 'var(--surface)' }}>
          <IonCardHeader>
            <IonCardTitle style={{ color: 'var(--text)' }}>Total</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.total}
          </IonCardContent>
        </IonCard>

        <IonCard style={{ margin: 0, '--background': 'var(--surface)' }}>
          <IonCardHeader>
            <IonCardTitle style={{ color: 'var(--text)' }}>Completed</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>
            {stats.completed}
          </IonCardContent>
        </IonCard>

        <IonCard style={{ margin: 0, '--background': 'var(--surface)' }}>
          <IonCardHeader>
            <IonCardTitle style={{ color: 'var(--text)' }}>Pending</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-warning)' }}>
            {stats.pending}
          </IonCardContent>
        </IonCard>
      </div>

      <IonCard style={{ margin: 0, '--background': 'var(--surface)' }}>
        <IonCardHeader>
          <IonCardTitle style={{ color: 'var(--text)' }}>By Category</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </IonCardContent>
      </IonCard>
    </Layout>
  );
};

export default Statistics;
