interface Result {
  id: number
  title: string
  content: string
  score: number
  relevance: string
}

export default function SearchResult({ result, index }: { result: Result; index: number }) {
  const relevanceColor = {
    High: '#10b981',
    Medium: '#f59e0b',
    Low: '#ef4444',
  }[result.relevance] || '#6b7280'

  return (
    <div style={{
      background: '#1e1e2e',
      border: '1px solid #2d2d44',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '12px',
      borderLeft: `4px solid ${relevanceColor}`,
      transition: 'transform 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>#{index + 1}</span>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#c0c8ff' }}>{result.title}</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            background: relevanceColor + '22',
            color: relevanceColor,
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
          }}>{result.relevance}</span>
          <span style={{
            background: '#2d2d44',
            color: '#a5b4fc',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '700',
          }}>{result.score}%</span>
        </div>
      </div>
      <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>{result.content}</p>
    </div>
  )
}