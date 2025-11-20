import React, { useState } from 'react';
import { Table, Row } from '../types';
import { Search, Filter, Download, Plus, MoreHorizontal, RefreshCw } from 'lucide-react';
import { generateMockRows } from '../services/geminiService';

interface TableViewerProps {
  table: Table;
  onUpdateTable: (updatedTable: Table) => void;
}

const TableViewer: React.FC<TableViewerProps> = ({ table, onUpdateTable }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredRows = table.rows.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleGenerateData = async () => {
    setIsGenerating(true);
    try {
      const newRows = await generateMockRows(table, 5);
      // Assign new mock IDs based on existing max
      const maxId = table.rows.reduce((max, r) => (typeof r.id === 'number' && r.id > max ? r.id : max), 0);
      
      const processedNewRows = newRows.map((r, idx) => ({
        ...r,
        id: typeof maxId === 'number' ? maxId + idx + 1 : `gen_${Date.now()}_${idx}`
      }));

      onUpdateTable({
        ...table,
        rows: [...table.rows, ...processedNewRows]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{table.name}</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            {table.rows.length} records
          </span>
        </div>
        <div className="flex items-center space-x-3">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-64 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
           </div>
           <button className="p-2 hover:bg-slate-50 text-slate-500 rounded-md border border-slate-200">
             <Filter size={16} />
           </button>
           <button 
             onClick={handleGenerateData}
             disabled={isGenerating}
             className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-medium transition-colors border border-indigo-200 disabled:opacity-50"
           >
             <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
             <span>{isGenerating ? "Generating..." : "Auto-Fill Data"}</span>
           </button>
           <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors shadow-sm">
             <Plus size={16} />
             <span>New Record</span>
           </button>
        </div>
      </div>

      {/* Table Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-12">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              </th>
              {table.columns.map(col => (
                <th key={col.name} className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 group cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center space-x-1">
                    <span>{col.name}</span>
                    {col.isPrimaryKey && <span className="text-[10px] text-yellow-500 ml-1">PK</span>}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 border-b border-slate-200 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-3 border-b border-slate-50">
                   <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
                {table.columns.map(col => (
                  <td key={col.name} className="px-6 py-3 text-sm text-slate-700 whitespace-nowrap">
                    {col.type === 'boolean' ? (
                      <span className={`inline-flex h-2 w-2 rounded-full ${row[col.name] ? 'bg-green-500' : 'bg-slate-300'}`} />
                    ) : (
                      String(row[col.name])
                    )}
                  </td>
                ))}
                <td className="px-6 py-3 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
               <tr>
                 <td colSpan={table.columns.length + 2} className="px-6 py-12 text-center text-slate-400">
                    No records found. Try adding some data or clearing filters.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Pagination Mock */}
      <div className="h-12 border-t border-slate-200 px-6 flex items-center justify-between bg-slate-50 text-xs text-slate-500">
         <span>Showing {filteredRows.length} of {table.rows.length} rows</span>
         <div className="flex items-center space-x-2">
           <button className="px-2 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Prev</button>
           <button className="px-2 py-1 border border-slate-200 rounded hover:bg-white">Next</button>
         </div>
      </div>
    </div>
  );
};

export default TableViewer;
