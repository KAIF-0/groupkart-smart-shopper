import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HeroButton } from '@/components/ui/hero-button';
import { useCartStore } from '@/store/cartStore';
import { ArrowLeft, Trophy, Sparkles, Users, ShoppingCart, Star } from 'lucide-react';

const Summary = () => {
  const { cartId } = useParams<{ cartId: string }>();
  const navigate = useNavigate();
  
  const { getCart, getUserContribution } = useCartStore();
  
  const cart = cartId ? getCart(cartId) : null;

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cart not found</p>
      </div>
    );
  }

  const totalSpent = cart.items.reduce((sum, item) => sum + item.price, 0);
  const totalBudget = Object.values(cart.categoryBudgets).reduce((sum, budget) => sum + budget, 0);
  const savingsPercentage = totalBudget > 0 ? (cart.totalSavings / totalBudget) * 100 : 0;
  
  // Calculate smart saver score (0-100)
  const smartSaverScore = Math.min(
    100,
    Math.round(
      (cart.smartSwapsAccepted * 20) + // 20 points per swap
      (savingsPercentage * 2) + // 2 points per % saved
      (cart.items.length > 0 ? 20 : 0) // 20 points for completing shopping
    )
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return '🏆 Smart Saver Champion';
    if (score >= 80) return '⭐ Smart Saver Pro';
    if (score >= 60) return '💡 Smart Saver';
    if (score >= 40) return '🛒 Budget Conscious';
    return '🌱 Getting Started';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="container max-w-4xl mx-auto py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(`/cart/${cartId}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">Shopping Complete!</h1>
          <p className="text-lg text-muted-foreground">
            Here's your smart shopping summary for <strong>{cart.name}</strong>
          </p>
        </motion.div>

        {/* Smart Saver Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-8 text-center bg-gradient-primary text-primary-foreground">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Smart Saver Score</h2>
            </div>
            
            <div className="text-6xl font-bold mb-2">{smartSaverScore}</div>
            <div className="text-lg opacity-90 mb-4">{getScoreBadge(smartSaverScore)}</div>
            
            <Progress 
              value={smartSaverScore} 
              className="h-3 bg-primary-foreground/20"
            />
            
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div>
                <div className="text-2xl font-bold">{cart.smartSwapsAccepted}</div>
                <div className="opacity-80">Smart Swaps</div>
              </div>
              <div>
                <div className="text-2xl font-bold">₹{cart.totalSavings.toFixed(0)}</div>
                <div className="opacity-80">Total Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{cart.items.length}</div>
                <div className="opacity-80">Items Bought</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Contributions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Contributions
              </h3>
              
              <div className="space-y-4">
                {cart.users.map((user) => {
                  const contribution = getUserContribution(cartId!, user.id);
                  const itemCount = cart.items.filter(item => item.addedBy === user.id).length;
                  const percentage = totalSpent > 0 ? (contribution / totalSpent) * 100 : 0;
                  
                  return (
                    <div key={user.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{contribution.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{itemCount} items</div>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 h-full">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Category Breakdown
              </h3>
              
              <div className="space-y-4">
                {Object.entries(cart.categoryBudgets)
                  .filter(([_, budget]) => budget > 0)
                  .map(([category, budget]) => {
                    const spent = cart.items
                      .filter(item => item.category === category)
                      .reduce((sum, item) => sum + item.price, 0);
                    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                    const isOverBudget = percentage > 100;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category}</span>
                          <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                            ₹{spent.toFixed(0)} / ₹{budget}
                          </Badge>
                        </div>
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={`h-2 ${isOverBudget ? 'bg-danger/20' : ''}`}
                        />
                        {isOverBudget && (
                          <p className="text-xs text-danger">
                            Over budget by ₹{(spent - budget).toFixed(0)}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Insights & Savings
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">₹{cart.totalSavings.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Money Saved</div>
              </div>
              
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{cart.smartSwapsAccepted}</div>
                <div className="text-sm text-muted-foreground">Smart Swaps Accepted</div>
              </div>
              
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">
                  {savingsPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Budget Efficiency</div>
              </div>
            </div>

            {cart.totalSavings > 0 && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Smart Shopping Tip:</strong> You saved ₹{cart.totalSavings.toFixed(2)} by accepting AI suggestions! 
                  Keep using smart swaps to maximize your savings on future shopping trips.
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <HeroButton
            onClick={() => navigate('/create-cart')}
            size="lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Start New Cart
          </HeroButton>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Summary;