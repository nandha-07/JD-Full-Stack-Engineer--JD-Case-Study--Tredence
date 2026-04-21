import React, { useEffect, useState, useCallback } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import {
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  ApproverRole,
} from '../../types/workflow';
import { AutomationAction } from '../../types/workflow';
import { getAutomations } from '../../api/mockApi';
import KeyValueEditor, { inputStyle, labelStyle } from './KeyValueEditor';
import { X, Trash2, Play, CheckSquare, Zap, ClipboardList, BadgeCheck, StopCircle } from 'lucide-react';
import { NODE_TYPE_CONFIG } from '../../utils/workflowUtils';

interface NodeFormPanelProps {
  nodeId: string;
}

const nodeTypeIcon = (type: string) => {
  const size = 14;
  switch (type) {
    case 'start': return <Play size={size} color="#10b981" />;
    case 'task': return <ClipboardList size={size} color="#60a5fa" />;
    case 'approval': return <BadgeCheck size={size} color="#fbbf24" />;
    case 'automated': return <Zap size={size} color="#a78bfa" />;
    case 'end': return <StopCircle size={size} color="#f87171" />;
    default: return null;
  }
};

export default function NodeFormPanel({ nodeId }: NodeFormPanelProps) {
  const node = useWorkflowStore((s) => s.nodes.find((n) => n.id === nodeId));
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);

  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loadingAutomations, setLoadingAutomations] = useState(false);

  useEffect(() => {
    if (node?.data.type === 'automated') {
      setLoadingAutomations(true);
      getAutomations().then((list) => {
        setAutomations(list);
        setLoadingAutomations(false);
      });
    }
  }, [node?.data.type]);

  const update = useCallback(
    (partial: Partial<WorkflowNodeData>) => {
      if (!node) return;
      updateNodeData(nodeId, partial);
    },
    [node, nodeId, updateNodeData]
  );

  if (!node) return null;

  const data = node.data;
  const config = NODE_TYPE_CONFIG[data.type as keyof typeof NODE_TYPE_CONFIG];

  const sectionStyle: React.CSSProperties = {
    borderTop: '1px solid rgba(255,255,255,0.07)',
    paddingTop: 16,
    marginTop: 16,
  };

  const fieldBlock = (label: string, children: React.ReactNode) => (
    <div>
      <label style={labelStyle}>{label.toUpperCase()}</label>
      {children}
    </div>
  );

  return (
    <div
      className="animate-slide-in"
      style={{
        width: 320,
        height: '100%',
        background: '#1a1d27',
        borderLeft: '1px solid #2d3148',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #2d3148',
          background: '#1e2130',
          flexShrink: 0,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `rgba(${data.type === 'start' ? '16,185,129' : data.type === 'task' ? '59,130,246' : data.type === 'approval' ? '245,158,11' : data.type === 'automated' ? '139,92,246' : '239,68,68'},0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {nodeTypeIcon(data.type)}
            </div>
            <div>
              <div style={{ fontSize: 10, color: config?.color || '#8b92b3', fontWeight: 600, letterSpacing: '0.05em' }}>
                {config?.label?.toUpperCase() || data.type.toUpperCase()} NODE
              </div>
              <div style={{ fontSize: 12, color: '#f0f2ff', fontWeight: 500 }}>
                Configure
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => deleteNode(nodeId)}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 6,
                padding: 5,
                cursor: 'pointer',
                color: '#f87171',
              }}
              title="Delete node"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                padding: 5,
                cursor: 'pointer',
                color: '#8b92b3',
              }}
              title="Close panel"
            >
              <X size={13} />
            </button>
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#8b92b3', fontFamily: 'monospace' }}>
          ID: {nodeId}
        </div>
      </div>

      {/* Form Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div className="flex flex-col gap-4">

          {/* ── START NODE ── */}
          {data.type === 'start' && (() => {
            const d = data as StartNodeData;
            return (
              <>
                {fieldBlock('Start Title', (
                  <input
                    value={d.title}
                    onChange={(e) => update({ title: e.target.value } as Partial<StartNodeData>)}
                    placeholder="e.g. Employee Onboarding Started"
                    style={inputStyle}
                  />
                ))}
                <div style={sectionStyle}>
                  <KeyValueEditor
                    pairs={d.metadata}
                    onChange={(pairs) => update({ metadata: pairs } as Partial<StartNodeData>)}
                    label="Metadata"
                  />
                </div>
              </>
            );
          })()}

          {/* ── TASK NODE ── */}
          {data.type === 'task' && (() => {
            const d = data as TaskNodeData;
            return (
              <>
                {fieldBlock('Title *', (
                  <input
                    value={d.title}
                    onChange={(e) => update({ title: e.target.value } as Partial<TaskNodeData>)}
                    placeholder="e.g. Collect Documents"
                    style={{ ...inputStyle, borderColor: !d.title.trim() ? '#ef4444' : undefined }}
                  />
                ))}
                {fieldBlock('Description', (
                  <textarea
                    value={d.description}
                    onChange={(e) => update({ description: e.target.value } as Partial<TaskNodeData>)}
                    placeholder="What should the assignee do?"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                ))}
                {fieldBlock('Assignee', (
                  <input
                    value={d.assignee}
                    onChange={(e) => update({ assignee: e.target.value } as Partial<TaskNodeData>)}
                    placeholder="e.g. HR Admin, John Doe"
                    style={inputStyle}
                  />
                ))}
                {fieldBlock('Due Date', (
                  <input
                    type="date"
                    value={d.dueDate}
                    onChange={(e) => update({ dueDate: e.target.value } as Partial<TaskNodeData>)}
                    style={{ ...inputStyle, colorScheme: 'dark' }}
                  />
                ))}
                <div style={sectionStyle}>
                  <KeyValueEditor
                    pairs={d.customFields}
                    onChange={(pairs) => update({ customFields: pairs } as Partial<TaskNodeData>)}
                    label="Custom Fields"
                  />
                </div>
              </>
            );
          })()}

          {/* ── APPROVAL NODE ── */}
          {data.type === 'approval' && (() => {
            const d = data as ApprovalNodeData;
            const roles: ApproverRole[] = ['Manager', 'HRBP', 'Director', 'VP', 'CEO'];
            return (
              <>
                {fieldBlock('Title', (
                  <input
                    value={d.title}
                    onChange={(e) => update({ title: e.target.value } as Partial<ApprovalNodeData>)}
                    placeholder="e.g. Document Verification Approval"
                    style={inputStyle}
                  />
                ))}
                {fieldBlock('Approver Role', (
                  <select
                    value={d.approverRole}
                    onChange={(e) => update({ approverRole: e.target.value as ApproverRole } as Partial<ApprovalNodeData>)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ))}
                {fieldBlock('Auto-Approve Threshold (days)', (
                  <div>
                    <input
                      type="number"
                      min={0}
                      value={d.autoApproveThreshold}
                      onChange={(e) => update({ autoApproveThreshold: parseInt(e.target.value) || 0 } as Partial<ApprovalNodeData>)}
                      style={inputStyle}
                    />
                    <div style={{ fontSize: 10, color: '#8b92b3', marginTop: 4 }}>
                      Set to 0 to disable auto-approval. When enabled, approves automatically after this many days.
                    </div>
                  </div>
                ))}
              </>
            );
          })()}

          {/* ── AUTOMATED STEP NODE ── */}
          {data.type === 'automated' && (() => {
            const d = data as AutomatedStepNodeData;
            const selectedAction = automations.find((a) => a.id === d.actionId);
            return (
              <>
                {fieldBlock('Title', (
                  <input
                    value={d.title}
                    onChange={(e) => update({ title: e.target.value } as Partial<AutomatedStepNodeData>)}
                    placeholder="e.g. Send Welcome Email"
                    style={inputStyle}
                  />
                ))}
                {fieldBlock('Action *', (
                  <select
                    value={d.actionId}
                    onChange={(e) => {
                      const action = automations.find((a) => a.id === e.target.value);
                      const newParams: Record<string, string> = {};
                      action?.params.forEach((p) => { newParams[p] = d.actionParams[p] || ''; });
                      update({ actionId: e.target.value, actionParams: newParams } as Partial<AutomatedStepNodeData>);
                    }}
                    style={{ ...inputStyle, cursor: 'pointer', borderColor: !d.actionId ? '#ef4444' : undefined }}
                    disabled={loadingAutomations}
                  >
                    <option value="">
                      {loadingAutomations ? 'Loading actions...' : 'Select an action...'}
                    </option>
                    {automations.map((a) => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                ))}
                {selectedAction?.description && (
                  <div
                    style={{
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.2)',
                      borderRadius: 8,
                      padding: '8px 10px',
                      fontSize: 11,
                      color: '#c4b5fd',
                    }}
                  >
                    {selectedAction.description}
                  </div>
                )}
                {selectedAction && selectedAction.params.length > 0 && (
                  <div style={sectionStyle}>
                    <label style={labelStyle}>ACTION PARAMETERS</label>
                    <div className="flex flex-col gap-2">
                      {selectedAction.params.map((param) => (
                        <div key={param}>
                          <label style={{ ...labelStyle, color: '#c4b5fd', marginBottom: 2 }}>
                            {param}
                          </label>
                          <input
                            value={d.actionParams[param] || ''}
                            onChange={(e) =>
                              update({
                                actionParams: { ...d.actionParams, [param]: e.target.value },
                              } as Partial<AutomatedStepNodeData>)
                            }
                            placeholder={`Enter ${param}...`}
                            style={inputStyle}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* ── END NODE ── */}
          {data.type === 'end' && (() => {
            const d = data as EndNodeData;
            return (
              <>
                {fieldBlock('End Message', (
                  <textarea
                    value={d.endMessage}
                    onChange={(e) => update({ endMessage: e.target.value } as Partial<EndNodeData>)}
                    placeholder="e.g. Onboarding process completed successfully!"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                ))}
                <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f2ff' }}>Summary Report</div>
                    <div style={{ fontSize: 11, color: '#8b92b3', marginTop: 2 }}>
                      Generate a summary report when workflow completes
                    </div>
                  </div>
                  <button
                    onClick={() => update({ summaryFlag: !d.summaryFlag } as Partial<EndNodeData>)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: d.summaryFlag ? '#6366f1' : '#2d3148',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#fff',
                        position: 'absolute',
                        top: 3,
                        left: d.summaryFlag ? 23 : 3,
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      }}
                    />
                  </button>
                </div>
              </>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
