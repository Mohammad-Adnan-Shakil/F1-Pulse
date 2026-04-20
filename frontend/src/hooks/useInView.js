import { useEffect, useRef, useState } from 'react'

/**
 * useInView Hook
 * 
 * Lazy loads components only when they scroll into view.
 * This is essential for below-fold content (Upcoming Races, etc).
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, inView] - ref to attach to element, boolean for visibility
 */
export const useInView = (options = { threshold: 0.1 }) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        // Once loaded, stop observing (no point re-checking)
        observer.unobserve(entry.target)
      }
    }, options)

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options])

  return [ref, inView]
}

export default useInView
