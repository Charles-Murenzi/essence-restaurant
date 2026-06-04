"use client";

import { motion } from "framer-motion";
import { ChevronRight, Utensils, Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <h2 className="text-primary tracking-widest uppercase text-sm mb-4 font-semibold">Welcome to Rwanda's Finest</h2>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gold-gradient">
            ESSENCE
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            A premium dining experience where sophistication meets culinary excellence. 
            Smart dining at your fingertips.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-accent transition-colors"
              >
                View Menu <Utensils size={20} />
              </motion.button>
            </Link>
            <Link href="/waiter">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary text-secondary-foreground border border-primary/20 px-8 py-4 rounded-full font-bold hover:bg-muted transition-colors"
              >
                Staff Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Icons */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary opacity-50"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-tighter">Discover More</span>
            <ChevronRight className="rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-secondary/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Star className="text-primary" size={32} />}
              title="Personalized Service"
              description="Choose your preferred server based on ratings, specialties, and language."
            />
            <FeatureCard 
              icon={<Clock className="text-primary" size={32} />}
              title="Real-time Tracking"
              description="Monitor your order from the kitchen to your table with live updates."
            />
            <FeatureCard 
              icon={<MapPin className="text-primary" size={32} />}
              title="Multiple Locations"
              description="Find Essence in the heart of Kigali and across Rwanda."
            />
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 text-center border-t border-white/5">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Essence Bar & Grill. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass p-8 rounded-2xl text-center flex flex-col items-center"
    >
      <div className="mb-6 p-4 bg-primary/10 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
