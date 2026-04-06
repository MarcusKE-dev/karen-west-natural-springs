import { ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartButton = () => {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-14 h-14 rounded-full bg-water-gradient text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>
      <a
        href="https://wa.me/254726732212"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-green-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default CartButton;
