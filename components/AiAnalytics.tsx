import React, { useEffect, useState } from 'react';
import { Table, AiAnalysisResult } from '../types';
import { analyzeTableData } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Lightbulb, TrendingUp, FileText, RefreshCw } from 'lucide-react';

interface AiAnalyticsProps {
  table: Table;
}

const AiAnalytics: React.FC<AiAnalyticsProps> = ({ table }) => {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeTableData(table);
      setAnalysis({
        summary: result.summary,
        trends: result.trends,
        keyInsights: result.insights
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.id]); // Re-run when table changes

  // Prepare mock data for charts based on table type logic (simplified for demo)
  const chartData = table.rows.slice(0, 10).map(row => {
    // Try to find a numeric column for value
    const numericKey = table.columns.find(c => c.type === 'number' && c.name !== 'id')?.name;
    // Try to find a string for label
    const labelKey = table.columns.find(c => c.type === 'string')?.name || 'id';
    
    return {
      name: String(row[labelKey]).substring(0, 10),
      value: numericKey ? Number(row[numericKey]) : 0
    };
  });

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-400">
         <div className="animate-spin mb-4">
           <RefreshCw size={32} />
         </div>
         <p className="text-sm font-medium">Gemini is analyzing {table.name}...</p>
       </div>
     );
  }

  if (!analysis) return null;

  return (
    <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
       <div className="max-w-6xl mx-auto">
         <div className="mb-8 flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Data Intelligence: {table.name}</h2>
                <p className="text-slate-500 mt-1">AI-generated insights based on current dataset snapshot.</p>
            </div>
            <button 
              onClick={runAnalysis}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
            >
              <RefreshCw size={14} />
              <span>Refresh Analysis</span>
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Summary Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
               <div className="flex items-center space-x-2 mb-4 text-blue-600">
                 <FileText size={20} />
                 <h3 className="font-semibold text-lg text-slate-800">Data Summary</h3>
               </div>
               <p className="text-slate-600 leading-relaxed text-sm">
                 {analysis.summary}
               </p>
            </div>

            {/* Quick Stats (Mock) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
                <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-2">Total Records</span>
                <span className="text-4xl font-bold text-slate-900">{table.rows.length}</span>
                <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                   <div className="bg-blue-500 h-full w-3/4"></div>
                </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Trends */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center space-x-2 mb-4 text-purple-600">
                 <TrendingUp size={20} />
                 <h3 className="font-semibold text-lg text-slate-800">Detected Trends</h3>
               </div>
               <ul className="space-y-3">
                 {analysis.trends.map((trend, i) => (
                   <li key={i} className="flex items-start space-x-3">
                     <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-purple-400"></span>
                     <span className="text-sm text-slate-600">{trend}</span>
                   </li>
                 ))}
               </ul>
               <div className="mt-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
                      <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{r: 4, fill: '#8b5cf6'}} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Insights */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center space-x-2 mb-4 text-amber-600">
                 <Lightbulb size={20} />
                 <h3 className="font-semibold text-lg text-slate-800">Strategic Insights</h3>
               </div>
               <div className="space-y-4">
                  {analysis.keyInsights.map((insight, i) => (
                     <div key={i} className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                       <p className="text-sm text-slate-700">{insight}</p>
                     </div>
                  ))}
               </div>
               <div className="mt-6 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
                      <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
       </div>
    </div>
  );
};

export default AiAnalytics;
