import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
           </svg>
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Gerenciador de Metas Pro</h1>
            <p className="mt-1 text-md text-blue-200">Mantenha o foco e alcance seus sonhos, uma meta de cada vez.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;