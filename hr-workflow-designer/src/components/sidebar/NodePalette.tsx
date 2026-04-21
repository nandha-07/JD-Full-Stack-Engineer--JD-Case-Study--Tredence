import React, { useCallback } from 'react';
import { Play, ClipboardList, BadgeCheck, Zap, StopCircle, GripVertical } from 'lucide-react';
import { NodeType } from '../../types/workflow';

const NODE_PALETTE = [
  {
    type: 'start' as NodeType,
    label: 'Start',
    description: 'Workflow entry point',
    icon: <Play size={16} fill="#10b981" stroke="#10b981" />,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.3)',
  },
  {
    type: 'task' as NodeType,
    label: 'Task',
    description: 'Human task or activity',
    icon: <ClipboardList size={16} color="#60a5fa" />,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.3)',
  },
  {
    type: 'approval' as NodeType,
    label: 'Approval',
    description: 'Manager or HR sign-off',
    icon: <BadgeCheck size={16} color="#fbbf24" />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
  },
  {
    type: 'automated' as NodeType,
    label: 'Automated Step',
    description: 'System-triggered action',
    icon: <Zap size={16} color="#a78bfa" />,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.3)',
  },
  {
    type: 'end' as NodeType,
    label: 'End',
    description: 'Workflow completion',
    icon: <StopCircle size={16} color="#f87171" />,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
  },
];

export default function NodePalette() {
  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  return (
    <div
      style={{
        width: 220,
        background: '#1a1d27',
        borderRight: '1px solid #2d3148',
        display: 'flex',
        flexDirection: 'column',
        padding: 12,
        gap: 4,
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#8b92b3', letterSpacing: '0.1em', marginBottom: 4 }}>
          NODE LIBRARY
        </div>
        <div style={{ fontSize: 11, color: '#6b7296' }}>
          Drag nodes onto the canvas
        </div>
      </div>

      {/* Node items */}
      {NODE_PALETTE.map((item) => (
        <div
          key={item.type}
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          style={{
            background: item.bg,
            border: `1px solid ${item.border}`,
            borderRadius: 10,
            padding: '10px 12px',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            transition: 'all 0.2s ease',
            userSelect: 'none',
          }}
          className="group hover:scale-[1.02] active:scale-[0.98] active:cursor-grabbing"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = item.color;
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${item.color}30, 0 2px 12px ${item.color}20`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = item.border;
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `${item.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {item.icon}
          </div>

          {/* Labels */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f2ff' }}>{item.label}</div>
            <div style={{ fontSize: 10, color: '#8b92b3', marginTop: 1 }}>{item.description}</div>
          </div>

          {/* Drag handle indicator */}
          <GripVertical size={12} color="#6b7296" />
        </div>
      ))}

      {/* Hint */}
      <div
        style={{
          marginTop: 8,
          padding: '8px 10px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: 8,
          fontSize: 10,
          color: '#8b92b3',
          lineHeight: 1.5,
        }}
      >
        💡 <strong style={{ color: '#818cf8' }}>Tip:</strong> Connect nodes by dragging from the colored handles at the bottom
      </div>
    </div>
  );
}
