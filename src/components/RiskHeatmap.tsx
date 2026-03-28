import React from 'react';
import { useMetaStore } from '../store/useMetaStore';

export const RiskHeatmap: React.FC = () => {
  const { state } = useMetaStore();
  const { nodes, links } = state;

  // Simple heatmap visualization based on connectivity
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-full">
      <div className="flex items-center gap-2 mb-6 text-red-400">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <h3 className="font-semibold uppercase text-xs tracking-widest">System Heatmap</h3>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {nodes.map(node => {
          const connections = links.filter(l => l.source === node.id || l.target === node.id).length;
          const intensity = Math.min(connections * 20, 100);
          
          return (
            <div 
              key={node.id}
              className="aspect-square rounded flex items-center justify-center group relative cursor-help"
              style={{ 
                backgroundColor: `rgba(239, 68, 68, ${intensity / 100})`,
                border: `1px solid rgba(239, 68, 68, ${intensity / 50})`
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] p-1.5 rounded border border-slate-700 whitespace-nowrap z-20 pointer-events-none">
                {node.name}: {connections} connections
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-tighter">
        <span>Low Risk</span>
        <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-slate-800 via-amber-500 to-red-600 rounded" />
        <span>Critical</span>
      </div>
    </div>
  );
};
