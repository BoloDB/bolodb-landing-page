import { useState } from 'react';

export default function TrustFlip() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="min-h-[360px]"
      style={{ perspective: '1400px' }}
    >
      <div
        className="relative h-full w-full transition-transform"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s cubic-bezier(0.22,0.61,0.36,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front: The answer */}
        <div
          className="absolute inset-0 flex flex-col rounded-[20px] border"
          style={{
            backfaceVisibility: 'hidden',
            background: 'var(--card)',
            borderColor: 'var(--border)',
            padding: '30px',
            gap: '18px',
          }}
        >
          <span
            className="text-[11px] tracking-[0.14em]"
            style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--muted)' }}
          >
            THE ANSWER YOU SEE
          </span>
          <div className="text-[17px] leading-[1.55]" style={{ color: 'var(--ink)' }}>
            Revenue this month is <strong style={{ color: 'var(--accent)' }}>$284,120</strong> — up 12% on last month.
          </div>
          <div
            className="text-sm leading-[1.55]"
            style={{
              color: 'var(--muted)',
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '13px',
            }}
          >
            Summed the order totals of completed orders created this calendar month, compared with the previous month.
          </div>
          <div className="mt-auto">
            <button
              onClick={() => setFlipped(true)}
              className="rounded-full border px-4.5 py-2.5 text-[13.5px] font-semibold transition-colors"
              style={{
                background: 'transparent',
                borderColor: 'var(--border-2)',
                color: 'var(--ink-2)',
                fontFamily: "'Hanken Grotesk',sans-serif",
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
              Show me the SQL ⟲
            </button>
          </div>
        </div>

        {/* Back: The SQL */}
        <div
          className="absolute inset-0 flex flex-col gap-4.5 rounded-[20px] border p-7"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--card-2)',
            borderColor: 'var(--border-2)',
            gap: '18px',
          }}
        >
          <span
            className="text-[11px] tracking-[0.14em]"
            style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--brand)' }}
          >
            THE SQL UNDERNEATH — ALWAYS ONE TAP AWAY
          </span>
          <pre
            className="m-0 overflow-x-auto whitespace-pre text-[12.5px] leading-[1.7]"
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
          <div className="mt-auto">
            <button
              onClick={() => setFlipped(false)}
              className="rounded-full border px-4.5 py-2.5 text-[13.5px] font-semibold transition-colors"
              style={{
                background: 'transparent',
                borderColor: 'var(--border-2)',
                color: 'var(--ink-2)',
                fontFamily: "'Hanken Grotesk',sans-serif",
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
              Back to the answer ⟲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
