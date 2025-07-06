import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCartStore } from '@/store/cartStore';
import { Users, ShoppingCart, TrendingUp, Calendar, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroButton } from '@/components/ui/hero-button';

const Carts = () => {
  const navigate = useNavigate();
  const { carts, currentUser } = useCartStore();

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const cartsList = Object.values(carts);
  const userCarts = cartsList.filter(cart => 
    cart.users.some(user => user.id === currentUser.id)
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTotalSpent = (cartId: string) => {
    const cart = carts[cartId];
    return cart?.items.reduce((sum, item) => sum + item.price, 0) || 0;
  };

  const CartCard = ({ cart }: { cart: typeof carts[string] }) => {
    const totalSpent = getTotalSpent(cart.id);
    const isGroup = cart.users.length > 1;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card className="h-full bg-card/50 backdrop-blur-sm hover:shadow-card transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl mb-2">{cart.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={isGroup ? "default" : "secondary"}>
                    {isGroup ? 'Group' : 'Solo'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {cart.items.length} items
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">₹{totalSpent.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Users */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {cart.users.length} {cart.users.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cart.users.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center gap-1">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{user.name}</span>
                  </div>
                ))}
                {cart.users.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{cart.users.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Categories with budgets */}
            {Object.keys(cart.categoryBudgets).some(cat => cart.categoryBudgets[cat] > 0) && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Budget Categories</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(cart.categoryBudgets)
                    .filter(([_, budget]) => budget > 0)
                    .slice(0, 3)
                    .map(([category, budget]) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}: ₹{budget}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Smart Stats */}
            {(cart.smartSwapsAccepted > 0 || cart.totalSavings > 0) && (
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Smart Swaps:</span>
                  <span className="ml-1 font-medium">{cart.smartSwapsAccepted}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Savings:</span>
                  <span className="ml-1 font-medium text-success">₹{cart.totalSavings.toFixed(0)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => navigate(`/cart/${cart.id}`)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Cart
              </Button>
              <Button 
                onClick={() => navigate(`/summary/${cart.id}`)}
                variant="outline"
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="container max-w-6xl mx-auto py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">My Carts</h1>
            <p className="text-muted-foreground">
              Manage all your shopping carts in one place
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => navigate('/shop')} variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop Products
            </Button>
            <HeroButton onClick={() => navigate('/create-cart')}>
              Create New Cart
            </HeroButton>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="p-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{userCarts.length}</div>
                <div className="text-sm text-muted-foreground">Total Carts</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <div className="text-2xl font-bold">
                  ₹{userCarts.reduce((sum, cart) => sum + cart.totalSavings, 0).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              <div>
                <div className="text-2xl font-bold">
                  {userCarts.filter(cart => cart.users.length > 1).length}
                </div>
                <div className="text-sm text-muted-foreground">Group Carts</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Carts Grid */}
        {userCarts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCarts.map((cart, index) => (
              <motion.div
                key={cart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CartCard cart={cart} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Carts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first cart to start shopping smart with GroupKart
            </p>
            <HeroButton onClick={() => navigate('/create-cart')}>
              Create Your First Cart
            </HeroButton>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Carts;