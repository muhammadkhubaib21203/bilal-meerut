import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, total, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" /> Your Order
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 bg-secondary/50 rounded-xl"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      <p className="text-primary text-sm font-bold">Rs {item.price * item.quantity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="ml-auto p-1 hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rs {total}</span>
                </div>
                <a
                  href="https://www.foodpanda.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-gradient-fire rounded-xl text-primary-foreground font-semibold text-center hover:opacity-90 transition-opacity shadow-glow"
                >
                  Order on Foodpanda
                </a>
                <a
                  href="https://wa.me/923305577668"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-secondary rounded-xl text-secondary-foreground font-semibold text-center hover:bg-secondary/80 transition-colors border border-border"
                >
                  Order via WhatsApp
                </a>
                <button onClick={clearCart} className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors">
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
