export default function Card({ 
  children, 
  className = '', 
  hover = true,
  padding = true,
  ...props 
}) {
  const hoverStyles = hover ? 'hover:shadow-lg hover:border-gray-300' : '';
  const paddingStyles = padding ? 'p-6' : '';
  
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 ${hoverStyles} ${paddingStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

