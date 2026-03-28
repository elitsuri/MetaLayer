import { Server } from 'socket.io';
import { z } from 'zod';

// --- Schemas ---

export const EntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  properties: z.record(z.string(), z.any()).optional(),
});

export const RelationshipSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string(),
  weight: z.number().default(1),
});

export const SystemSchema = z.object({
  system_id: z.string(),
  name: z.string(),
  type: z.string(),
  entities: z.array(EntitySchema),
  relationships: z.array(RelationshipSchema),
});

export type Entity = z.infer<typeof EntitySchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export type System = z.infer<typeof SystemSchema>;

export interface GlobalState {
  systems: System[];
  nodes: Entity[];
  links: Relationship[];
  risks: any[];
  insights: any[];
}

// --- MetaLayerEngine ---

export class MetaLayerEngine {
  private systems: Map<string, System> = new Map();
  private globalNodes: Entity[] = [];
  private globalLinks: Relationship[] = [];
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    // Seed with some initial data for demonstration if needed
    this.seedInitialData();
  }

  public ingestSystem(rawSystem: any) {
    try {
      const system = SystemSchema.parse(rawSystem);
      this.systems.set(system.system_id, system);
      this.rebuildGlobalGraph();
      this.broadcastUpdate();
      return { success: true, system_id: system.system_id };
    } catch (error) {
      console.error('Ingestion error:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  private rebuildGlobalGraph() {
    const nodesMap = new Map<string, Entity>();
    const links: Relationship[] = [];

    for (const system of this.systems.values()) {
      // Normalization logic could go here
      system.entities.forEach(e => {
        const globalId = `${system.system_id}:${e.id}`;
        nodesMap.set(globalId, { ...e, id: globalId });
      });

      system.relationships.forEach(r => {
        links.push({
          ...r,
          id: `${system.system_id}:${r.id}`,
          source: `${system.system_id}:${r.source}`,
          target: `${system.system_id}:${r.target}`,
        });
      });
    }

    // Detect cross-system dependencies (mock logic for now)
    // In a real system, this would use entity matching or explicit cross-system links
    this.detectCrossSystemDependencies(nodesMap, links);

    this.globalNodes = Array.from(nodesMap.values());
    this.globalLinks = links;
  }

  private detectCrossSystemDependencies(nodesMap: Map<string, Entity>, links: Relationship[]) {
    // Example: Link entities with same name across systems
    const nodes = Array.from(nodesMap.values());
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        if (n1.name === n2.name && n1.id.split(':')[0] !== n2.id.split(':')[0]) {
          links.push({
            id: `cross:${n1.id}-${n2.id}`,
            source: n1.id,
            target: n2.id,
            type: 'cross-system-sync',
            weight: 2,
          });
        }
      }
    }
  }

  public runSimulation(scenario: any) {
    // Mock simulation logic
    console.log('Running simulation:', scenario);
    const impact = this.calculateImpact(scenario);
    return { scenario, impact };
  }

  private calculateImpact(scenario: any) {
    // Simple cascade risk simulation
    const affectedNodes = new Set<string>();
    if (scenario.targetNode) {
      affectedNodes.add(scenario.targetNode);
      // Find neighbors
      this.globalLinks.forEach(l => {
        if (l.source === scenario.targetNode) affectedNodes.add(l.target);
      });
    }
    return {
      affectedCount: affectedNodes.size,
      nodes: Array.from(affectedNodes),
      riskLevel: affectedNodes.size > 5 ? 'high' : 'medium',
    };
  }

  public getGlobalState(): GlobalState {
    return {
      systems: Array.from(this.systems.values()),
      nodes: this.globalNodes,
      links: this.globalLinks,
      risks: this.analyzeRisks(),
      insights: this.generateInsights(),
    };
  }

  private analyzeRisks() {
    // Detect bottlenecks or high-centrality nodes
    return this.globalNodes
      .map(n => {
        const connections = this.globalLinks.filter(l => l.source === n.id || l.target === n.id).length;
        return { nodeId: n.id, riskScore: connections * 10, type: connections > 3 ? 'bottleneck' : 'stable' };
      })
      .filter(r => r.riskScore > 20);
  }

  private generateInsights() {
    return [
      { title: 'System Connectivity', value: `${((this.globalLinks.length / (this.globalNodes.length || 1)) * 100).toFixed(1)}%` },
      { title: 'Active Systems', value: this.systems.size },
      { title: 'Global Entities', value: this.globalNodes.length },
    ];
  }

  private broadcastUpdate() {
    this.io.emit('update', this.getGlobalState());
  }

  private seedInitialData() {
    const sys1: System = {
      system_id: 'banking-core',
      name: 'Banking Core',
      type: 'financial',
      entities: [
        { id: 'acc1', name: 'User Account Service', type: 'service' },
        { id: 'db1', name: 'Transaction DB', type: 'database' },
      ],
      relationships: [
        { id: 'r1', source: 'acc1', target: 'db1', type: 'dependency', weight: 1 },
      ],
    };

    const sys2: System = {
      system_id: 'auth-provider',
      name: 'Identity Provider',
      type: 'security',
      entities: [
        { id: 'auth1', name: 'OAuth Service', type: 'service' },
        { id: 'user1', name: 'User Account Service', type: 'service' }, // Shared name for cross-system link
      ],
      relationships: [
        { id: 'r2', source: 'auth1', target: 'user1', type: 'dependency', weight: 1 },
      ],
    };

    this.ingestSystem(sys1);
    this.ingestSystem(sys2);
  }
}
