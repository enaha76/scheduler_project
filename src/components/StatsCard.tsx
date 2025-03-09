import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  color: 'blue' | 'green' | 'teal';
}

const colorVariants = {
  blue: {
    bg: 'bg-gradient-to-br from-supnum-blue to-primary-700',
    light: 'bg-primary-100',
    text: 'text-primary-700',
  },
  green: {
    bg: 'bg-gradient-to-br from-supnum-green to-secondary-700',
    light: 'bg-secondary-100',
    text: 'text-secondary-700',
  },
  teal: {
    bg: 'bg-gradient-to-br from-supnum-teal to-accent-700',
    light: 'bg-accent-100',
    text: 'text-accent-700',
  },
};

export default function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const colors = colorVariants[color];

  useEffect(() => {
    const counter = counterRef.current;
    if (counter) {
      gsap.fromTo(
        counter,
        { textContent: '0' },
        {
          duration: 2,
          textContent: value.toString(),
          ease: 'power2.out',
          snap: { textContent: 1 },
        }
      );
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl shadow-lg"
    >
      <div className={`${colors.bg} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`${colors.light} p-3 rounded-lg`}>
              <Icon className={`h-6 w-6 ${colors.text}`} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-sm font-medium">
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <span ref={counterRef} className="text-3xl font-bold text-white">
            {value}
          </span>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 opacity-20" />
    </motion.div>
  );
} 