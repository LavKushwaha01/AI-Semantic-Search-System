'use client'
import { useState } from 'react'
import SearchResult from '@/components/SearchResult'

const DEMO_QUERIES = [
   {
    section: 'ai',
    label: 'AI & ML',
    query: 'systems that get better over time by finding patterns in examples instead of explicit instructions',
  },

  {
    section: 'languages',
    label: 'Programming Languages',
    query: 'ways to instruct machines so they can perform tasks through logical sequences',
  },

  {
    section: 'frontend',
    label: 'Frontend',
    query: 'creating the visible and interactive parts of digital products that users engage with',
  },

  {
    section: 'backend',
    label: 'Backend & APIs',
    query: 'managing hidden processes that handle requests and send back processed information',
  },

  {
    section: 'data',
    label: 'Databases',
    query: 'systems designed to efficiently organize and access large volumes of stored information',
  },

  {
    section: 'infrastructure',
    label: 'Infrastructure',
    query: 'using remote computing resources instead of owning hardware locally',
  },

  {
    section: 'security',
    label: 'Security',
    query: 'methods to block unauthorized access and keep digital systems safe from attacks',
  },

  {
    section: 'tools',
    label: 'Dev Tools',
    query: 'platforms that allow multiple developers to track modifications and work together on codebases',
  },

  {
    section: 'economics',
    label: 'Economics',
    query: 'metrics used to evaluate how well a country is performing financially over time',
  },

  {
    section: 'environment',
    label: 'Environment',
    query: 'long term changes in earth conditions caused by human activities and natural factors',
  },

  {
    section: 'political',
    label: 'Politics',
    query: 'systems where citizens have the power to choose leadership and influence governance',
  },

  {
    section: 'social',
    label: 'Social',
    query: 'ensuring fairness and equal chances for all individuals in a community',
  },

  {
    section: 'logical',
    label: 'Logic',
    query: 'approaches that rely on structured reasoning to reach valid conclusions',
  },


]

export default function Home() {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'semantic' | 'keyword'>('semantic')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [keywordResults, setKeywordResults] = useState<any[]>([])

  const search = async (q = query, m = mode) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(q)}&mode=${m}`)
      const data = await res.json()
      setResults(data.results)

      if (compareMode) {
        const res2 = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(q)}&mode=keyword`)
        const data2 = await res2.json()
        setKeywordResults(data2.results)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = (dq: string) => {
    setQuery(dq)
    search(dq, mode)
  }

  return (
    
    <div style={{ textAlign: 'center', minHeight: '100vh', padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
  position: 'absolute',
  width: '300px',
  height: '300px',
  background: 'radial-gradient(circle, #6366f1, transparent)',
  borderRadius: '50%',
  top: '-50px',
  left: '-50px',
  filter: 'blur(80px)',
  animation: 'float1 10s infinite alternate'
}} />

<div style={{
  position: 'absolute',
  width: '300px',
  height: '300px',
  background: 'radial-gradient(circle, #8b5cf6, transparent)',
  borderRadius: '50%',
  bottom: '-50px',
  right: '-50px',
  filter: 'blur(80px)',
  animation: 'float2 12s infinite alternate'
}} />
      {/* Header */}
      <h1 style={{
  fontSize: '42px',
  fontWeight: '800',
  background: 'linear-gradient(135deg, #a5b4fc, #818cf8)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}}>
  Codeblock 2026 Hackathon
</h1>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
           AI Semantic Search
        </h1>
        <p style={{ color: '#64748b', marginTop: '10px', fontSize: '16px' }}>
          Search by <strong style={{ color: '#a5b4fc' }}>meaning</strong>, not just keywords
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Try: 'computers that learn on their own'..."
          style={{
            flex: 1, padding: '16px 20px', borderRadius: '12px',
            border: '2px solid #2d2d44', background: '#1e1e2e',
            color: '#e2e8f0', fontSize: '16px', outline: 'none',
          }}
        />
        <button onClick={() => search()} disabled={loading} style={{
          padding: '16px 28px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', fontWeight: '700', border: 'none',
          cursor: 'pointer', fontSize: '16px',
        }}>
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        {(['semantic', 'keyword'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); if (searched) search(query, m) }} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none',
            background: mode === m ? '#6366f1' : '#1e1e2e',
            color: mode === m ? 'white' : '#64748b',
            fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {m === 'semantic' ? ' Semantic' : ' Keyword'}
          </button>
        ))}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#94a3b8', fontSize: '14px', marginLeft: 'auto' }}>
          <input type="checkbox" checked={compareMode} onChange={e => setCompareMode(e.target.checked)} />
          Side-by-side compare
        </label>
      </div>

      {/* Demo Queries */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: '#475569', fontSize: '13px', marginBottom: '8px' }}> Try demo queries:</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DEMO_QUERIES.map(dq => (
            <button key={dq.query} onClick={() => handleDemo(dq.query)} style={{
              padding: '6px 14px', borderRadius: '20px',
              background: '#1e1e2e', border: '1px solid #2d2d44',
              color: '#94a3b8', cursor: 'pointer', fontSize: '13px',
            }}>
              {dq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && !loading && (
        compareMode ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h2 style={{ color: '#a5b4fc', marginBottom: '12px', fontSize: '16px' }}> Semantic Results</h2>
              {results.map((r, i) => <SearchResult key={r.id} result={r} index={i} />)}
            </div>
            <div>
              <h2 style={{ color: '#fbbf24', marginBottom: '12px', fontSize: '16px' }}> Keyword Results</h2>
              {keywordResults.length ? keywordResults.map((r, i) => <SearchResult key={r.id} result={r} index={i} />) : (
                <div style={{ color: '#ef4444', padding: '20px', background: '#1e1e2e', borderRadius: '12px' }}>
                   No keyword matches found — semantic search wins here!
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '12px' }}>
              {results.length} results for <strong style={{ color: '#a5b4fc' }}>"{query}"</strong>
            </p>
            {results.map((r, i) => <SearchResult key={r.id} result={r} index={i} />)}
          </div>
        )
      )}

      {loading && (
        <div style={{ textAlign: 'center', color: '#6366f1', padding: '40px' }}>
          <div style={{ fontSize: '24px' }}>Please Wait</div>
          <p style={{ marginTop: '10px' }}>Searching semantically...</p>
        </div>
      )}

<div style={{
  marginTop: '60px',   
  padding: '12px',
  textAlign: 'center',
  color: '#64748b',
  fontSize: '14px'
}}>
  <p>Built By MindMesh Team</p>
  <p style={{ marginTop: '6px', color: '#a5b4fc', fontWeight: '600' }}>
    WGY-102
  </p>
</div>
    </div>
  )
}

