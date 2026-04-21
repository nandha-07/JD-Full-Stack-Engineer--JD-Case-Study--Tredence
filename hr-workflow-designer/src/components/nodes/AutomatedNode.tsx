
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Zap, AlertCircle } from 'lucide-react';
import { MOCK_AUTOMATIONS } from '../../api/mockApi';

interface AutomatedData {
  title?: string;
  actionId?: string;
  hasError?: boolean;
  errorMessage?: string;
}

export default function AutomatedNode({ data, selected }: NodeProps) {
  const d = data as AutomatedData;
  const action = MOCK_AUTOMATIONS.find((a) => a.id === d.actionId);
  return (
    <div className="relative" style={{ minWidth: 210 }}>
      {d.hasError && (
        <div className="absolute -top-2 -right-2 z-10">
          <AlertCircle size={16} color="#ef4444" />
        </div>
      )}
      <div style={{
        background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)',
        border: `2px solid ${selected ? '#6366f1' : d.hasError ? '#ef4444' : '#8b5cf6'}`,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: selected ? '0 0 0 3px rgba(99,102,241,0.3), 0 4px 20px rgba(139,92,246,0.2)' : '0 4px 20px rgba(139,92,246,0.15)',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ background: 'rgba(139,92,246,0.2)', borderRadius: 8, padding: 6 }}>
            <Zap size={14} color="#a78bfa" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: '#c4b5fd', letterSpacing: '0.1em', fontWeight: 600 }}>AUTOMATED</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f3ff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.title || 'Automated Step'}
            </div>
          </div>
        </div>
        {action ? (
          <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={9} color="#a78bfa" /> {action.label}
          </div>
        ) : (
          <div style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>⚠ No action selected</div>
        )}
        {d.hasError && d.errorMessage && (
          <div style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>⚠ {d.errorMessage}</div>
        )}
      </div>
      <Handle type="target" position={Position.Top} style={{ top: -6, background: '#8b5cf6', borderColor: '#8b5cf6' }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: -6, background: '#8b5cf6', borderColor: '#8b5cf6' }} />
    </div>
  );
}
