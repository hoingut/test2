import React from 'react';
import { Database, Table2, Terminal, Activity, Plus } from 'lucide-react';
import { DatabaseState, ViewMode, Table } from '../types';

interface SidebarProps {
  dbState: DatabaseState;
  currentTableId: string | null;
  currentView: ViewMode;
  onSelectTable: (id: string) => void;
  onChangeView: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  dbState,
  currentTableId,
  currentView,
  onSelectTable,
  onChangeView
}) => {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-2 text-white">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Database size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight">{dbState.name}</span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-4 mb-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
          Tools
        </div>
        <nav className="space-y-1 px-2 mb-6">
          <button
            onClick={() => onChangeView(ViewMode.QUERY)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === ViewMode.QUERY 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Terminal size={18} />
            <span>Query Console</span>
          </button>
          <button
            onClick={() => onChangeView(ViewMode.ANALYSIS)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === ViewMode.ANALYSIS 
                ? 'bg-purple-600/10 text-purple-400' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity size={18} />
            <span>AI Insights</span>
          </button>
        </nav>

        <div className="px-4 mb-2 flex items-center justify-between text-xs font-semibold uppercase text-slate-500 tracking-wider">
          <span>Tables</span>
          <button className="hover:text-white transition-colors">
            <Plus size={14} />
          </button>
        </div>
        <nav className="space-y-1 px-2">
          {dbState.tables.map((table: Table) => (
            <button
              key={table.id}
              onClick={() => onSelectTable(table.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                currentView === ViewMode.DATA && currentTableId === table.id
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Table2 size={18} className="text-slate-500" />
                <span>{table.name}</span>
              </div>
              <span className="text-xs text-slate-600 font-mono">{table.rows.length}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400"></div>
          <div>
            <p className="text-sm font-medium text-white">Demo User</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
