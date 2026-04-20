import { useEffect, useState, memo } from 'react'

/**
 * LiveClock Component
 * 
 * CRITICAL: This component is isolated with React.memo to prevent parent
 * re-renders from cascading down. The setInterval only causes THIS component
 * to re-render, not the entire Dashboard. This is essential for performance.
 */
const LiveClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    // Update only this component every second
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <p className="mt-2 text-2xl font-semibold text-whitePrimary">
      {time.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
    </p>
  )
}

export default memo(LiveClock)
