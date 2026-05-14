import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Abbas Ahmed",
    rating: 5,
    text: "Cleanliness 👌 Tikka 👌👌 The kababs are absolutely amazing, grilled perfectly on charcoal. Best BBQ spot in Gulshan-e-Maymar!",
    time: "2 months ago",
  },
  {
    name: "Khadija Dilawar",
    rating: 5,
    text: "Excellent service and delicious food",
    time: "4 months ago",
  },
  {
    name: "Awais Abbasi",
    rating: 4,
    text: "Good place for BBQ items. Atmosphere is good 👍🏼 Fast service with good quality food. Highly recommended for BBQ lovers.",
    time: "3 months ago",
  },
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            What People <span className="text-gradient-fire">Say</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-6 h-6 text-gold fill-gold" />
            ))}
            <Star className="w-6 h-6 text-gold fill-gold/50" />
            <span className="text-2xl font-bold ml-2">4.2</span>
          </div>
          <p className="text-muted-foreground">Based on 18 Google reviews</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/20 transition-colors shadow-card"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-foreground text-sm mb-6 leading-relaxed">{r.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{r.name}</p>
                <p className="text-muted-foreground text-xs">{r.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
