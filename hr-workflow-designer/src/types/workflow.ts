// ─── Node Types ──────────────────────────────────────────────────────────────

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValuePair {
  key: string;
  value: string;
}

// Start Node
export interface StartNodeData {
  type: 'start';
  title: string;
  metadata: KeyValuePair[];
  hasError?: boolean;
  errorMessage?: string;
}

// Task Node
export interface TaskNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
  hasError?: boolean;
  errorMessage?: string;
}

// Approval Node
export type ApproverRole = 'Manager' | 'HRBP' | 'Director' | 'VP' | 'CEO';

export interface ApprovalNodeData {
  type: 'approval';
  title: string;
  approverRole: ApproverRole;
  autoApproveThreshold: number;
  hasError?: boolean;
  errorMessage?: string;
}

// Automated Step Node
export interface AutomatedStepNodeData {
  type: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
  hasError?: boolean;
  errorMessage?: string;
}

// End Node
export interface EndNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

// ─── API Types ───────────────────────────────────────────────────────────────

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  description?: string;
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  nodeTitle: string;
  status: 'success' | 'warning' | 'error' | 'skipped';
  message: string;
  timestamp: number;
  duration: number;
}

export interface SimulationResult {
  success: boolean;
  totalSteps: number;
  completedSteps: number;
  steps: SimulationStep[];
  summary: string;
  errors: string[];
}

// ─── Workflow Types ───────────────────────────────────────────────────────────

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface WorkflowJSON {
  version: string;
  name: string;
  createdAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ─── Template Types ───────────────────────────────────────────────────────────

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
