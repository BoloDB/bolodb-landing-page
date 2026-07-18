import { useState } from 'react';

export default function TrustFlip() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ perspective: '1400px' }} className="h-full">
      <div
        className="relative h-full w-full min-h-[340px] transition-transform"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front: The answer */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            padding: '28px',
            gap: '16px',
          }}
        >
          <span
            className="text-[11px] tracking-[0.14em] font-medium"
            style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--muted)' }}
          >
            THE ANSWER YOU SEE
          </span>
          <div className="text-[16px] leading-[1.55]" style={{ color: 'var(--ink)' }}>
            Revenue this month is <strong style={{ color: 'var(--accent)' }}>$284,120</strong> — up 12% on last month.
          </div>
          <div
            className="text-[13px] leading-[1.55]"
            style={{
              color: 'var(--muted)',
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '13px',
            }}
          >
            Summed the order totals of completed orders created this calendar month, compared with the previous month.
          </div>
          <div
            className="flex items-center gap-2.5 mt-2"
          >
            <span
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-bold"
              style={{
                color: 'var(--ok-ink)',
                background: 'rgba(27,158,107,0.12)',
              }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  background: '#1b9e6b',
                  boxShadow: '0 0 0 3px rgba(27,158,107,0.15)',
                }}
              ></span>
              High confidence
            </span>
            <span
              className="text-[10px]"
              style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--faint)' }}
            >
              1 row · 28ms
            </span>
          </div>
          <div className="mt-auto">
            <button
              onClick={() => setFlipped(true)}
              className="rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors"
              style={{
                background: 'transparent',
                borderColor: 'var(--border-2)',
                color: 'var(--ink-2)',
                fontFamily: "'Inter',sans-serif",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand)';
                e.currentTarget.style.color = 'var(--brand)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-2)';
                e.currentTarget.style.color = 'var(--ink-2)';
              }}
            >
              Show me the SQL →
            </button>
          </div>
        </div>

        {/* Back: The SQL */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            padding: '28px',
            gap: '16px',
          }}
        >
          <span
            className="text-[11px] tracking-[0.14em] font-medium"
            style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--brand)' }}
          >
            THE SQL UNDERNEATH
          </span>
          <pre
            className="m-0 overflow-x-auto whitespace-pre text-[12px] leading-[1.7]"
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              color: 'var(--ink-2)',
            }}
          >
{`SELECT SUM(total) AS revenue
FROM orders
WHERE status = 'completed'
  AND created_at >= date_trunc('month', now());`}
          </pre>
          <span className="text-[13px] leading-[1.6]" style={{ color: 'var(--muted)' }}>
            Always one tap away. Every answer is backed by transparent, verifiable SQL.
          </span>
          <div className="mt-auto">
            <button
              onClick={() => setFlipped(false)}
              className="rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors"
              style={{
                background: 'transparent',
                borderColor: 'var(--border-2)',
                color: 'var(--ink-2)',
                fontFamily: "'Inter',sans-serif",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-2)';
                e.currentTarget.style.color = 'var(--ink-2)';
              }}
            >
              ← Back to answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
