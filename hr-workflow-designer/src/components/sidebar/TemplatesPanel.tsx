import React, { useState } from 'react';
import { LayoutTemplate, ChevronDown, ChevronRight } from 'lucide-react';
import { WORKFLOW_TEMPLATES } from '../../api/templates';
import { useWorkflowStore } from '../../store/workflowStore';
import { MarkerType } from '@xyflow/react';

export default function TemplatesPanel() {
  const [expanded, setExpanded] = useState(true);
  const { setNodes, setEdges, setWorkflowName, clearCanvas } = useWorkflowStore();

  const loadTemplate = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    if (
      !window.confirm(
        `Load "${template.name}" template? This will replace your current workflow.`
      )
    )
      return;

    clearCanvas();

    const edgeStyle = {
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
      style: { stroke: '#6366f1', strokeWidth: 2 },
      type: 'smoothstep',
    };

    setNodes(
      template.nodes.map((n) => ({
        ...n,
        selected: false,
        draggable: true,
      } as any))
    );
    setEdges(
      template.edges.map((e) => ({
        ...e,
        ...edgeStyle,
      } as any))
    );
    setWorkflowName(template.name);
  };

  return (
    <div
      style={{
        borderTop: '1px solid #2d3148',
        flexShrink: 0,
      }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          color: '#8b92b3',
        }}
      >
        <LayoutTemplate size={12} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', flex: 1, textAlign: 'left' }}>
          TEMPLATES
        </span>
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {expanded && (
        <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {WORKFLOW_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => loadTemplate(tpl.id)}
              style={{
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 8,
                padding: '8px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                color: 'inherit',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.06)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.15)';
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 14 }}>{tpl.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#f0f2ff' }}>{tpl.name}</span>
              </div>
              <div style={{ fontSize: 10, color: '#8b92b3', lineHeight: 1.4 }}>
                {tpl.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
