import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export default function FeatureCard({
  title,
  description,
  Icon,
}: FeatureCardProps) {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-[#8EACCD]" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
