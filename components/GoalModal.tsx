import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, ListBulletIcon } from './icons';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id' | 'status'>, id?: string) => void;
  goalToEdit?: Goal | null;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, goalToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Goal['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description);
      setPriority(goalToEdit.priority);
      setDueDate(goalToEdit.dueDate || '');
      setProgress(goalToEdit.progress);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setProgress(0);
    }
  }, [goalToEdit, isOpen]);

  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      alert("Por favor, insira um título para a meta antes de gerar uma descrição.");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Gere uma descrição motivacional e clara para a seguinte meta: "${title}". A descrição deve ser concisa, com no máximo 2 ou 3 frases.`,
      });
      setDescription(response.text);
    } catch (error) {
      console.error("Erro ao gerar descrição:", error);
      alert("Ocorreu um erro ao tentar gerar a descrição. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBreakDownGoal = async () => {
    if (!title.trim()) {
      alert("Por favor, insira um título para a meta antes de dividí-la.");
      return;
    }
    setIsBreakingDown(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Para a meta com o título "${title}" e descrição "${description}", divida-a em 3 a 5 sub-metas menores e acionáveis. Formate a resposta como uma lista de tarefas em markdown (usando '- [ ]').`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const subTasks = `\n\n**Sub-metas Sugeridas:**\n${response.text}`;
      setDescription(prev => prev.trim() + subTasks);

    } catch (error) {
      console.error("Erro ao dividir a meta:", error);
      alert("Ocorreu um erro ao tentar dividir a meta. Tente novamente.");
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, priority, dueDate: dueDate || null, progress }, goalToEdit?.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-lg" role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-100">{goalToEdit ? 'Editar Meta' : 'Criar Nova Meta'}</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-slate-300">Título</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ex., Aprender React"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                 <div className="flex justify-between items-center">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-300">Descrição</label>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !title.trim() || isBreakingDown} className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <SparklesIcon />
                            <span className="ml-1">{isGenerating ? 'Gerando...' : 'Gerar Descrição'}</span>
                        </button>
                        <button type="button" onClick={handleBreakDownGoal} disabled={isBreakingDown || !title.trim() || isGenerating} className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <ListBulletIcon />
                            <span className="ml-1">{isBreakingDown ? 'Dividindo...' : 'Dividir Meta'}</span>
                        </button>
                    </div>
                 </div>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ex., Concluir um curso e construir um projeto"
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-slate-300">Prioridade</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Goal['priority'])} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border-slate-600 text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                </select>
              </div>
               <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300">Prazo</label>
                <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-slate-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
               </div>
               <div className="sm:col-span-2">
                <label htmlFor="progress" className="block text-sm font-medium text-slate-300">Progresso: {progress}%</label>
                <input type="range" id="progress" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="mt-1 block w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"/>
               </div>
            </div>
          </div>
          <div className="bg-slate-900/50 border-t border-slate-700 px-6 py-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGenerating || isBreakingDown}
              className="px-4 py-2 bg-blue-600 text-white border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {goalToEdit ? 'Salvar Alterações' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;