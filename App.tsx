import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TableViewer from './components/TableViewer';
import QueryConsole from './components/QueryConsole';
import AiAnalytics from './components/AiAnalytics';
import { DatabaseState, ViewMode, Table } from './types';
import { INITIAL_DB_STATE } from './constants';

const App: React.FC = () => {
  const [dbState, setDbState] = useState<DatabaseState>(INITIAL_DB_STATE);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DATA);
  const [activeTableId, setActiveTableId] = useState<string>(INITIAL_DB_STATE.tables[0].id);

  const activeTable = dbState.tables.find(t => t.id === activeTableId) || dbState.tables[0];

  const handleUpdateTable = (updatedTable: Table) => {
    const newTables = dbState.tables.map(t => 
      t.id === updatedTable.id ? updatedTable : t
    );
    setDbState({ ...dbState, tables: newTables });
  };

  const handleSelectTable = (id: string) => {
    setActiveTableId(id);
    setCurrentView(ViewMode.DATA);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.DATA:
        return (
          <TableViewer 
            table={activeTable} 
            onUpdateTable={handleUpdateTable} 
          />
        );
      case ViewMode.QUERY:
        return <QueryConsole dbState={dbState} />;
      case ViewMode.ANALYSIS:
        return <AiAnalytics table={activeTable} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        dbState={dbState}
        currentTableId={activeTableId}
        currentView={currentView}
        onSelectTable={handleSelectTable}
        onChangeView={setCurrentView}
      />
      <main className="flex-1 h-full overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
