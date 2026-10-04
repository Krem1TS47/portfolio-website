import { useSyncExternalStore } from 'react'

/** Reactive matchMedia. Returns `fallback` during SSR / before mount. */
export function useMediaQuery(query, fallback = false) {
    return useSyncExternalStore(
        (cb) => {
            const mql = window.matchMedia(query)
            mql.addEventListener('change', cb)
            return () => mql.removeEventListener('change', cb)
        },
        () => window.matchMedia(query).matches,
        () => fallback
    )
}
