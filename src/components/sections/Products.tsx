
import React, { useState } from 'react';
import FadeInSection from '../ui/FadeInSection';
import { cn } from '@/lib/utils';
import AnimatedButton from '../ui/AnimatedButton';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Experience",
    description: "Crafted with the finest materials and attention to every detail.",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1800&auto=format&fit=crop",
    color: "from-blue-500/20 via-blue-500/10 to-transparent"
  },
  {
    id: 2,
    name: "Elegant Design",
    description: "Clean aesthetics that highlights what truly matters.",
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1800&auto=format&fit=crop",
    color: "from-purple-500/20 via-purple-500/10 to-transparent"
  },
  {
    id: 3,
    name: "Intuitive Interface",
    description: "Simple, yet powerful. Designed to enhance your experience.",
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1800&auto=format&fit=crop",
    color: "from-amber-500/20 via-amber-500/10 to-transparent"
  }
];

const Products: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<number>(1);

  return (
    <section id="products" className="relative py-24 md:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-6 md:px-8">
        <FadeInSection>
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <span className="text-sm font-medium text-primary mb-2">Premium Collection</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Crafted to Perfection</h2>
            <p className="max-w-2xl text-muted-foreground text-lg">
              Our products are designed with meticulous attention to detail, focusing on both aesthetics and functionality.
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            {products.map((product) => (
              <FadeInSection key={product.id} delay={product.id * 100} direction="right">
                <div 
                  className={cn(
                    "p-6 rounded-xl border transition-all duration-300 cursor-pointer",
                    activeProduct === product.id 
                      ? "border-primary/50 bg-secondary shadow-lg" 
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  )}
                  onClick={() => setActiveProduct(product.id)}
                >
                  <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              </FadeInSection>
            ))}

            <FadeInSection delay={400} direction="right">
              <div className="pt-4">
                <AnimatedButton 
                  href="#features"
                  icon={<ArrowRight size={18} />}
                >
                  View All Products
                </AnimatedButton>
              </div>
            </FadeInSection>
          </div>

          <div className="lg:col-span-7 relative">
            <FadeInSection>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className={cn(
                      "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out bg-cover bg-center",
                      activeProduct === product.id ? "opacity-100" : "opacity-0"
                    )}
                    style={{ backgroundImage: `url(${product.image})` }}
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r", 
                      product.color
                    )}></div>
                  </div>
                ))}
              </div>
            </FadeInSection>
            
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-primary/20 hidden md:block"></div>
            <div className="absolute -left-4 -bottom-4 h-32 w-32 rounded-full border border-primary/20 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
