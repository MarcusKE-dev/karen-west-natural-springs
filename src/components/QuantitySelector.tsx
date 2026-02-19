import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}

const QuantitySelector = ({ value, onChange, min = 1, max = 999, size = "md" }: QuantitySelectorProps) => {
  const btnClass = size === "sm"
    ? "w-8 h-8 rounded-lg text-sm"
    : "w-10 h-10 rounded-lg text-base";
  const inputClass = size === "sm"
    ? "w-12 h-8 text-sm"
    : "w-14 h-10 text-base";

  return (
    <div className="inline-flex items-center border border-input rounded-xl overflow-hidden bg-background">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${btnClass} flex items-center justify-center text-foreground hover:bg-primary/10 active:bg-primary/20 transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
        }}
        className={`${inputClass} text-center border-x border-input bg-background text-foreground font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${btnClass} flex items-center justify-center text-foreground hover:bg-primary/10 active:bg-primary/20 transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
