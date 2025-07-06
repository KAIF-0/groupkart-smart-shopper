import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/store/cartStore';
import { PRODUCT_CATEGORIES } from '@/types';
import { Plus, Users, Share, AlertTriangle, CheckCircle, X, Sparkles, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { cartId } = useParams<{ cartId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    getCart, 
    addItemToCart, 
    removeItemFromCart, 
    acceptSwap, 
    getCategorySpent, 
    checkAllergyConflicts,
    currentUser 
  } = useCartStore();
  
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    category: '',
    ingredients: ''
  });

  const cart = cartId ? getCart(cartId) : null;

  useEffect(() => {
    if (!cart || !currentUser) {
      navigate('/');
    }
  }, [cart, currentUser, navigate]);

  if (!cart || !currentUser) return null;

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.category) return;

    const ingredients = newItem.ingredients.split(',').map(i => i.trim()).filter(Boolean);
    
    // Check for allergy conflicts
    const conflictUsers = checkAllergyConflicts(cartId!, ingredients);
    if (conflictUsers.length > 0) {
      toast({
        title: "⚠️ Allergy Alert!",
        description: `${conflictUsers.map(u => u.name).join(', ')} ${conflictUsers.length === 1 ? 'is' : 'are'} allergic to ingredients in this item.`,
        variant: "destructive",
      });
    }

    // Check budget overflow
    const categorySpent = getCategorySpent(cartId!, newItem.category);
    const categoryBudget = cart.categoryBudgets[newItem.category] || 0;
    const wouldExceed = categorySpent + newItem.price > categoryBudget;

    if (wouldExceed && categoryBudget > 0) {
      toast({
        title: "💰 Budget Alert!",
        description: `This item would exceed your ${newItem.category} budget by ₹${Math.round((categorySpent + newItem.price) - categoryBudget)}`,
        variant: "destructive",
      });
    }

    // Generate AI suggestion for expensive items
    const itemWithSwap = {
      name: newItem.name,
      price: newItem.price,
      category: newItem.category,
      ingredients,
      addedBy: currentUser.id,
      ...(newItem.price > 100 && {
        suggestedSwap: {
          name: `${newItem.name} (Store Brand)`,
          price: Math.round(newItem.price * 0.7),
          reason: "Save money with store brand alternative"
        }
      })
    };

    addItemToCart(cartId!, itemWithSwap);
    
    toast({
      title: "Item Added!",
      description: `${newItem.name} has been added to your cart.`,
    });

    setNewItem({ name: '', price: 0, category: '', ingredients: '' });
    setIsAddItemOpen(false);
  };

  const handleAcceptSwap = (itemId: string) => {
    acceptSwap(cartId!, itemId);
    toast({
      title: "💡 Smart Swap Accepted!",
      description: "Great choice! You're saving money.",
    });
  };

  const handleShareCart = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share this link to invite others to your cart.",
      });
    } catch {
      toast({
        title: "Share Cart",
        description: `Cart ID: ${cartId}`,
      });
    }
  };

  const getBudgetProgress = (category: string) => {
    const spent = getCategorySpent(cartId!, category);
    const budget = cart.categoryBudgets[category] || 0;
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const totalSpent = cart.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="container max-w-4xl mx-auto py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">{cart.name}</h1>
            <p className="text-muted-foreground">Total: ₹{totalSpent.toFixed(2)}</p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleShareCart} variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={() => navigate(`/summary/${cartId}`)}>
              <Receipt className="w-4 h-4 mr-2" />
              Summary
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Cart Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Item Button */}
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6 cursor-pointer hover:shadow-card transition-all duration-300 border-dashed border-2 border-primary/50 bg-primary/5">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Plus className="w-6 h-6" />
                      <span className="font-semibold">Add Item to Cart</span>
                    </div>
                  </Card>
                </motion.div>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="itemName">Product Name</Label>
                    <Input
                      id="itemName"
                      placeholder="e.g., Organic Bananas"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="itemPrice">Price (₹)</Label>
                    <Input
                      id="itemPrice"
                      type="number"
                      placeholder="0"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="itemCategory">Category</Label>
                    <Select onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="itemIngredients">Ingredients (comma-separated)</Label>
                    <Input
                      id="itemIngredients"
                      placeholder="e.g., milk, eggs, wheat"
                      value={newItem.ingredients}
                      onChange={(e) => setNewItem(prev => ({ ...prev, ingredients: e.target.value }))}
                    />
                  </div>
                  
                  <Button onClick={handleAddItem} className="w-full">
                    Add to Cart
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Cart Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 bg-card/50 backdrop-blur-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{item.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Added by {cart.users.find(u => u.id === item.addedBy)?.name}
                            </span>
                          </div>
                          <p className="text-lg font-bold mt-2">₹{item.price}</p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemFromCart(cartId!, item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* AI Swap Suggestion */}
                      {item.suggestedSwap && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">AI Suggestion</p>
                                <p className="text-sm text-muted-foreground">
                                  Switch to <strong>{item.suggestedSwap.name}</strong> for ₹{item.suggestedSwap.price}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.suggestedSwap.reason}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAcceptSwap(item.id)}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  // Remove suggestion without accepting
                                  const updatedItem = { ...item, suggestedSwap: undefined };
                                  // This would need to be implemented in the store
                                }}
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Allergy Warning */}
                      {(() => {
                        const conflictUsers = checkAllergyConflicts(cartId!, item.ingredients);
                        if (conflictUsers.length === 0) return null;
                        return (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20"
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-warning">Allergy Warning</p>
                                <p className="text-xs text-muted-foreground">
                                  {conflictUsers.map(u => u.name).join(', ')} {conflictUsers.length === 1 ? 'is' : 'are'} allergic to ingredients in this item
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {cart.items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">Your cart is empty. Add some items to get started!</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Shoppers ({cart.users.length})
                </h3>
                <div className="space-y-2">
                  {cart.users.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                      {user.allergies.length > 0 && (
                        <AlertTriangle className="w-3 h-3 text-warning" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Budget Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Budget Progress</h3>
                <div className="space-y-3">
                  {Object.entries(cart.categoryBudgets)
                    .filter(([_, budget]) => budget > 0)
                    .map(([category, budget]) => {
                      const spent = getCategorySpent(cartId!, category);
                      const progress = getBudgetProgress(category);
                      const isOverBudget = progress > 100;
                      
                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{category}</span>
                            <span className={isOverBudget ? 'text-danger' : ''}>
                              ₹{spent.toFixed(0)} / ₹{budget}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(progress, 100)} 
                            className={`h-2 ${isOverBudget ? 'bg-danger/20' : ''}`}
                          />
                          {isOverBudget && (
                            <p className="text-xs text-danger mt-1">
                              Over budget by ₹{(spent - budget).toFixed(0)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span>{cart.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spent:</span>
                    <span>₹{totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Smart Swaps:</span>
                    <span>{cart.smartSwapsAccepted}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Total Savings:</span>
                    <span>₹{cart.totalSavings.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;