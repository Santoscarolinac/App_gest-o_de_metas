import React from 'react';
import { Goal } from '../types';
import GoalCard from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onEdit, onDelete, onToggleStatus }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg">
        <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-200">Nenhuma meta ainda</h3>
        <p className="mt-1 text-sm text-slate-400">Comece criando uma nova meta.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map(goal => (
        <GoalCard 
          key={goal.id} 
          goal={goal} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onToggleStatus={onToggleStatus} 
        />
      ))}
    </div>
  );
};

export default GoalList;