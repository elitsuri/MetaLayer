import React from 'react';
import { useMetaStore } from '../store/useMetaStore';
import { AlertTriangle, Activity, Database, Server } from 'lucide-react';

export const InsightDashboard: React.FC = () => {
  const { state } = useMetaStore();
  const { insights, risks } = state;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">{insight.title}</div>
            <div className="text-2xl font-bold text-white">{insight.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2 mb-4 text-amber-400">
          <AlertTriangle size={18} />
          <h3 className="font-semibold uppercase text-xs tracking-widest">Global Risk Analysis</h3>
        </div>
        <div className="space-y-3">
          {risks.length === 0 ? (
            <div className="text-slate-500 text-sm italic">No critical risks detected.</div>
          ) : (
            risks.map((risk, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${risk.riskScore > 30 ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div>
                    <div className="text-sm text-slate-200 font-mono">{risk.nodeId}</div>
                    <div className="text-xs text-slate-500">{risk.type} detected</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400">Score: {risk.riskScore}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
