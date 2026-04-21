import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  MarkerType,
} from '@xyflow/react';
import type { NodeTypes, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import type { FlowNode } from '../../store/workflowStore';
import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedNode from '../nodes/AutomatedNode';
import EndNode from '../nodes/EndNode';
import { generateNodeId } from '../../utils/workflowUtils';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDefaultData(type: string): Record<string, any> {
  switch (type) {
    case 'start': return { type: 'start', title: 'Start', metadata: [] };
    case 'task': return { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval': return { type: 'approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated': return { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} };
    case 'end': return { type: 'end', endMessage: 'Workflow completed successfully', summaryFlag: false };
    default: return { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
  }
}

function WorkflowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowWrapper.current) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: FlowNode = {
        id: generateNodeId(),
        type,
        position,
        data: getDefaultData(type),
      };
      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => { setSelectedNode(node.id); },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => { setSelectedNode(null); }, [setSelectedNode]);

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        style={{ background: '#0f1117' }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#6366f1', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#2d3148" />
        <Controls position="bottom-left" style={{ marginBottom: 16, marginLeft: 16 }} />
        <MiniMap
          position="bottom-right"
          style={{ marginBottom: 16, marginRight: 16 }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return '#10b981';
              case 'task': return '#3b82f6';
              case 'approval': return '#f59e0b';
              case 'automated': return '#8b5cf6';
              case 'end': return '#ef4444';
              default: return '#6366f1';
            }
          }}
          maskColor="rgba(10,11,18,0.7)"
        />

        {nodes.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none', zIndex: 4,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>⚙️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f2ff', opacity: 0.5, marginBottom: 8 }}>
              Start Designing Your Workflow
            </div>
            <div style={{ fontSize: 13, color: '#8b92b3', opacity: 0.7 }}>
              Drag node types from the left panel onto the canvas<br />or load a template to get started
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas() {
  return <WorkflowCanvasInner />;
}
