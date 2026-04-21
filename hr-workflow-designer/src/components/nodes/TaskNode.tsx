
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { ClipboardList, AlertCircle, Calendar, User } from 'lucide-react';

interface TaskData {
  title?: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Array<{ key: string; value: string }>;
  hasError?: boolean;
  errorMessage?: string;
}

export default function TaskNode({ data, selected }: NodeProps) {
  const d = data as TaskData;
  return (
    <div className="relative" style={{ minWidth: 220 }}>
      {d.hasError && (
        <div className="absolute -top-2 -right-2 z-10">
          <AlertCircle size={16} color="#ef4444" />
        </div>
      )}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)',
        border: `2px solid ${selected ? '#6366f1' : d.hasError ? '#ef4444' : '#3b82f6'}`,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.3), 0 4px 20px rgba(59,130,246,0.2)' : '0 4px 20px rgba(59,130,246,0.15)',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ background: 'rgba(59,130,246,0.2)', borderRadius: 8, padding: 6 }}>
            <ClipboardList size={14} color="#60a5fa" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: '#93c5fd', letterSpacing: '0.1em', fontWeight: 600 }}>TASK</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#eff6ff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {d.title || 'Task Node'}
            </div>
          </div>
        </div>
        {d.description && (
          <div style={{ fontSize: 11, color: '#93c5fd', marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {d.description}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {d.assignee && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <User size={10} color="#60a5fa" />
              <span style={{ fontSize: 10, color: '#93c5fd' }}>{d.assignee}</span>
            </div>
          )}
          {d.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={10} color="#60a5fa" />
              <span style={{ fontSize: 10, color: '#93c5fd' }}>{d.dueDate}</span>
            </div>
          )}
        </div>
        {d.customFields && d.customFields.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {d.customFields.slice(0, 2).map((kv, i) => (
              <span key={i} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#93c5fd' }}>
                {kv.key}: {kv.value}
              </span>
            ))}
          </div>
        )}
        {d.hasError && d.errorMessage && (
          <div style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>⚠ {d.errorMessage}</div>
        )}
      </div>
      <Handle type="target" position={Position.Top} style={{ top: -6, background: '#3b82f6', borderColor: '#3b82f6' }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: -6, background: '#3b82f6', borderColor: '#3b82f6' }} />
    </div>
  );
}
