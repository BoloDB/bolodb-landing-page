import { useState } from 'react';

const DBS = [
  { name: 'PostgreSQL', str: 'postgresql://readonly_user:pass@host:5432/dbname' },
  { name: 'MySQL', str: 'mysql+pymysql://readonly_user:pass@host:3306/dbname' },
  { name: 'SQL Server', str: 'mssql+pyodbc://readonly_user:pass@server/db?driver=ODBC+Driver+17+for+SQL+Server' },
];

export default function ConnectTabs() {
  const [active, setActive] = useState(0);

  return (
    <div
      className="overflow-hidden rounded-[20px] border"
      style={{ borderColor: 'var(--border)', background: 'var(--card-2)' }}
    >
      {/* Tabs */}
      <div
        className="flex flex-wrap gap-1 border-b"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', padding: '10px 12px' }}
      >
        {DBS.map((db, i) => (
          <button
            key={db.name}
            onClick={() => setActive(i)}
            className="rounded-lg border-0 px-4 py-2 text-[13px] font-semibold transition-all"
            style={{
              background: i === active ? 'var(--surface-3)' : 'transparent',
              color: i === active ? 'var(--ink)' : 'var(--muted)',
              fontFamily: "'Hanken Grotesk',sans-serif",
            }}
            onMouseOver={(e) => {
              if (i !== active) e.currentTarget.style.color = 'var(--ink)';
            }}
            onMouseOut={(e) => {
              if (i !== active) e.currentTarget.style.color = 'var(--muted)';
            }}
          >
            {db.name}
          </button>
        ))}
      </div>

      {/* Connection string */}
      <div className="flex flex-col gap-3.5" style={{ padding: '24px 26px' }}>
        <code
          className="block overflow-x-auto whitespace-nowrap py-1 text-[13.5px]"
          style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--ok-ink)' }}
        >
          {DBS[active].str}
        </code>
        <span className="text-[13px]" style={{ color: 'var(--faint)' }}>
          Tip: connect with a read-only database account — BoloDB enforces read-only itself as a second layer.
        </span>
      </div>
    </div>
  );
}
