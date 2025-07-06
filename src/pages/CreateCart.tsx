import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { HeroButton } from '@/components/ui/hero-button';
import { useCartStore } from '@/store/cartStore';
import { COMMON_ALLERGIES, PRODUCT_CATEGORIES } from '@/types';
import { Users, User, ShoppingCart, ArrowLeft } from 'lucide-react';

const CreateCart = () => {
  const navigate = useNavigate();
  const { createCart, setCurrentUser } = useCartStore();
  
  const [isGroup, setIsGroup] = useState<boolean | null>(null);
  const [cartName, setCartName] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});

  const handleAllergyToggle = (allergy: string) => {
    setSelectedAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleBudgetChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCategoryBudgets(prev => ({ ...prev, [category]: numValue }));
  };

  const handleSubmit = () => {
    if (!cartName.trim() || !userName.trim()) return;

    const user = {
      id: Math.random().toString(36).substring(2, 15),
      name: userName.trim(),
      allergies: selectedAllergies
    };

    setCurrentUser(user);

    const cartId = createCart({
      name: cartName.trim(),
      users: [user],
      categoryBudgets
    });

    navigate(`/cart/${cartId}`);
  };

  if (isGroup === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How would you like to shop?
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose your shopping style to get started
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card 
                className="p-8 h-full cursor-pointer hover:shadow-card hover:scale-105 transition-all duration-300 border-primary/20 bg-card/50 backdrop-blur-sm"
                onClick={() => setIsGroup(false)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Shop Solo</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a personal shopping cart with smart budget tracking and AI suggestions
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Personal budget management</li>
                    <li>• Allergy-safe recommendations</li>
                    <li>• AI-powered savings</li>
                  </ul>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card 
                className="p-8 h-full cursor-pointer hover:shadow-card hover:scale-105 transition-all duration-300 border-secondary/20 bg-card/50 backdrop-blur-sm"
                onClick={() => setIsGroup(true)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Group Shopping</h3>
                  <p className="text-muted-foreground mb-6">
                    Collaborate with friends and family in real-time shopping
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Real-time collaboration</li>
                    <li>• Shared budget management</li>
                    <li>• Group allergy protection</li>
                    <li>• Smart cost splitting</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="container max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => setIsGroup(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isGroup ? 'Create Group Cart' : 'Create Solo Cart'}
          </h1>
          <p className="text-muted-foreground">
            Set up your shopping preferences and budgets
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cartName">Cart Name</Label>
                  <Input
                    id="cartName"
                    placeholder={isGroup ? "Family Grocery Trip" : "My Shopping List"}
                    value={cartName}
                    onChange={(e) => setCartName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="userName">Your Name</Label>
                  <Input
                    id="userName"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Budgets */}
              <div>
                <Label className="text-base font-semibold">Category Budgets (₹)</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Set spending limits for different product categories
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {PRODUCT_CATEGORIES.slice(0, 6).map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Label className="text-sm min-w-0 flex-1">{category}</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        className="w-20"
                        onChange={(e) => handleBudgetChange(category, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <Label className="text-base font-semibold">Allergies & Dietary Restrictions</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll alert you if any items contain these ingredients
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {COMMON_ALLERGIES.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={selectedAllergies.includes(allergy)}
                        onCheckedChange={() => handleAllergyToggle(allergy)}
                      />
                      <Label htmlFor={allergy} className="text-sm">
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <HeroButton
                onClick={handleSubmit}
                disabled={!cartName.trim() || !userName.trim()}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Create {isGroup ? 'Group' : 'Solo'} Cart
              </HeroButton>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCart;