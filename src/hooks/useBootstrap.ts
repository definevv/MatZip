import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Step = 'session' | 'profile' | 'firstQuery'
type Stat = 'idle' | 'running' | 'done' | 'error'

export function useBootstrap() {
  const [ready, setReady] = useState(false)
  const [steps, setSteps] = useState<Record<Step, Stat>>({
    session: 'idle', profile: 'idle', firstQuery: 'idle'
  })
  const [err, setErr] = useState<string | null>(null)

  const run = async <T,>(key: Step, job: () => Promise<T>) => {
    setSteps(s => ({ ...s, [key]: 'running' }))
    try {
      const r = await job()
      setSteps(s => ({ ...s, [key]: 'done' }))
      return r
    } catch (e: any) {
      setSteps(s => ({ ...s, [key]: 'error' }))
      setErr(e?.message ?? String(e))
      throw e
    }
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // 1) 세션 확인
        await run('session', async () => {
          const { data, error } = await supabase.auth.getSession()
          if (error) throw error
          return data.session
        })

        // 2) 프로필(있다면)
        await run('profile', async () => {
          // 예시 쿼리 — 없으면 noop 반환
          return null
        })

        // 3) 첫 데이터(예: 추천/기본 리스트)
        await run('firstQuery', async () => {
          // 필요 시 SPARQL 호출; 적어도 1개 호출 넣어두면 어디서 막히는지 보임
          return null
        })
      } finally {
        if (alive) setReady(true)  // ← 반드시 로딩 해제
      }
    })()
    return () => { alive = false }
  }, [])

  return { ready, steps, err }
}
