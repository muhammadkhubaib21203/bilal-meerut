import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import { categories, menuItems } from "@/data/menu";
import { useCart } from "@/context/CartContext";

const MenuSection = () => {
  const [active, setActive] = useState("All");
  const { addItem } = useCart();

  const filtered = active === "All" ? menuItems : menuItems.filter((i) => i.category === active);

  return (
    <section id="menu" className="py-20 bg-gradient-smoke">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-gradient-fire">Menu</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Freshly prepared with the finest ingredients, grilled to perfection on traditional charcoal
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat
                  ? "bg-gradient-fire text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all shadow-card hover:shadow-glow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.popular && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-gradient-fire rounded-full text-xs font-semibold text-primary-foreground">
                      <Flame className="w-3 h-3" /> Popular
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
                    <span className="text-primary font-bold text-lg">Rs {item.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.description}</p>
                  <button
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
                    className="w-full py-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;
