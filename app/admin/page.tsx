import { redirect } from 'next/navigation'
import { serverClient } from '@/lib/supabase'

interface Submission {
  id: string
  tab: string
  pathway: string
  name: string | null
  email: string | null
  social: string | null
  phone: string | null
  state: string | null
  city: string | null
  data: Record<string, unknown>
  is_creator: boolean
  is_brand: boolean
  created_at: string
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; tab?: string }>
}) {
  const params = await searchParams
  const key = params.key ?? ''
  const tabFilter = params.tab ?? 'all'

  const adminKey = process.env.ADMIN_KEY ?? 'zmw-admin'
  if (key !== adminKey) {
    redirect('/admin/login')
  }

  const db = serverClient()

  let query = db
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (tabFilter !== 'all') {
    query = query.eq('tab', tabFilter)
  }

  const { data: submissions, error } = await query

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'system-ui', color: '#CC1F1F' }}>
        Error loading submissions: {error.message}
      </div>
    )
  }

  const all = submissions as Submission[]
  const exploreCount = all.filter(s => s.tab === 'explore').length
  const loveCount = all.filter(s => s.tab === 'love').length

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  function pathwayLabel(pathway: string) {
    const map: Record<string, string> = {
      explore: '🏃‍♂️ Send me somewhere',
      sponsor: '💛 Sponsor',
      community: '🌍 Join in spreading love',
      idea: '💡 Share an idea',
      commit: '🤝 Make an act',
    }
    return map[pathway] ?? pathway
  }

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100vh', fontFamily: 'system-ui' }}>

      {/* Header */}
      <div style={{ background: '#FF6600', padding: '20px 16px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            Zay Meets World
          </div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
            Submissions {all.length > 0 && <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.85 }}>({tabFilter === 'all' ? all.length : (tabFilter === 'explore' ? exploreCount : loveCount)})</span>}
          </div>

          {/* Tab filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { value: 'all', label: `All (${all.length})` },
              { value: 'explore', label: `🏃‍♂️ Explore (${exploreCount})` },
              { value: 'love', label: `❤️ Love (${loveCount})` },
            ].map(t => (
              <a
                key={t.value}
                href={`/admin?key=${key}&tab=${t.value}`}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: tabFilter === t.value ? '#fff' : 'rgba(0,0,0,0.2)',
                  color: tabFilter === t.value ? '#FF6600' : 'rgba(255,255,255,0.85)',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '12px 16px 40px' }}>
        {all.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 700 }}>No submissions yet</div>
          </div>
        ) : (
          all.map(s => (
            <div key={s.id} style={{
              background: '#fff',
              borderRadius: 16,
              padding: '16px',
              marginBottom: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${s.tab === 'explore' ? '#FF6600' : '#CC1F1F'}`,
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#0D0D0D' }}>
                    {s.name ?? <span style={{ color: '#aaa', fontWeight: 400 }}>Anonymous</span>}
                  </div>
                  <div style={{ fontSize: 11, color: s.tab === 'explore' ? '#FF6600' : '#CC1F1F', fontWeight: 700, marginTop: 2 }}>
                    {pathwayLabel(s.pathway)}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#aaa', textAlign: 'right', flexShrink: 0 }}>
                  {timeAgo(s.created_at)}
                </div>
              </div>

              {/* Contact info */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                {s.email && (
                  <a href={`mailto:${s.email}`} style={{ fontSize: 13, color: '#333', textDecoration: 'none' }}>
                    ✉️ {s.email}
                  </a>
                )}
                {s.social && (
                  <span style={{ fontSize: 13, color: '#333' }}>📱 {s.social}</span>
                )}
                {s.phone && (
                  <a href={`tel:${s.phone}`} style={{ fontSize: 13, color: '#333', textDecoration: 'none' }}>
                    📞 {s.phone}
                  </a>
                )}
                {(s.city || s.state) && (
                  <span style={{ fontSize: 13, color: '#666' }}>
                    📍 {[s.city, s.state].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>

              {/* Extra data */}
              {s.data && Object.keys(s.data).length > 0 && (
                <div style={{ marginTop: 10, padding: '10px 12px', background: '#F8F8F8', borderRadius: 10 }}>
                  {Object.entries(s.data).map(([k, v]) => {
                    if (!v || (Array.isArray(v) && v.length === 0)) return null
                    return (
                      <div key={k} style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}:</span>{' '}
                        {Array.isArray(v) ? v.join(', ') : String(v)}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Badges */}
              {(s.is_creator || s.is_brand) && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {s.is_creator && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: '#FFF0E6', color: '#FF6600' }}>
                      🎬 CREATOR
                    </span>
                  )}
                  {s.is_brand && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: '#E8F4FD', color: '#0066CC' }}>
                      🏢 BRAND
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
