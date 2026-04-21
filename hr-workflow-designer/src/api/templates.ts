import { WorkflowNode, WorkflowEdge, WorkflowTemplate } from '../types/workflow';

const makeId = () => `node_${Math.random().toString(36).slice(2, 8)}`;
const makeEdgeId = (s: string, t: string) => `edge_${s}_${t}`;

// ─── Onboarding Workflow Template ─────────────────────────────────────────────

const onboardingNodes: WorkflowNode[] = [
  { id: 's1', type: 'start', position: { x: 250, y: 50 }, data: { type: 'start', title: 'Employee Onboarding Started', metadata: [{ key: 'department', value: 'Engineering' }] } },
  { id: 't1', type: 'task', position: { x: 250, y: 180 }, data: { type: 'task', title: 'Collect Personal Documents', description: 'Gather ID, address proof, and educational certificates', assignee: 'HR Admin', dueDate: '2025-01-10', customFields: [] } },
  { id: 'a1', type: 'approval', position: { x: 250, y: 310 }, data: { type: 'approval', title: 'Document Verification Approval', approverRole: 'HRBP', autoApproveThreshold: 3 } },
  { id: 'au1', type: 'automated', position: { x: 250, y: 440 }, data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'employee@company.com', subject: 'Welcome to the Team!', body: 'We are excited to have you.' } } },
  { id: 't2', type: 'task', position: { x: 250, y: 570 }, data: { type: 'task', title: 'IT Equipment Setup', description: 'Configure laptop, accounts, and access permissions', assignee: 'IT Team', dueDate: '2025-01-12', customFields: [{ key: 'priority', value: 'high' }] } },
  { id: 'e1', type: 'end', position: { x: 250, y: 700 }, data: { type: 'end', endMessage: 'Onboarding Complete! Employee is ready to start.', summaryFlag: true } },
];

const onboardingEdges: WorkflowEdge[] = [
  { id: makeEdgeId('s1', 't1'), source: 's1', target: 't1' },
  { id: makeEdgeId('t1', 'a1'), source: 't1', target: 'a1' },
  { id: makeEdgeId('a1', 'au1'), source: 'a1', target: 'au1' },
  { id: makeEdgeId('au1', 't2'), source: 'au1', target: 't2' },
  { id: makeEdgeId('t2', 'e1'), source: 't2', target: 'e1' },
];

// ─── Leave Approval Workflow Template ────────────────────────────────────────

const leaveNodes: WorkflowNode[] = [
  { id: 'ls1', type: 'start', position: { x: 250, y: 50 }, data: { type: 'start', title: 'Leave Request Submitted', metadata: [{ key: 'type', value: 'Casual Leave' }] } },
  { id: 'lt1', type: 'task', position: { x: 250, y: 180 }, data: { type: 'task', title: 'Review Leave Application', description: 'Manager reviews the leave request and checks team availability', assignee: 'Line Manager', dueDate: '', customFields: [] } },
  { id: 'la1', type: 'approval', position: { x: 250, y: 310 }, data: { type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 2 } },
  { id: 'lau1', type: 'automated', position: { x: 250, y: 440 }, data: { type: 'automated', title: 'Update HRMS Leave Balance', actionId: 'update_hrms', actionParams: { employeeId: 'EMP001', field: 'leaveBalance', value: '-1' } } },
  { id: 'lau2', type: 'automated', position: { x: 550, y: 440 }, data: { type: 'automated', title: 'Notify Team on Slack', actionId: 'send_slack', actionParams: { channel: '#team-updates', message: 'Employee on leave' } } },
  { id: 'le1', type: 'end', position: { x: 400, y: 570 }, data: { type: 'end', endMessage: 'Leave Approved and Processed Successfully', summaryFlag: false } },
];

const leaveEdges: WorkflowEdge[] = [
  { id: makeEdgeId('ls1', 'lt1'), source: 'ls1', target: 'lt1' },
  { id: makeEdgeId('lt1', 'la1'), source: 'lt1', target: 'la1' },
  { id: makeEdgeId('la1', 'lau1'), source: 'la1', target: 'lau1' },
  { id: makeEdgeId('la1', 'lau2'), source: 'la1', target: 'lau2' },
  { id: makeEdgeId('lau1', 'le1'), source: 'lau1', target: 'le1' },
  { id: makeEdgeId('lau2', 'le1'), source: 'lau2', target: 'le1' },
];

// ─── Document Verification Workflow Template ──────────────────────────────────

const docVerNodes: WorkflowNode[] = [
  { id: 'ds1', type: 'start', position: { x: 250, y: 50 }, data: { type: 'start', title: 'Document Submission Received', metadata: [{ key: 'docType', value: 'KYC Documents' }] } },
  { id: 'dt1', type: 'task', position: { x: 250, y: 180 }, data: { type: 'task', title: 'Initial Document Check', description: 'Verify completeness of submitted documents', assignee: 'Compliance Officer', dueDate: '', customFields: [{ key: 'checklist', value: 'ID, PAN, Aadhaar' }] } },
  { id: 'dau1', type: 'automated', position: { x: 250, y: 310 }, data: { type: 'automated', title: 'Generate Verification Report', actionId: 'generate_doc', actionParams: { template: 'KYC-Report', recipient: 'compliance@company.com', format: 'PDF' } } },
  { id: 'da1', type: 'approval', position: { x: 250, y: 440 }, data: { type: 'approval', title: 'Compliance Head Approval', approverRole: 'Director', autoApproveThreshold: 5 } },
  { id: 'dau2', type: 'automated', position: { x: 250, y: 570 }, data: { type: 'automated', title: 'Create Jira Verification Ticket', actionId: 'create_jira', actionParams: { project: 'COMP', summary: 'KYC Verification Complete', assignee: 'legal-team' } } },
  { id: 'de1', type: 'end', position: { x: 250, y: 700 }, data: { type: 'end', endMessage: 'Document Verification Complete - Employee Cleared', summaryFlag: true } },
];

const docVerEdges: WorkflowEdge[] = [
  { id: makeEdgeId('ds1', 'dt1'), source: 'ds1', target: 'dt1' },
  { id: makeEdgeId('dt1', 'dau1'), source: 'dt1', target: 'dau1' },
  { id: makeEdgeId('dau1', 'da1'), source: 'dau1', target: 'da1' },
  { id: makeEdgeId('da1', 'dau2'), source: 'da1', target: 'dau2' },
  { id: makeEdgeId('dau2', 'de1'), source: 'dau2', target: 'de1' },
];

// ─── Export Templates ──────────────────────────────────────────────────────────

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    description: 'Complete onboarding workflow with document collection, verification, and system setup',
    icon: '🚀',
    nodes: onboardingNodes,
    edges: onboardingEdges,
  },
  {
    id: 'leave-approval',
    name: 'Leave Approval',
    description: 'Standard leave request approval with manager sign-off and HRMS update',
    icon: '📅',
    nodes: leaveNodes,
    edges: leaveEdges,
  },
  {
    id: 'doc-verification',
    name: 'Document Verification',
    description: 'KYC and compliance document verification with auto-generated reports',
    icon: '📄',
    nodes: docVerNodes,
    edges: docVerEdges,
  },
];
