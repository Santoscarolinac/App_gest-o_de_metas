import React from 'react';
import { Goal } from '../types';
import { EditIcon, TrashIcon, CheckCircleIcon, ArrowPathIcon, FlagIcon, CalendarIcon } from './icons';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const priorityStyles = {
  low: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-400'
  },
  medium: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    border: 'border-yellow-400'
  },
  high: {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    border: 'border-red-400'
  }
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = goal.status === 'completed';
  const priorityStyle = priorityStyles[goal.priority];

  const isOverdue = goal.dueDate && !isCompleted ? new Date(goal.dueDate) < new Date() && new Date(goal.dueDate).toDateString() !== new Date().toDateString() : false;

  const formattedDueDate = goal.dueDate ? new Date(goal.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null;

  return (
    <div className={`bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col ${isCompleted ? 'opacity-60' : ''} border-l-4 ${priorityStyle.border}`}>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start gap-4">
          <h3 className={`text-xl font-semibold text-slate-100 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
            {goal.title}
          </h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${isCompleted ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-300'}`}>
            {isCompleted ? 'Concluída' : 'Ativa'}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2">
            <span className={`flex items-center px-2 py-0.5 rounded-md ${priorityStyle.bg} ${priorityStyle.text}`}>
                <FlagIcon />
                Prioridade {goal.priority === 'low' ? 'Baixa' : goal.priority === 'medium' ? 'Média' : 'Alta'}
            </span>
            {formattedDueDate && (
                <span className={`flex items-center ${isOverdue ? 'text-red-400 font-semibold' : ''}`}>
                    <CalendarIcon />
                    {isOverdue && 'Atrasado: '}{formattedDueDate}
                </span>
            )}
        </div>
        <div className={`mt-3 text-slate-300 whitespace-pre-wrap ${isCompleted ? 'line-through text-slate-500' : ''}`}>
          {goal.description}
        </div>
      </div>

      {!isCompleted && (
        <div className="px-6 pb-4">
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-slate-300">Progresso</span>
                <span className="font-bold text-blue-400">{goal.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{width: `${goal.progress}%`}}></div>
            </div>
        </div>
      )}

      <div className="bg-slate-800/50 border-t border-slate-700 px-6 py-3 flex justify-end items-center space-x-3">
        <button
          onClick={() => onToggleStatus(goal.id)}
          className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-white transition-colors duration-200 ${isCompleted ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400' : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          title={isCompleted ? 'Marcar como Ativa' : 'Marcar como Concluída'}
        >
          {isCompleted ? <ArrowPathIcon /> : <CheckCircleIcon />}
          <span>{isCompleted ? 'Reabrir' : 'Concluir'}</span>
        </button>
        <button
          onClick={() => onEdit(goal)}
          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Editar Meta"
          disabled={isCompleted}
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          title="Excluir Meta"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default GoalCard;