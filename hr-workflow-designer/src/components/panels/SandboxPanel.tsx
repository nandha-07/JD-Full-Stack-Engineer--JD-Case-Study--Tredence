import React, { useCallback } from 'react';
import {
  Play,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Loader,
  ChevronRight,
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { simulateWorkflow } from '../../api/mockApi';
import { serializeWorkflow } from '../../utils/workflowUtils';
import { SimulationStep } from '../../types/workflow';

const STATUS_CONFIG = {
  success: { icon: <CheckCircle size={14} color="#10b981" />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  warning: { icon: <AlertTriangle size={14} color="#f59e0b" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  error: { icon: <XCircle size={14} color="#ef4444" />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  skipped: { icon: <Clock size={14} color="#8b92b3" />, color: '#8b92b3', bg: 'rgba(139,146,179,0.1)', border: 'rgba(139,146,179,0.2)' },
};

const NODE_TYPE_BADGE: Record<string, { label: string; color: string }> = {
  start: { label: 'START', color: '#10b981' },
  task: { label: 'TASK', color: '#3b82f6' },
  approval: { label: 'APPROVAL', color: '#f59e0b' },
  automated: { label: 'AUTO', color: '#8b5cf6' },
  end: { label: 'END', color: '#ef4444' },
};

function StepRow({ step, index }: { step: SimulationStep; index: number }) {
  const sc = STATUS_CONFIG[step.status];
  const badge = NODE_TYPE_BADGE[step.nodeType];

  return (
    <div
      className="animate-slide-up"
      style={{
        display: 'flex',
        gap: 10,
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Step number */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: sc.bg,
          border: `1px solid ${sc.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 10,
          fontWeight: 700,
          color: sc.color,
        }}
      >
        {index + 1}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          {badge && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: badge.color,
                background: `${badge.color}15`,
                border: `1px solid ${badge.color}30`,
                borderRadius: 4,
                padding: '1px 5px',
                letterSpacing: '0.05em',
              }}
            >
              {badge.label}
            </span>
          )}
          <span style={{ fontSize: 12, fontWeight: 600, color: '#f0f2ff' }}>
            {step.nodeTitle}
          </span>
          {sc.icon}
        </div>
        <div style={{ fontSize: 11, color: '#8b92b3', lineHeight: 1.4 }}>
          {step.message}
        </div>
        <div style={{ fontSize: 10, color: '#6b7296', marginTop: 3 }}>
          ~{step.duration}ms
        </div>
      </div>
    </div>
  );
}

export default function SandboxPanel() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const simulationResult = useWorkflowStore((s) => s.simulationResult);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  const setSandboxOpen = useWorkflowStore((s) => s.setSandboxOpen);
  const setSimulationResult = useWorkflowStore((s) => s.setSimulationResult);
  const setIsSimulating = useWorkflowStore((s) => s.setIsSimulating);

  const handleSimulate = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Add some nodes to the canvas first!');
      return;
    }
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const workflow = serializeWorkflow(nodes as any, edges as any, workflowName);
      const result = await simulateWorkflow(workflow);
      setSimulationResult(result);
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, workflowName, setIsSimulating, setSimulationResult]);

  const result = simulationResult;

  return (
    <div
      style={{
        width: 380,
        height: '100%',
        background: '#1a1d27',
        borderLeft: '1px solid #2d3148',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      className="animate-slide-in"
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #2d3148',
          background: '#1e2130',
          flexShrink: 0,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f2ff' }}>
              🧪 Workflow Sandbox
            </div>
            <div style={{ fontSize: 11, color: '#8b92b3', marginTop: 2 }}>
              Simulate & validate your workflow
            </div>
          </div>
          <button
            onClick={() => setSandboxOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              padding: 5,
              cursor: 'pointer',
              color: '#8b92b3',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Run button */}
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          style={{
            marginTop: 12,
            width: '100%',
            background: isSimulating ? '#374151' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            border: 'none',
            borderRadius: 8,
            padding: '9px 16px',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.2s ease',
          }}
        >
          {isSimulating ? (
            <>
              <Loader size={14} className="animate-spin" /> Simulating...
            </>
          ) : (
            <>
              <Play size={14} /> Run Simulation
            </>
          )}
        </button>
      </div>

      {/* Result area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {!result && !isSimulating && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#8b92b3',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f2ff', marginBottom: 6 }}>
              Ready to Simulate
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.5 }}>
              Design your workflow and click "Run Simulation" to see a step-by-step execution log.
            </div>
          </div>
        )}

        {isSimulating && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 13, color: '#8b92b3' }}>Running simulation...</div>
          </div>
        )}

        {result && !isSimulating && (
          <div className="animate-fade-in">
            {/* Summary card */}
            <div
              style={{
                background: result.success ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${result.success ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 16,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle size={16} color="#10b981" />
                ) : (
                  <AlertTriangle size={16} color="#f59e0b" />
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: result.success ? '#10b981' : '#f59e0b' }}>
                  {result.success ? 'Simulation Successful' : 'Validation Issues Found'}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#8b92b3', marginBottom: 8 }}>
                {result.summary}
              </div>
              <div className="flex gap-3">
                <div style={{ fontSize: 11, color: '#8b92b3' }}>
                  <span style={{ color: '#f0f2ff', fontWeight: 600 }}>{result.totalSteps}</span> total nodes
                </div>
                <ChevronRight size={10} color="#6b7296" style={{ alignSelf: 'center' }} />
                <div style={{ fontSize: 11, color: '#8b92b3' }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{result.completedSteps}</span> completed
                </div>
              </div>
            </div>

            {/* Validation errors */}
            {result.errors.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: '0.05em', marginBottom: 8 }}>
                  VALIDATION ISSUES
                </div>
                {result.errors.map((err, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 6,
                      padding: '7px 10px',
                      fontSize: 11,
                      color: '#fca5a5',
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 6,
                    }}
                  >
                    <XCircle size={12} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                    {err}
                  </div>
                ))}
              </div>
            )}

            {/* Step-by-step log */}
            {result.steps.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8b92b3', letterSpacing: '0.05em', marginBottom: 8 }}>
                  EXECUTION LOG
                </div>
                {result.steps.map((step, i) => (
                  <StepRow key={step.nodeId} step={step} index={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
