import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useMetaStore } from '../store/useMetaStore';

export const GlobalGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useMetaStore();
  const { nodes, links } = state;

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
    svg.call(zoom);

    const simulation = d3.forceSimulation<any>(nodes)
      .force('link', d3.forceLink<any, any>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    const link = g.append('g')
      .attr('stroke', '#444')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.weight || 1) * 2)
      .attr('stroke-dasharray', d => d.type === 'cross-system-sync' ? '5,5' : '0');

    const node = g.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', 12)
      .attr('fill', d => {
        if (d.type === 'service') return '#3b82f6';
        if (d.type === 'database') return '#10b981';
        return '#6366f1';
      });

    node.append('text')
      .text(d => d.name)
      .attr('x', 15)
      .attr('y', 5)
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8')
      .attr('stroke', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [nodes, links]);

  return (
    <div className="w-full h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur p-2 rounded border border-slate-700 text-xs text-slate-400">
        Global Dependency Graph
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
