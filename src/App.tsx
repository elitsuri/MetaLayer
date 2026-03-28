import React, { useEffect } from 'react';
import { useMetaStore } from './store/useMetaStore';
import { GlobalGraph } from './components/GlobalGraph';
import { InsightDashboard } from './components/InsightDashboard';
import { SimulationPanel } from './components/SimulationPanel';
import { RiskHeatmap } from './components/RiskHeatmap';
import { Layers, Globe, Shield, Zap, Menu, Bell } from 'lucide-react';

export default function App() {
  const { init, loading } = useMetaStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-400 font-mono text-sm tracking-widest uppercase">Initializing MetaLayer...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Layers size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">METALAYER</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <a href="#" className="text-blue-400 border-b-2 border-blue-400 pb-5 mt-5">Dashboard</a>
              <a href="#" className="hover:text-white transition-colors">Global View</a>
              <a href="#" className="hover:text-white transition-colors">Simulations</a>
              <a href="#" className="hover:text-white transition-colors">Policy Engine</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Meta-Intelligence Layer</h1>
            <p className="text-slate-500 mt-1">Unified cross-system dependency analysis and risk detection.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE SYNC ACTIVE
            </div>
            <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition-colors">
              EXPORT DATA
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Visualization */}
          <div className="col-span-12 lg:col-span-8 h-[600px]">
            <GlobalGraph />
          </div>

          {/* Side Panels */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <SimulationPanel />
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 mb-4 text-purple-400">
                <Zap size={18} />
                <h3 className="font-semibold uppercase text-xs tracking-widest">Optimization Insights</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Detected redundant services across <span className="text-white font-bold">Banking Core</span> and <span className="text-white font-bold">Identity Provider</span>. 
                Consolidating "User Account Service" could reduce latency by <span className="text-green-400 font-bold">12%</span>.
              </p>
              <button className="mt-4 text-xs text-blue-400 hover:underline font-bold">VIEW RECOMMENDATIONS →</button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="col-span-12 lg:col-span-6">
            <InsightDashboard />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <RiskHeatmap />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-12 py-8 text-center text-slate-600 text-xs">
        <p>© 2026 MetaLayer Intelligence Systems. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-slate-400">Documentation</a>
          <a href="#" className="hover:text-slate-400">API Reference</a>
          <a href="#" className="hover:text-slate-400">Security Policy</a>
        </div>
      </footer>
    </div>
  );
}
