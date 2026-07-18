import { useState, useEffect, useRef, useCallback } from 'react';

interface Question {
  q: string;
  sql: string;
  restate: string;
  cols: [string, string];
  meta: string;
  rows: { a: string; b: string }[];
}

const QUESTIONS: Question[] = [
  {
    q: 'Which product category brings in the most revenue?',
    sql: "SELECT category, SUM(total) AS revenue\nFROM order_items\nJOIN products USING (product_id)\nGROUP BY category\nORDER BY revenue DESC\nLIMIT 3;",
    restate: 'Summed order-item totals grouped by product category, highest first.',
    cols: ['Category', 'Revenue'],
    meta: '3 rows · 38ms',
    rows: [
      { a: 'Electronics', b: '$412,890' },
      { a: 'Home & Kitchen', b: '$268,340' },
      { a: 'Outdoor', b: '$189,410' },
    ],
  },
  {
    q: 'How many orders were completed last month?',
    sql: "SELECT COUNT(*) AS completed_orders\nFROM orders\nWHERE status = 'completed'\n  AND created_at >= date_trunc('month', now()) - interval '1 month'\n  AND created_at <  date_trunc('month', now());",
    restate: "Counted orders with status 'completed' created in the previous calendar month.",
    cols: ['Metric', 'Value'],
    meta: '1 row · 22ms',
    rows: [{ a: 'Completed orders', b: '1,284' }],
  },
  {
    q: 'Who are our top 3 customers this quarter?',
    sql: "SELECT c.name, SUM(o.total) AS spent\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nWHERE o.created_at >= date_trunc('quarter', now())\nGROUP BY c.id\nORDER BY spent DESC\nLIMIT 3;",
    restate: 'Ranked customers by total completed-order spend since the start of this quarter.',
    cols: ['Customer', 'Spent'],
    meta: '3 rows · 41ms',
    rows: [
      { a: 'Acme Corp', b: '$124,500' },
      { a: 'Globex Inc', b: '$98,200' },
      { a: 'Initech', b: '$86,450' },
    ],
  },
];

type Phase = 'typing' | 'thinking' | 'sql' | 'result';

