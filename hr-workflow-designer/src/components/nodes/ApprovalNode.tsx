
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { BadgeCheck, AlertCircle, Users } from 'lucide-react';

interface ApprovalData {
  title?: string;
  approverRole?: string;
  autoApproveThreshold?: number;
  hasError?: boolean;
  errorMessage?: string;
}

export default function ApprovalNode({ data, selected }: NodeProps) {
  const d = data as ApprovalData;
  return (
    <div className="relative" style={{ minWidth: 210 }}>
      {d.hasError && (
        <div className="absolute -top-2 -right-2 z-10">
          <AlertCircle size={16} color="#ef4444" />
        </div>
      )}
      <div style={{
        background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
        border: `2px solid ${selected ? '#6366f1' : d.hasError ? '#ef4444' : '#f59e0b'}`,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.3), 0 4px 20px rgba(245,158,11,0.2)' : '0 4px 20px rgba(245,158,11,0.15)',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ background: 'rgba(245,158,11,0.2)', borderRadius: 8, padding: 6 }}>
            <BadgeCheck size={14} color="#fbbf24" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: '#fcd34d', letterSpacing: '0.1em', fontWeight: 600 }}>APPROVAL</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fffbeb', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.title || 'Approval Node'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={10} color="#fbbf24" />
            <span style={{ fontSize: 10, color: '#fcd34d' }}>{d.approverRole || 'Manager'}</span>
          </div>
          {d.autoApproveThreshold != null && d.autoApproveThreshold > 0 && (
            <span style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#fcd34d' }}>
              Auto ≥{d.autoApproveThreshold}d
            </span>
          )}
        </div>
        {d.hasError && d.errorMessage && (
          <div style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>⚠ {d.errorMessage}</div>
        )}
      </div>
      <Handle type="target" position={Position.Top} style={{ top: -6, background: '#f59e0b', borderColor: '#f59e0b' }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: -6, background: '#f59e0b', borderColor: '#f59e0b' }} />
    </div>
  );
}
