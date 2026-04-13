import { useState, useEffect } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('material_logs')
      .select('*, profiles:user_id(full_name)')
      .order('created_at', { ascending: false });
    
    if (!error) {
      setLogs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.material_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col space-y-4 relative w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-[var(--heading)] tracking-tight">Activity Logs</h2>
          <p className="text-sm text-gray-500">History of material deductions and actions</p>
        </div>

        <div className="relative group max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#166534] transition-colors" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white text-black text-sm focus:ring-2 focus:ring-[#166534]/10 focus:border-[#166534] transition-all outline-none font-medium placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={10} cols={6} />
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500 text-base">No activity logs found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-gray-200">
                  <th className="px-6 py-3 text-[11px] font-bold text-[#166534] uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#166534] uppercase tracking-wider">Material Name</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#166534] uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#166534] uppercase tracking-wider text-right">Quantity</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#166534] uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[#166534] uppercase tracking-wider">Performed By</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {filteredLogs.map((log, index) => (
                  <tr key={log.id} className={`hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-3 text-gray-500 text-xs">
                      {new Date(log.created_at).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-800">{log.material_name}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-tight italic border border-red-100">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-red-600">-{log.quantity}</td>
                    <td className="px-6 py-3 text-gray-600 text-xs italic">{log.reason || 'No reason provided'}</td>
                    <td className="px-6 py-3 text-slate-800 font-medium">
                      {Array.isArray(log.profiles) 
                        ? (log.profiles[0]?.full_name || '-') 
                        : (log.profiles?.full_name || '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