export default function LiveDemo() {
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(true);
  const [phase, setPhase] = useState<Phase>('typing');
  const [rowCount, setRowCount] = useState(0);
  const [qi, setQi] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const inViewRef = useRef(false);
  const runningRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduced = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const Q = QUESTIONS[qi];

  const finishDemo = useCallback(() => {
    const q = QUESTIONS[qi];
    clearTimers();
    setTyped(q.q);
    setTyping(false);
    setPhase('result');
    setRowCount(q.rows.length);
    runningRef.current = false;
  }, [qi, clearTimers]);

  const playDemo = useCallback(() => {
    if (runningRef.current || skipped || !inViewRef.current) return;
    runningRef.current = true;
    clearTimers();
    const q = QUESTIONS[qi];
    setTyped('');
    setTyping(true);
    setPhase('typing');
    setRowCount(0);
    let i = 0;
    const type = () => {
      if (!inViewRef.current || skipped) {
        runningRef.current = false;
        return;
      }
      i++;
      setTyped(q.q.slice(0, i));
      if (i < q.q.length) {
        after(34, type);
        return;
      }
      setTyping(false);
      setPhase('thinking');
      after(1400, () => setPhase('sql'));
      after(2600, () => {
        setPhase('result');
        q.rows.forEach((_, k) =>
          after(200 + k * 180, () => setRowCount(k + 1))
        );
      });
      after(7200, () => {
        runningRef.current = false;
        setQi((prev) => (prev + 1) % QUESTIONS.length);
      });
    };
    type();
  }, [qi, skipped, after, clearTimers]);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) {
      finishDemo();
    }
  }, []);

  useEffect(() => {
    if (reduced.current) return;
    const el = document.getElementById('demo-section');
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0].isIntersecting;
        if (inViewRef.current && !runningRef.current && !skipped) playDemo();
        if (!inViewRef.current) {
          clearTimers();
          runningRef.current = false;
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [playDemo, skipped, clearTimers]);

  useEffect(() => {
    if (reduced.current) return;
    if (!runningRef.current && !skipped && inViewRef.current) {
      playDemo();
    }
  }, [qi, playDemo, skipped]);

  const handleSkip = () => {
    if (skipped) {
      setSkipped(false);
      setQi(0);
      runningRef.current = false;
      setTimeout(() => playDemo(), 50);
    } else {
      setSkipped(true);
      finishDemo();
    }
  };

  return (
    <div
      className="overflow-hidden rounded-[20px] border"
      style={{
        background: 'var(--panel)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-xl), 0 0 80px -40px rgba(var(--glow-rgb),0.25)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between border-b px-5 py-3.5"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-2)' }}></span>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-2)' }}></span>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--border-2)' }}></span>
        </div>
        <span
          className="text-[11px] tracking-[0.12em]"
          style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--faint)' }}
        >
          LIVE DEMO · SAMPLE STORE DATABASE
        </span>
        <button
          onClick={handleSkip}
          className="rounded-lg border px-3 py-1 text-[11.5px] font-semibold transition-colors"
          style={{
            background: 'transparent',
            borderColor: 'var(--border)',
            color: 'var(--muted)',
            fontFamily: "'Hanken Grotesk',sans-serif",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--ink)';
            e.currentTarget.style.borderColor = 'var(--border-2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--muted)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          {skipped ? 'Replay' : 'Skip'}
        </button>
      </div>

      {/* Demo body */}
      <div className="flex min-h-[420px] flex-col gap-4.5 p-7" style={{ gap: '18px' }}>
        {/* User question bubble */}
        <div
          className="self-end max-w-[80%] rounded-[18px] px-5 py-3.5 text-[15.5px] leading-relaxed"
          style={{
            borderRadius: '18px 18px 4px 18px',
            background: 'var(--surface-3)',
            color: 'var(--ink)',
          }}
        >
          {typed}
          {typing && (
            <span style={{ color: 'var(--brand)', fontWeight: 300, animation: 'blink 1s step-end infinite' }}>
              |
            </span>
          )}
        </div>

        {/* Thinking spinner */}
        {phase === 'thinking' && (
          <div className="flex items-center gap-2.5 text-sm font-medium" style={{ color: 'var(--muted)' }}>
            <span
              className="inline-block h-3.5 w-3.5 rounded-full"
              style={{ border: '2px solid var(--brand)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}
            ></span>
            Linking schema · writing SQL · validating…
          </div>
        )}

        {/* SQL block */}
        {(phase === 'sql' || phase === 'result') && (
          <div
            className="overflow-hidden rounded-xl border"
            style={{
              borderColor: 'var(--border)',
              animation: 'riseIn 0.4s cubic-bezier(0.22,0.61,0.36,1) both',
            }}
          >
            <div
              className="flex justify-between border-b px-4 py-2 text-[11px] tracking-[0.1em]"
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                color: 'var(--muted)',
                background: 'var(--surface-2)',
                borderColor: 'var(--border)',
              }}
            >
              <span>GENERATED SQL — VALIDATED ✓ READ-ONLY</span>
            </div>
            <pre
              className="m-0 overflow-x-auto whitespace-pre px-4 py-4 text-[12.5px] leading-[1.65]"
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                color: 'var(--ink-2)',
                background: 'var(--code-bg)',
              }}
            >
              {Q.sql}
            </pre>
          </div>
        )}

        {/* Result */}
        {phase === 'result' && (
          <div
            className="flex flex-col gap-3.5"
            style={{ animation: 'riseIn 0.4s cubic-bezier(0.22,0.61,0.36,1) both' }}
          >
            <div
              className="text-[14.5px] leading-[1.55]"
              style={{
                color: 'var(--ink-2)',
                borderLeft: '2px solid var(--accent)',
                paddingLeft: '14px',
              }}
            >
              {Q.restate}
            </div>

            <div className="flex items-center gap-3.5">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold"
                style={{
                  color: 'var(--ok-ink)',
                  background: 'rgba(27,158,107,0.15)',
                  animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.25s both',
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: '#1b9e6b',
                    boxShadow: '0 0 0 3px rgba(27,158,107,0.18)',
                  }}
                ></span>
                High confidence
              </span>
              <span
                className="text-[11px]"
                style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--faint)' }}
              >
                {Q.meta}
              </span>
            </div>

            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr>
                  <th
                    className="border-b px-3.5 py-2.5 text-left font-semibold"
                    style={{
                      color: 'var(--muted)',
                      background: 'var(--surface-2)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {Q.cols[0]}
                  </th>
                  <th
                    className="border-b px-3.5 py-2.5 text-right font-semibold"
                    style={{
                      color: 'var(--muted)',
                      background: 'var(--surface-2)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {Q.cols[1]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Q.rows.slice(0, rowCount).map((r, k) => (
                  <tr
                    key={k}
                    style={{ animation: 'rowIn 0.4s cubic-bezier(0.22,0.61,0.36,1) both' }}
                  >
                    <td className="border-b px-3.5 py-2.5" style={{ color: 'var(--ink)', borderColor: 'var(--border)' }}>
                      {r.a}
                    </td>
                    <td
                      className="border-b px-3.5 py-2.5 text-right"
                      style={{
                        color: 'var(--ink)',
                        borderColor: 'var(--border)',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '12.5px',
                      }}
                    >
                      {r.b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center gap-2.5 pt-0.5">
              <span className="text-[13px]" style={{ color: 'var(--muted)' }}>
                Is this correct?
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold"
                style={{
                  borderColor: '#2f8f66',
                  color: 'var(--ok-ink)',
                  background: 'rgba(27,158,107,0.08)',
                }}
              >
                ✓ Yes — teach BoloDB
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
