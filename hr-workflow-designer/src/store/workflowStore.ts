import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import type { SimulationResult } from '../types/workflow';

// Use loose Record<string, unknown> to satisfy React Flow's generic constraint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WorkflowNodeRecord = Record<string, any>;
export type FlowNode = Node<WorkflowNodeRecord>;
export type FlowEdge = Edge;

export interface WorkflowState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  isSandboxOpen: boolean;
  workflowName: string;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: FlowNode) => void;
  updateNodeData: (nodeId: string, data: WorkflowNodeRecord) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;

  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  clearCanvas: () => void;
  setWorkflowName: (name: string) => void;

  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSimulating: (v: boolean) => void;
  toggleSandbox: () => void;
  setSandboxOpen: (v: boolean) => void;
}

const defaultEdgeStyle = {
  markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
  style: { stroke: '#6366f1', strokeWidth: 2 },
  type: 'smoothstep',
  animated: false,
};

export const useWorkflowStore = create<WorkflowState>()(
  temporal(
    (set) => ({
      nodes: [] as FlowNode[],
      edges: [] as FlowEdge[],
      selectedNodeId: null,
      simulationResult: null,
      isSimulating: false,
      isSandboxOpen: false,
      workflowName: 'Untitled Workflow',

      onNodesChange: (changes: NodeChange[]) =>
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes) as FlowNode[],
        })),

      onEdgesChange: (changes: EdgeChange[]) =>
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges) as FlowEdge[],
        })),

      onConnect: (connection: Connection) =>
        set((state) => ({
          edges: addEdge({ ...connection, ...defaultEdgeStyle }, state.edges) as FlowEdge[],
        })),

      addNode: (node: FlowNode) =>
        set((state) => ({ nodes: [...state.nodes, node] })),

      updateNodeData: (nodeId: string, data: WorkflowNodeRecord) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
          ),
        })),

      deleteNode: (nodeId: string) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
          selectedNodeId:
            state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        })),

      deleteEdge: (edgeId: string) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== edgeId),
        })),

      setSelectedNode: (nodeId: string | null) =>
        set({ selectedNodeId: nodeId }),

      setNodes: (nodes: FlowNode[]) => set({ nodes }),
      setEdges: (edges: FlowEdge[]) => set({ edges }),

      clearCanvas: () =>
        set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          simulationResult: null,
        }),

      setWorkflowName: (name: string) => set({ workflowName: name }),

      setSimulationResult: (result: SimulationResult | null) =>
        set({ simulationResult: result }),
      setIsSimulating: (v: boolean) => set({ isSimulating: v }),
      toggleSandbox: () =>
        set((state) => ({ isSandboxOpen: !state.isSandboxOpen })),
      setSandboxOpen: (v: boolean) => set({ isSandboxOpen: v }),
    }),
    {
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        workflowName: state.workflowName,
      }),
    }
  )
);
