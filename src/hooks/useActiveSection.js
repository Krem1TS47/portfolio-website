import { useEffect, useState } from 'react'

/** Id of the section currently crossing the middle band of the viewport. */
export function useActiveSection(ids) {
    const [active, setActive] = useState(ids[0])
    const key = ids.join(',')

    useEffect(() => {
        const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
        if (!els.length || typeof IntersectionObserver === 'undefined') return
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        )
        els.forEach((el) => io.observe(el))
        return () => io.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    return active
}
