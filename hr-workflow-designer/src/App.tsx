import { useEffect, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useStore } from 'zustand';
import Toolbar from './components/ui/Toolbar';
import NodePalette from './components/sidebar/NodePalette';
import TemplatesPanel from './components/sidebar/TemplatesPanel';
import WorkflowCanvas from './components/ui/WorkflowCanvas';
import NodeFormPanel from './components/forms/NodeFormPanel';
import SandboxPanel from './components/panels/SandboxPanel';
import { useWorkflowStore } from './store/workflowStore';
import { validateWorkflow } from './utils/workflowUtils';

export default function App() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const isSandboxOpen = useWorkflowStore((s) => s.isSandboxOpen);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  // Access temporal store for keyboard shortcuts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temporalStore = (useWorkflowStore as any).temporal;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temporal = useStore(temporalStore) as any;

  // Keyboard shortcuts for undo/redo
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        temporal?.undo?.();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        temporal?.redo?.();
      }
    },
    [temporal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Sync validation errors to node data
  useEffect(() => {
    const errors = validateWorkflow(nodes, edges);
    const errMap = new Map<string, string>();
    errors.forEach((err) => {
      if (err.nodeId) errMap.set(err.nodeId, err.message);
    });

    nodes.forEach((node) => {
      const errMsg = errMap.get(node.id);
      const hasError = !!errMsg;
      const currentData = node.data as { hasError?: boolean; errorMessage?: string };
      if (currentData.hasError !== hasError || currentData.errorMessage !== errMsg) {
        updateNodeData(node.id, {
          ...node.data,
          hasError,
          errorMessage: errMsg || '',
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1117', overflow: 'hidden' }}>
      <Toolbar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #2d3148', overflowY: 'auto' }}>
          <NodePalette />
          <TemplatesPanel />
        </div>

        {/* Canvas */}
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>

        {/* Right panels */}
        {selectedNodeId && !isSandboxOpen && (
          <NodeFormPanel nodeId={selectedNodeId} />
        )}
        {isSandboxOpen && <SandboxPanel />}
      </div>
    </div>
  );
}
