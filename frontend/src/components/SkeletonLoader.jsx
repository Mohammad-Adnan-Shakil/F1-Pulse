/**
 * Skeleton Loader Component
 * 
 * Displays a shimmer animation while content is loading.
 * Critical for LCP: shows placeholder while API data loads.
 */
const SkeletonLoader = ({ 
  width = '100%', 
  height = '24px', 
  borderRadius = '8px',
  className = ''
}) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }}
    className={className}
  />
)

export default SkeletonLoader
