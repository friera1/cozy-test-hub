
import React from 'react';
import FadeInSection from '../ui/FadeInSection';
import { cn } from '@/lib/utils';
import { 
  Layers, 
  Sparkles, 
  Zap, 
  Shield, 
  RefreshCcw, 
  Palette 
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Layers size={24} />,
    title: "Thoughtful Design",
    description: "Every element has been carefully considered and crafted to perfection.",
  },
  {
    icon: <Sparkles size={24} />,
    title: "Premium Experience",
    description: "Enjoy a seamless, intuitive experience with attention to every detail.",
  },
  {
    icon: <Zap size={24} />,
    title: "Fast Performance",
    description: "Optimized for speed and efficiency without compromising quality.",
  },
  {
    icon: <Shield size={24} />,
    title: "Reliable Security",
    description: "Your data is protected with industry-leading security measures.",
  },
  {
    icon: <RefreshCcw size={24} />,
    title: "Regular Updates",
    description: "Continuous improvements and new features to enhance your experience.",
  },
  {
    icon: <Palette size={24} />,
    title: "Aesthetic Excellence",
    description: "Beautiful visuals that inspire and create a pleasant environment.",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-8">
        <FadeInSection>
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <span className="text-sm font-medium text-primary mb-2">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Designed for Excellence</h2>
            <p className="max-w-2xl text-muted-foreground text-lg">
              Our features are crafted to provide you with the best possible experience, focusing on both functionality and aesthetics.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeInSection key={index} delay={index * 100} className="h-full">
              <div className="h-full p-6 rounded-xl border border-border bg-background hover:border-primary/30 transition-all duration-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Features;
