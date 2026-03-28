import React, { useState } from 'react';
import { useMetaStore } from '../store/useMetaStore';
import { Play, Loader2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SimulationPanel: React.FC = () => {
  const { state, runSimulation } = useMetaStore();
  const [selectedNode, setSelectedNode] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRun = async () => {
    if (!selectedNode) return;
    setSimulating(true);
    try {
      const res = await runSimulation(selectedNode);
      setResult(res);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 text-blue-400">
        <Activity size={18} />
        <h3 className="font-semibold uppercase text-xs tracking-widest">Simulation Engine</h3>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs text-slate-500 uppercase mb-2">Target Entity</label>
          <select 
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select an entity...</option>
            {state.nodes.map(n => (
              <option key={n.id} value={n.id}>{n.name} ({n.id})</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRun}
          disabled={!selectedNode || simulating}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
        >
          {simulating ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
          Run Cascade Simulation
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-slate-900/80 rounded border border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase">Impact Radius</span>
                <span className="text-sm font-bold text-red-400">{result.impact.affectedCount} Entities</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase">Risk Level</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                  result.impact.riskLevel === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {result.impact.riskLevel}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-500 uppercase mb-2">Affected Path</div>
                <div className="flex flex-wrap gap-1">
                  {result.impact.nodes.map((n: string) => (
                    <span key={n} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                      {n.split(':')[1]}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-4 text-[10px] text-slate-600 italic">
        * Simulations use the global dependency graph to predict cascading failures across systems.
      </div>
    </div>
  );
};

import { Activity } from 'lucide-react';
