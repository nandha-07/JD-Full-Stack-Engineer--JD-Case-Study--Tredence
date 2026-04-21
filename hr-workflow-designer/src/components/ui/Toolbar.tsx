import React, { useCallback } from 'react';
import {
  Download, Upload, Undo2, Redo2, Trash2, FlaskConical,
  AlertTriangle, CheckCircle, Edit3,
} from 'lucide-react';
import { useStore } from 'zustand';
import { MarkerType } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import {
  exportWorkflowToFile,
  importWorkflowFromFile,
  serializeWorkflow,
  validateWorkflow,
} from '../../utils/workflowUtils';

export default function Toolbar() {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const isSandboxOpen = useWorkflowStore((s) => s.isSandboxOpen);
  const clearCanvas = useWorkflowStore((s) => s.clearCanvas);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const toggleSandbox = useWorkflowStore((s) => s.toggleSandbox);
  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);

  // Access the temporal store for undo/redo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temporalStore = (useWorkflowStore as any).temporal;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { undo, redo, pastStates, futureStates } = useStore(temporalStore) as any;

  const canUndo = pastStates?.length > 0;
  const canRedo = futureStates?.length > 0;

  const validationErrors = validateWorkflow(nodes, edges);
  const errorCount = validationErrors.filter((e) => e.type === 'error').length;
  const warningCount = validationErrors.filter((e) => e.type === 'warning').length;

  const handleExport = useCallback(() => {
    const workflow = serializeWorkflow(nodes, edges, workflowName);
    exportWorkflowToFile(workflow);
  }, [nodes, edges, workflowName]);

  const handleImport = useCallback(async () => {
    try {
      const workflow = await importWorkflowFromFile();
      const edgeStyle = {
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
        style: { stroke: '#6366f1', strokeWidth: 2 },
        type: 'smoothstep',
      };
      clearCanvas();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNodes(workflow.nodes as any);
      setEdges(workflow.edges.map((e) => ({ ...e, ...edgeStyle })));
      setWorkflowName(workflow.name);
    } catch (err) {
      alert('Failed to import workflow: ' + (err as Error).message);
    }
  }, [clearCanvas, setNodes, setEdges, setWorkflowName]);

  const handleClear = useCallback(() => {
    if (nodes.length === 0 || window.confirm('Clear the canvas? This action cannot be undone.')) {
      clearCanvas();
    }
  }, [nodes.length, clearCanvas]);

  const [editingName, setEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState(workflowName);

  const commitName = () => {
    setWorkflowName(nameInput || 'Untitled Workflow');
    setEditingName(false);
  };

  const btnStyle = (active?: boolean, danger?: boolean): React.CSSProperties => ({
    background: active ? 'rgba(99,102,241,0.2)' : danger ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : danger ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 7,
    padding: '6px 10px',
    cursor: 'pointer',
    color: active ? '#818cf8' : danger ? '#f87171' : '#8b92b3',
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 12, fontWeight: 500,
    transition: 'all 0.15s ease', whiteSpace: 'nowrap',
  });

  const iconBtn = (active?: boolean, disabled?: boolean, danger?: boolean): React.CSSProperties => ({
    ...btnStyle(active, danger),
    padding: '6px 8px',
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  return (
    <div style={{
      height: 52, background: '#1a1d27', borderBottom: '1px solid #2d3148',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
        <div style={{
          width: 28, height: 28,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>⚙</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#f0f2ff', lineHeight: 1.1 }}>HR Workflow</div>
          <div style={{ fontSize: 9, color: '#8b92b3' }}>Designer</div>
        </div>
      </div>

      <div style={{ width: 1, height: 24, background: '#2d3148' }} />

      {/* Workflow name */}
      {editingName ? (
        <input
          autoFocus
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false); }}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.5)', borderRadius: 6, padding: '4px 8px', fontSize: 13, fontWeight: 500, color: '#f0f2ff', outline: 'none', minWidth: 160 }}
        />
      ) : (
        <button
          onClick={() => { setNameInput(workflowName); setEditingName(true); }}
          style={{ background: 'none', border: '1px solid transparent', borderRadius: 6, padding: '4px 6px', fontSize: 13, fontWeight: 500, color: '#f0f2ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2d3148'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
        >
          {workflowName} <Edit3 size={10} color="#8b92b3" />
        </button>
      )}

      <div style={{ width: 1, height: 24, background: '#2d3148' }} />

      {/* Undo / Redo */}
      <button onClick={() => undo?.()} disabled={!canUndo} style={iconBtn(false, !canUndo)} title="Undo (Ctrl+Z)">
        <Undo2 size={14} />
      </button>
      <button onClick={() => redo?.()} disabled={!canRedo} style={iconBtn(false, !canRedo)} title="Redo (Ctrl+Y)">
        <Redo2 size={14} />
      </button>

      <div style={{ width: 1, height: 24, background: '#2d3148' }} />

      {/* Export / Import / Clear */}
      <button onClick={handleExport} style={btnStyle()} title="Export workflow as JSON">
        <Download size={13} /> Export
      </button>
      <button onClick={handleImport} style={btnStyle()} title="Import workflow from JSON">
        <Upload size={13} /> Import
      </button>
      <button onClick={handleClear} style={btnStyle(false, true)} title="Clear canvas">
        <Trash2 size={13} /> Clear
      </button>

      <div style={{ flex: 1 }} />

      {/* Validation status */}
      {nodes.length > 0 && (
        errorCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: '#f87171' }}>
            <AlertTriangle size={12} /> {errorCount} error{errorCount !== 1 ? 's' : ''}
          </div>
        ) : warningCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: '#fbbf24' }}>
            <AlertTriangle size={12} /> {warningCount} warning{warningCount !== 1 ? 's' : ''}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: '#10b981' }}>
            <CheckCircle size={12} /> Valid
          </div>
        )
      )}

      <div style={{ width: 1, height: 24, background: '#2d3148' }} />

      {/* Sandbox toggle */}
      <button onClick={toggleSandbox} style={btnStyle(isSandboxOpen)} title="Toggle Sandbox Panel">
        <FlaskConical size={13} /> Sandbox
      </button>
    </div>
  );
}
