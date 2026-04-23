import FeatureCard from '@/components/FeatureCard';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import { Brain, Eye, UserCheck } from 'lucide-react';

const features = [
  {
    title: 'EEG Analysis',
    description:
      'Measure brain activity in real time to identify focus levels and cognitive states during learning sessions.',
    Icon: Brain,
  },
  {
    title: 'Eye Tracking',
    description:
      'Track gaze patterns to determine attention focus and detect distractions during learning activities.',
    Icon: Eye,
  },
  {
    title: 'Face Recognition',
    description:
      'Analyze facial expressions to detect engagement, fatigue, and emotional responses in real time.',
    Icon: UserCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Biometric Precision Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Biometric Precision
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto italic">
            Track focus, attention, and cognitive load during learning sessions
            using integrated biometric data.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Footer / Bottom Spacing */}
      <footer className="py-20 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} NeuroLearn AI. All rights reserved.
      </footer>
    </main>
  );
}
