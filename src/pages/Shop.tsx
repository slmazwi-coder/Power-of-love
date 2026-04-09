import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ShoppingBag, Search, Filter, Check, X, Info } from 'lucide-react';
import { UNIFORM_PRODUCTS } from '../constants';
import { cn } from '../lib/utils';

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ id: string; size: string; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = Array.from(new Set(UNIFORM_PRODUCTS.map(p => p.category)));

  const filteredProducts = UNIFORM_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const cartTotal = cart.reduce((total, item) => {
    const product = UNIFORM_PRODUCTS.find(p => p.id === item.id);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Uniform Shop</h1>
          <p className="text-navy-200 max-w-2xl mx-auto font-light">
            Official school wear and accessories for Power of Love Primary School.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" /> Search
              </h3>
              <input
                type="text"
                placeholder="Find a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-navy-900 outline-none transition-all text-sm"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedCategory === null ? "bg-navy-900 text-white font-bold" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  All Items
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedCategory === cat ? "bg-navy-900 text-white font-bold" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> Collection Info
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Orders can be collected from the school office during office hours (07:30 - 14:30). Please bring your proof of payment.
              </p>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-8 right-28 w-16 h-16 bg-navy-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: 500 }}
              animate={{ x: 0 }}
              exit={{ x: 500 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-navy-900 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" /> Your Cart
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const product = UNIFORM_PRODUCTS.find(p => p.id === item.id);
                    if (!product) return null;
                    return (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-navy-900 text-sm">{product.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-navy-900 font-bold">R {product.price * item.quantity}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-navy-900">R {cartTotal}</span>
                  </div>
                  <button className="w-full py-4 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20">
                    Proceed to Checkout
                  </button>
                  <p className="text-[10px] text-center text-gray-400">Secure payment powered by PayFast</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: typeof UNIFORM_PRODUCTS[0]; onAddToCart: (id: string, size: string) => void }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product.id, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all"
    >
      <div className="h-64 relative overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-navy-900 uppercase tracking-widest shadow-sm">
          {product.category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-navy-900">{product.name}</h3>
          <span className="text-lg font-black text-navy-900">R {product.price}</span>
        </div>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed line-clamp-2">{product.description}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Size</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    selectedSize === size ? "bg-navy-900 text-white border-navy-900" : "bg-white text-gray-600 border-gray-200 hover:border-navy-900"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdded}
            className={cn(
              "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
              isAdded ? "bg-green-500 text-white" : "bg-navy-900 text-white hover:bg-navy-800"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
