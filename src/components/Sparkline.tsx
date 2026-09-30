import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string; // hex or tailwind class
  gradientId: string;
  height?: number;
  width?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = '#10B981',
  gradientId,
  height = 40,
  width = 120,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  // Generate points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Build SVG path with smooth curve
  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  // Build closed area for gradient fill
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Gradient Fill Area */}
      <path d={areaD} fill={`url(#${gradientId})`} />

      {/* Smooth Stroke Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pulsing endpoint dot */}
      <circle cx={lastPoint.x} cy={lastPoint.y} r="3" fill={color} />
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="6"
        fill={color}
        opacity="0.3"
        className="animate-ping"
      />
    </svg>
  );
};
