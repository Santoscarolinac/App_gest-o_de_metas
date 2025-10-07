import React from 'react';
import { Goal } from '../types';
import { ChartBarIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon, SparklesIcon } from './icons';

interface StatsDashboardProps {
  goals: Goal[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ goals }) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeGoals = totalGoals - completedGoals;
  
  const totalProgress = goals.reduce((acc, goal) => {
    if (goal.status === 'active') {
      return acc + goal.progress;
    }
    // For completed goals, consider their progress as 100%
    if(goal.status === 'completed') {
        return acc + 100;
    }
    return acc;
  }, 0);

  const overallProgress = totalGoals > 0 ? Math.round(totalProgress / totalGoals) : 0;

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg flex items-center gap-4 border-l-4" style={{ borderColor: color }}>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20`}}>
        {React.cloneElement(icon as React.ReactElement, { style: { color }})}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={<ClipboardDocumentListIcon />} label="Total de Metas" value={totalGoals} color="#818cf8" />
      <StatCard icon={<SparklesIcon />} label="Metas Ativas" value={activeGoals} color="#60a5fa" />
      <StatCard icon={<ClipboardDocumentCheckIcon />} label="Metas Concluídas" value={completedGoals} color="#4ade80" />
      <StatCard icon={<ChartBarIcon />} label="Progresso Geral" value={`${overallProgress}%`} color="#fb923c" />
    </div>
  );
};

export default StatsDashboard;