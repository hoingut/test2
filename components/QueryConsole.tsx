import React, { useState } from 'react';
import { Play, Sparkles, Eraser, Clock, Save } from 'lucide-react';
import { DatabaseState, QueryResult } from '../types';
import { executeQuery } from '../services/mockDbEngine';
import { generateSqlFromNl } from '../services/geminiService';

interface QueryConsoleProps {
  dbState: DatabaseState;
}

const QueryConsole: React.FC<QueryConsoleProps> = ({ dbState }) => {
  const [sql, setSql] = useState('SELECT * FROM users WHERE status = \'active\'');
  const [nlPrompt, setNlPrompt] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleRunQuery = () => {
    if (!sql.trim()) return;
    const res = executeQuery(sql, dbState);
    setResult(res);
  };

  const handleAiGenerate = async () => {
    if (!nlPrompt.trim()) return;
    setIsLoadingAi(true);
    try {
      const response = await generateSqlFromNl(nlPrompt, dbState.tables);
      setSql(response.sql);
      // Optional: Auto-run? Maybe just let user review first.
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
       {/* Top Bar - AI Input */}
       <div className="bg-white p-6 border-b border-slate-200">
         <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-3 mb-4">
               <div className="mt-1 p-1.5 bg-purple-100 text-purple-600 rounded-md">
                 <Sparkles size={18} />
               </div>
               <div className="flex-1">
                 <h3 className="text-sm font-semibold text-slate-800 mb-1">AI Query Assistant</h3>
                 <p className="text-xs text-slate-500 mb-3">Describe what data you need in plain English, and Gemini will write the SQL.</p>
                 <div className="flex space-x-2">
                    <input 
                      type="text" 
                      className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                      placeholder="e.g., Show me all orders from last month greater than $100"
                      value={nlPrompt}
                      onChange={(e) => setNlPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                    />
                    <button 
                      onClick={handleAiGenerate}
                      disabled={isLoadingAi || !nlPrompt}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isLoadingAi ? 'Thinking...' : 'Generate SQL'}
                    </button>
                 </div>
               </div>
            </div>
         </div>
       </div>

       {/* Main Split View */}
       <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1 flex flex-col border-r border-slate-200 bg-white min-w-[400px]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SQL Editor</span>
               <div className="flex space-x-1">
                 <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded" title="Clear">
                    <Eraser size={14} onClick={() => setSql('')} />
                 </button>
                 <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded" title="History">
                    <Clock size={14} />
                 </button>
                 <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded" title="Save Snippet">
                    <Save size={14} />
                 </button>
               </div>
            </div>
            <textarea 
              className="flex-1 p-4 font-mono text-sm text-slate-800 bg-white resize-none focus:outline-none leading-relaxed"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              spellCheck={false}
              placeholder="-- Enter SQL query here..."
            />
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                onClick={handleRunQuery}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow"
              >
                <Play size={16} />
                <span>Run Query</span>
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-[1.5] bg-slate-50 flex flex-col overflow-hidden">
            {!result ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 flex-col">
                <DatabaseStateGraphic />
                <p className="mt-4 text-sm">Run a query to see results here</p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Result Header */}
                <div className={`px-4 py-3 border-b border-slate-200 flex justify-between items-center ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                   <div className="flex items-center space-x-2">
                     <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                     <span className={`text-sm font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                        {result.success ? 'Query Executed Successfully' : 'Query Failed'}
                     </span>
                   </div>
                   {result.executionTimeMs && (
                     <span className="text-xs text-slate-500">{result.executionTimeMs}ms</span>
                   )}
                </div>

                {result.success && result.data && result.columns ? (
                  <div className="flex-1 overflow-auto bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 sticky top-0">
                         <tr>
                           {result.columns.map(c => (
                             <th key={c} className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                               {c}
                             </th>
                           ))}
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.data.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                             {result.columns!.map(c => (
                               <td key={c} className="px-4 py-2 text-sm text-slate-700 whitespace-nowrap">
                                 {String(row[c])}
                               </td>
                             ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-red-600 font-mono text-sm">
                    Error: {result.message}
                  </div>
                )}
              </div>
            )}
          </div>
       </div>
    </div>
  );
};

const DatabaseStateGraphic = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export default QueryConsole;
