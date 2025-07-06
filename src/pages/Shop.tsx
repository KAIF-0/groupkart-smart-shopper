import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCartStore } from '@/store/cartStore';
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES, type Product } from '@/types';
import { Star, ShoppingCart, AlertTriangle, CheckCircle, X, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { HeroButton } from '@/components/ui/hero-button';

const Shop = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartSelectionOpen, setIsCartSelectionOpen] = useState(false);

  const {
    carts,
    currentUser,
    addItemToCart,
    checkAllergyConflicts,
    getCategorySpent
  } = useCartStore();

  // if (!currentUser) {
  //   navigate('/');
  //   return null;
  // }

  const userCarts = Object.values(carts);
  // const userCarts = cartsList.filter(cart =>
  //   cart.users.some(user => user.id === currentUser?.id)
  // );

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    if (userCarts.length === 0) {
      toast({
        title: "No Cart Found",
        description: "Please create a cart first to add products.",
        variant: "destructive",
      });
      return;
    }

    if (userCarts.length === 1) {
      addProductToCart(product, userCarts[0].id);
    } else {
      setSelectedProduct(product);
      setIsCartSelectionOpen(true);
    }
  };

  const addProductToCart = (product: Product, cartId: string) => {
    const cart = carts[cartId];
    if (!cart) return;

    // Check for allergy conflicts
    const conflictUsers = checkAllergyConflicts(cartId, product.ingredients);

    const itemData = {
      name: product.name,
      price: product.price,
      category: product.category,
      ingredients: product.ingredients,
      addedBy: currentUser.id,
      ...(product.price > 100 && {
        suggestedSwap: {
          name: `${product.name} (Store Brand)`,
          price: Math.round(product.price * 0.7),
          reason: "Save money with store brand alternative"
        }
      })
    };

    addItemToCart(cartId, itemData);

    if (conflictUsers.length > 0) {
      toast({
        title: "⚠️ Allergy Alert!",
        description: `${conflictUsers.map(u => u.name).join(', ')} ${conflictUsers.length === 1 ? 'is' : 'are'} allergic to ingredients in this item.`,
        variant: "destructive",
      });
    }

    // Check budget overflow
    const categorySpent = getCategorySpent(cartId, product.category);
    const categoryBudget = cart.categoryBudgets[product.category] || 0;
    const wouldExceed = categorySpent + product.price > categoryBudget;

    if (wouldExceed && categoryBudget > 0) {
      toast({
        title: "💰 Budget Alert!",
        description: `This item would exceed your ${product.category} budget by ₹${Math.round((categorySpent + product.price) - categoryBudget)}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Item Added!",
        description: `${product.name} has been added to ${cart.name}.`,
      });
    }

    setIsCartSelectionOpen(false);
    setSelectedProduct(null);
  };


  const ProductCard = ({ product }: { product: Product }) => {

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm hover:shadow-card transition-all duration-300">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Badge className="absolute top-2 right-2 bg-primary/90">
              {product.category}
            </Badge>
          </div>

          <CardContent className="flex-1 p-4 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">₹{product.price}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {product.ingredients.slice(0, 3).map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="text-xs">
                  {ingredient}
                </Badge>
              ))}
              {product.ingredients.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{product.ingredients.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              onClick={() => handleAddToCart(product)}
              className="w-full"
              disabled={userCarts.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>

        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="container max-w-7xl mx-auto py-6">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-right mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(`/`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <HeroButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/carts')}
          >
            View My Carts
          </HeroButton>
        </motion.div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Shop Products</h1>
          <p className="text-muted-foreground">Browse and add products to your carts</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {PRODUCT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </motion.div>
        )}

        {/* Cart Selection Modal */}
        <Dialog open={isCartSelectionOpen} onOpenChange={setIsCartSelectionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Cart</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have multiple carts. Choose which cart to add "{selectedProduct?.name}" to:
              </p>
              <div className="space-y-2">
                {userCarts.map((cart) => (
                  <Button
                    key={cart.id}
                    variant="outline"
                    className="w-full justify-between h-auto p-4"
                    onClick={() => selectedProduct && addProductToCart(selectedProduct, cart.id)}
                  >
                    <div className="text-left">
                      <p className="font-medium">{cart.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cart.users.length > 1 ? 'Group' : 'Solo'} • {cart.items.length} items
                      </p>
                    </div>
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Shop;