
import React from 'react';
import FadeInSection from '../ui/FadeInSection';
import AnimatedButton from '../ui/AnimatedButton';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background to-secondary/30 pt-20">
      <div className="container mx-auto px-6 md:px-8 pt-16 pb-24 md:pb-32">
        <div className="flex flex-col items-center justify-center space-y-6 text-center md:space-y-8">
          <FadeInSection delay={100}>
            <div className="inline-flex items-center rounded-full bg-secondary px-4 py-1 text-xs font-medium md:text-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
              Introducing a new era of design
            </div>
          </FadeInSection>

          <FadeInSection delay={300} className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Beautiful design meets <span className="text-primary">simplicity</span>
            </h1>
          </FadeInSection>

          <FadeInSection delay={500} className="max-w-xl">
            <p className="text-lg text-muted-foreground md:text-xl">
              Experience the perfect balance of form and function. Each element designed with purpose, each interaction refined to perfection.
            </p>
          </FadeInSection>

          <FadeInSection delay={700} className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <AnimatedButton 
              href="#products"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Explore Now
            </AnimatedButton>
            <AnimatedButton 
              href="#features"
              variant="outline"
              size="lg"
            >
              Learn More
            </AnimatedButton>
          </FadeInSection>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"></div>
      
      {/* Animated background elements */}
      <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="scroll-indicator"></div>
      </div>
    </section>
  );
};

export default Hero;
