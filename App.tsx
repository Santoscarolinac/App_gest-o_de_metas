import React, { useState, useEffect, useMemo } from 'react';
import { Goal } from './types';
import Header from './components/Header';
import GoalList from './components/GoalList';
import GoalModal from './components/GoalModal';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon, SearchIcon } from './components/icons';
import StatsDashboard from './components/StatsDashboard';

type FilterStatus = 'all' | 'active' | 'completed';
type SortOption = 'default' | 'dueDate' | 'priority';

const App: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const savedGoals = localStorage.getItem('goals');
      return savedGoals ? JSON.parse(savedGoals) : [
        { id: '1', title: 'Dominar React & TypeScript', description: 'Construir vários projetos para solidificar conceitos.', status: 'active', priority: 'high', dueDate: '2024-12-31', progress: 50 },
        { id: '2', title: 'Correr uma maratona de 5km', description: 'Seguir um plano de treino por 8 semanas.', status: 'active', priority: 'medium', dueDate: '2024-09-30', progress: 25 },
        { id: '3', title: 'Ler 12 Livros', description: 'Ler um livro por mês durante todo o ano.', status: 'completed', priority: 'low', dueDate: '2023-12-31', progress: 100 },
      ];
    } catch (error) {
      console.error("Failed to parse goals from localStorage", error);
      return [];
    }
  });
  
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [goalIdToDelete, setGoalIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('goals', JSON.stringify(goals));
    } catch (error) {
      console.error("Failed to save goals to localStorage", error);
    }
  }, [goals]);

  const handleOpenCreateModal = () => {
    setGoalToEdit(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setGoalToEdit(goal);
    setIsGoalModalOpen(true);
  };

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false);
    setGoalToEdit(null);
  };
  
  const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'status'>, id?: string) => {
    if (id) {
      // Editing existing goal
      setGoals(goals.map(g => g.id === id ? { ...g, ...goalData } : g));
    } else {
      // Creating new goal
      const newGoal: Goal = {
        ...goalData,
        id: crypto.randomUUID(),
        status: 'active',
      };
      setGoals([newGoal, ...goals]);
    }
    handleCloseGoalModal();
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setGoalIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setGoalIdToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteGoal = () => {
    if (goalIdToDelete) {
      setGoals(goals.filter(g => g.id !== goalIdToDelete));
      handleCloseDeleteConfirm();
    }
  };
  
  const handleToggleStatus = (id: string) => {
    setGoals(goals.map(g => {
        if (g.id === id) {
            const isCompleted = g.status === 'active';
            return {
                ...g,
                status: isCompleted ? 'completed' : 'active',
                progress: isCompleted ? 100 : g.progress === 100 ? 90 : g.progress,
            };
        }
        return g;
    }));
  };
  
  const displayedGoals = useMemo(() => {
    const priorityValue = { low: 1, medium: 2, high: 3 };

    return [...goals]
      .filter(goal => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchLower === '' || 
                              goal.title.toLowerCase().includes(searchLower) ||
                              goal.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
        
        if (filter === 'all') return true;
        return goal.status === filter;
      })
      .sort((a, b) => {
        switch (sort) {
          case 'dueDate':
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'priority':
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            return priorityValue[b.priority] - priorityValue[a.priority];
          case 'default':
          default:
            // Completed goals to the bottom
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            return 0;
        }
      });
  }, [goals, filter, sort, searchQuery]);


  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <StatsDashboard goals={goals} />
          
          <div className="bg-slate-800/50 border border-slate-700 p-4 sm:p-6 rounded-xl shadow-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:flex-1">
                    <label htmlFor="search-goals" className="sr-only">Buscar Metas</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <SearchIcon />
                        </div>
                        <input 
                            type="text"
                            id="search-goals"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Buscar metas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                    <div className="flex rounded-md shadow-sm">
                        <button onClick={() => setFilter('all')} className={`px-3 py-2 border border-slate-600 text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500`}>Todas</button>
                        <button onClick={() => setFilter('active')} className={`px-3 py-2 border-t border-b border-slate-600 text-sm font-medium ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500`}>Ativas</button>
                        <button onClick={() => setFilter('completed')} className={`px-3 py-2 border border-slate-600 text-sm font-medium ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500`}>Concluídas</button>
                    </div>
                    <select onChange={(e) => setSort(e.target.value as SortOption)} value={sort} className="py-2 pl-3 pr-8 bg-slate-700 border-slate-600 text-slate-200 text-sm rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="default">Ordenar por...</option>
                        <option value="priority">Prioridade</option>
                        <option value="dueDate">Prazo</option>
                    </select>
                    <button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PlusIcon />
                        Adicionar Meta
                    </button>
                </div>
            </div>
          </div>

          <GoalList 
            goals={displayedGoals} 
            onEdit={handleOpenEditModal} 
            onDelete={handleOpenDeleteConfirm}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={handleCloseGoalModal}
        onSave={handleSaveGoal}
        goalToEdit={goalToEdit}
      />
      
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteGoal}
        title="Excluir Meta"
        message="Você tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default App;