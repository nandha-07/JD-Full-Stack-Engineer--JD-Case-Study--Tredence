import { AutomationAction, SimulationResult, WorkflowJSON } from '../types/workflow';

// ─── GET /automations ─────────────────────────────────────────────────────────

export const MOCK_AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
    description: 'Sends an automated email notification',
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient', 'format'],
    description: 'Generates a document from a predefined template',
  },
  {
    id: 'send_slack',
    label: 'Send Slack Notification',
    params: ['channel', 'message'],
    description: 'Posts a message to a Slack channel',
  },
  {
    id: 'create_jira',
    label: 'Create Jira Ticket',
    params: ['project', 'summary', 'assignee'],
    description: 'Creates a Jira issue in the specified project',
  },
  {
    id: 'update_hrms',
    label: 'Update HRMS Record',
    params: ['employeeId', 'field', 'value'],
    description: 'Updates an employee record in the HRMS system',
  },
  {
    id: 'trigger_webhook',
    label: 'Trigger Webhook',
    params: ['url', 'method', 'payload'],
    description: 'Sends an HTTP request to an external webhook endpoint',
  },
  {
    id: 'schedule_meeting',
    label: 'Schedule Meeting',
    params: ['attendees', 'title', 'duration'],
    description: 'Schedules a meeting using the calendar integration',
  },
  {
    id: 'send_sms',
    label: 'Send SMS',
    params: ['phone', 'message'],
    description: 'Sends an SMS notification via Twilio',
  },
];

// ─── GET /automations handler ─────────────────────────────────────────────────

export async function getAutomations(): Promise<AutomationAction[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_AUTOMATIONS;
}

// ─── POST /simulate handler ───────────────────────────────────────────────────

export async function simulateWorkflow(
  workflow: WorkflowJSON
): Promise<SimulationResult> {
  await new Promise((r) => setTimeout(r, 800));

  const errors: string[] = [];
  const steps: SimulationResult['steps'] = [];

  // Validate workflow structure
  const nodeIds = new Set(workflow.nodes.map((n) => n.id));
  const startNodes = workflow.nodes.filter((n) => n.type === 'start');
  const endNodes = workflow.nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push('Workflow must have at least one Start Node');
  }
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one End Node');
  }
  if (startNodes.length > 1) {
    errors.push('Workflow should have only one Start Node');
  }

  // Check for orphan nodes
  workflow.nodes.forEach((node) => {
    if (node.type === 'start') return;
    if (node.type === 'end') return;
    const hasIncoming = workflow.edges.some((e) => e.target === node.id);
    const hasOutgoing = workflow.edges.some((e) => e.source === node.id);
    if (!hasIncoming) {
      errors.push(`Node "${(node.data as { title?: string }).title || node.id}" has no incoming connections`);
    }
    if (!hasOutgoing) {
      errors.push(`Node "${(node.data as { title?: string }).title || node.id}" has no outgoing connections`);
    }
  });

  // Check for disconnected edges
  workflow.edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      errors.push(`Edge references a non-existent node`);
    }
  });

  if (errors.length > 0 && startNodes.length === 0) {
    return {
      success: false,
      totalSteps: workflow.nodes.length,
      completedSteps: 0,
      steps: [],
      summary: 'Simulation failed: Invalid workflow structure',
      errors,
    };
  }

  // Build adjacency map for BFS traversal
  const adjacency = new Map<string, string[]>();
  workflow.nodes.forEach((n) => adjacency.set(n.id, []));
  workflow.edges.forEach((e) => {
    if (adjacency.has(e.source)) {
      adjacency.get(e.source)!.push(e.target);
    }
  });

  // BFS from start node
  const visited = new Set<string>();
  const queue: string[] = startNodes.map((n) => n.id);
  let stepIndex = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const node = workflow.nodes.find((n) => n.id === current);
    if (!node) continue;

    const nodeData = node.data as { title?: string; endMessage?: string; actionId?: string };
    const title = nodeData.title || nodeData.endMessage || 'Unnamed Node';
    const duration = Math.floor(Math.random() * 300) + 100;

    const step: SimulationResult['steps'][0] = {
      nodeId: node.id,
      nodeType: node.type as any,
      nodeTitle: title,
      status: 'success',
      message: getStepMessage(node.type, title, nodeData),
      timestamp: Date.now() + stepIndex * 500,
      duration,
    };

    // Add some variety
    if (node.type === 'approval' && Math.random() > 0.7) {
      step.status = 'warning';
      step.message = `Approval pending review by ${(node.data as any).approverRole || 'Manager'}`;
    }

    steps.push(step);
    stepIndex++;

    const neighbors = adjacency.get(current) || [];
    neighbors.forEach((n) => {
      if (!visited.has(n)) queue.push(n);
    });
  }

  const completedSteps = steps.filter((s) => s.status === 'success').length;
  const hasWarnings = steps.some((s) => s.status === 'warning');

  return {
    success: errors.length === 0,
    totalSteps: workflow.nodes.length,
    completedSteps,
    steps,
    summary:
      errors.length > 0
        ? `Simulation completed with ${errors.length} validation issue(s)`
        : hasWarnings
        ? `Workflow simulated successfully with ${steps.filter((s) => s.status === 'warning').length} pending step(s)`
        : `Workflow executed successfully across ${steps.length} step(s)`,
    errors,
  };
}

function getStepMessage(
  type: string,
  title: string,
  data: Record<string, unknown>
): string {
  switch (type) {
    case 'start':
      return `Workflow initiated: "${title}"`;
    case 'task':
      return `Task "${title}" assigned to ${data['assignee'] || 'unassigned'}${data['dueDate'] ? `, due ${data['dueDate']}` : ''}`;
    case 'approval':
      return `Approval step "${title}" submitted to ${data['approverRole'] || 'Manager'} for review`;
    case 'automated':
      return `Automated action "${MOCK_AUTOMATIONS.find((a) => a.id === data['actionId'])?.label || data['actionId'] || 'Unknown'}" executed successfully`;
    case 'end':
      return `Workflow completed: ${data['endMessage'] || 'Process finished'}`;
    default:
      return `Step "${title}" completed`;
  }
}
