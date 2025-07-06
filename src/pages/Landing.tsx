import { motion } from 'framer-motion';
import { HeroButton } from '@/components/ui/hero-button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Users, AlertTriangle, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-shopping.jpg';
import smartCartImage from '@/assets/smart-cart.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Shopping",
      description: "Shop together in real-time with friends and family"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Smart Budget Tracking",
      description: "Set category budgets and get AI-powered suggestions"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Allergy Alerts",
      description: "Automatic warnings for ingredients that conflict with allergies"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI Savings",
      description: "Get smart alternatives to save money on your purchases"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            GroupKart
          </div>
          <nav className="flex items-center gap-4">
            <HeroButton 
              variant="ghost" 
              onClick={() => navigate('/shop')}
            >
              Shop Products
            </HeroButton>
            <HeroButton 
              variant="ghost" 
              onClick={() => navigate('/carts')}
            >
              My Carts
            </HeroButton>
          </nav>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Shop Smart,
              </span>
              <br />
              <span className="text-foreground">Together</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-xl">
              Create collaborative shopping carts, manage budgets intelligently, 
              and get AI-powered suggestions to save money while staying allergy-safe.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <HeroButton 
                size="xl" 
                onClick={() => navigate('/create-cart')}
                className="animate-bounce-gentle"
              >
                <ShoppingCart className="w-5 h-5" />
                Create a Group Cart
              </HeroButton>
              <HeroButton 
                variant="outline" 
                size="xl"
                onClick={() => navigate('/create-cart')}
              >
                Shop Solo
              </HeroButton>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 text-sm"
            >
              <HeroButton 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/shop')}
              >
                Browse Products
              </HeroButton>
              <HeroButton 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/carts')}
              >
                View My Carts
              </HeroButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-glow">
              <img 
                src={heroImage} 
                alt="Smart collaborative shopping" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-gradient-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-button text-sm font-semibold"
            >
              AI Powered 🤖
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full shadow-button text-sm font-semibold"
            >
              Save Money 💰
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose GroupKart?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make shopping smarter, safer, and more social with our innovative features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:shadow-card hover:scale-105 transition-all duration-300">
                <div className="text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center bg-gradient-primary rounded-3xl p-12 text-primary-foreground"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Shopping?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of smart shoppers saving money and time
          </p>
          <HeroButton 
            variant="outline" 
            size="xl"
            onClick={() => navigate('/create-cart')}
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Start Shopping Smart
          </HeroButton>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;