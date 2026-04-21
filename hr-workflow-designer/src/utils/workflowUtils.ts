import type { FlowNode, FlowEdge } from '../store/workflowStore';
import type { WorkflowJSON, WorkflowNodeData } from '../types/workflow';

// ─── ID Generation ────────────────────────────────────────────────────────────

export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function generateEdgeId(source: string, target: string): string {
  return `edge_${source}_${target}_${Date.now()}`;
}

// ─── Workflow Serialization ───────────────────────────────────────────────────

export function serializeWorkflow(
  nodes: FlowNode[],
  edges: FlowEdge[],
  name = 'Untitled Workflow'
): WorkflowJSON {
  return {
    version: '1.0.0',
    name,
    createdAt: new Date().toISOString(),
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type || 'task',
      position: n.position,
      data: n.data as WorkflowNodeData,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    })),
  };
}

// ─── Workflow Validation ──────────────────────────────────────────────────────

export interface ValidationError {
  nodeId?: string;
  message: string;
  type: 'error' | 'warning';
}

export function validateWorkflow(
  nodes: FlowNode[],
  edges: FlowEdge[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (nodes.length === 0) return errors;

  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have a Start Node', type: 'error' });
  }
  if (startNodes.length > 1) {
    startNodes.slice(1).forEach((n) => {
      errors.push({ nodeId: n.id, message: 'Only one Start Node is allowed', type: 'error' });
    });
  }
  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have an End Node', type: 'error' });
  }

  nodes.forEach((node) => {
    if (node.type === 'start') {
      const hasOutgoing = edges.some((e) => e.source === node.id);
      if (!hasOutgoing && nodes.length > 1) {
        errors.push({ nodeId: node.id, message: 'Start Node has no outgoing connections', type: 'warning' });
      }
    } else if (node.type === 'end') {
      const hasIncoming = edges.some((e) => e.target === node.id);
      if (!hasIncoming) {
        errors.push({ nodeId: node.id, message: 'End Node has no incoming connections', type: 'warning' });
      }
    } else {
      const hasIncoming = edges.some((e) => e.target === node.id);
      const hasOutgoing = edges.some((e) => e.source === node.id);
      if (!hasIncoming) {
        errors.push({ nodeId: node.id, message: 'Node has no incoming connections', type: 'warning' });
      }
      if (!hasOutgoing) {
        errors.push({ nodeId: node.id, message: 'Node has no outgoing connections', type: 'warning' });
      }
    }

    const data = node.data as { type?: string; title?: string; actionId?: string };
    if (data.type === 'task' && !data.title?.trim()) {
      errors.push({ nodeId: node.id, message: 'Task Node: Title is required', type: 'error' });
    }
    if (data.type === 'automated' && !data.actionId) {
      errors.push({ nodeId: node.id, message: 'Automated Step: Action is required', type: 'error' });
    }
  });

  // Cycle detection
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    if (adj.has(e.source)) adj.get(e.source)!.push(e.target);
  });

  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    inStack.add(nodeId);
    for (const neighbor of (adj.get(nodeId) || [])) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        return true;
      }
    }
    inStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        errors.push({ message: 'Workflow contains cyclic connections', type: 'error' });
        break;
      }
    }
  }

  return errors;
}

// ─── Export / Import ──────────────────────────────────────────────────────────

export function exportWorkflowToFile(workflow: WorkflowJSON): void {
  const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${workflow.name.replace(/\s+/g, '-').toLowerCase()}-workflow.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importWorkflowFromFile(): Promise<WorkflowJSON> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return reject(new Error('No file selected'));
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string) as WorkflowJSON;
          resolve(json);
        } catch {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}

// ─── Node Type Config ─────────────────────────────────────────────────────────

export const NODE_TYPE_CONFIG = {
  start: { label: 'Start', color: '#10b981', bg: '#064e3b', border: '#10b981' },
  task: { label: 'Task', color: '#3b82f6', bg: '#1e3a5f', border: '#3b82f6' },
  approval: { label: 'Approval', color: '#f59e0b', bg: '#451a03', border: '#f59e0b' },
  automated: { label: 'Automated Step', color: '#8b5cf6', bg: '#2e1065', border: '#8b5cf6' },
  end: { label: 'End', color: '#ef4444', bg: '#450a0a', border: '#ef4444' },
} as const;
