import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useShopSettings } from "@/hooks/use-shop-settings";

export interface AreaSelectionModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: (orderType: "delivery" | "pickup", address: string) => Promise<void>;
  isControlled?: boolean;
}

export const AreaSelectionModal = ({ 
  open: controlledOpen, 
  onOpenChange: setControlledOpen, 
  onConfirm,
  isControlled = false 
}: AreaSelectionModalProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? (controlledOpen ?? false) : internalOpen;
  const setOpen = isControlled && setControlledOpen ? setControlledOpen : setInternalOpen;
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [city, setCity] = useState("karachi");
  const [area, setArea] = useState("");
  const [sector, setSector] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { settings } = useShopSettings();

  useEffect(() => {
    // Area picker opens only when explicitly triggered (e.g., Place Order).
    if (!user) {
      setOpen?.(false);
    }
  }, [user, setOpen]);
  const areas = [
    "Gulshan-e-Maymar",
    "Scheme 33",
    "Ahsanabad",
    "Surjani Town",
    "North Karachi",
    "New Karachi"
  ];

  const sectors = [
    "Sector Q",
    "Sector R",
    "Sector S",
    "Sector T",
    "Sector U",
    "Sector V",
    "Sector W",
    "Sector X",
    "Sector Y",
    "Sector Z"
  ];

  const handleSelect = async () => {
    if (orderType === "delivery" && (!area || !sector || !addressLine.trim())) {
      toast.error("Please fill in all delivery location and address details.");
      return;
    }

    setLoading(true);
    const deliveryAddress = orderType === "delivery"
      ? `${addressLine.trim()}, ${sector}, ${area}, ${city}`
      : `Pick-up: ${settings.pickupBranchName}, ${settings.pickupBranchAddress}`;

    try {
      // If we have an external onConfirm handler mapping out the actual checkout process, use it!
      if (onConfirm) {
        await onConfirm(orderType, deliveryAddress);
      } else if (user) {
        // Otherwise do the standard "just logging the pref" logic
        const { error } = await supabase.from('orders').insert({
          user_id: user.id,
          status: 'pending',
          total_amount: 0,
          delivery_address: deliveryAddress,
          order_type: orderType,
        });

        if (error) throw error;
      }
      
      if (!isControlled) {
        // Save locally so login modal doesn't open again for this user
        if (user) {
          localStorage.setItem(`area_selection_done_${user.id}`, "true");
        }
        localStorage.setItem("selected_order_type", orderType);
        localStorage.setItem("selected_area", area);
        localStorage.setItem("selected_sector", sector);
        localStorage.setItem("selected_address", addressLine);
        toast.success("Location set successfully!");
      }

      setOpen?.(false);

    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving your preferrence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      // Prevent closing if they haven't selected anything by forcing them to use the button.
      // But we will let them close if they really want, or we can force it:
      setOpen?.(val);
    }}>
      <DialogContent className="sm:max-w-md w-[95vw] rounded-[24px] p-0 overflow-hidden border border-border bg-card shadow-card">
        <div className="p-6 sm:p-8 flex flex-col items-center">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-display text-2xl sm:text-3xl font-semibold text-foreground text-center tracking-tight">
              Select your order type
            </DialogTitle>
          </DialogHeader>
          
          {/* Toggle */}
          <div className="bg-muted flex rounded-full mb-8 relative p-[3px]">
            <button
              onClick={() => setOrderType("delivery")}
              className={cn(
                "rounded-full px-6 sm:px-8 py-2.5 text-xs font-bold transition-all z-10 min-w-[110px] w-1/2 text-center",
                orderType === "delivery" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              DELIVERY
            </button>
            <button
              onClick={() => setOrderType("pickup")}
              className={cn(
                "rounded-full px-6 sm:px-8 py-2.5 text-xs font-bold transition-all z-10 min-w-[110px] w-1/2 text-center",
                orderType === "pickup" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              PICK-UP
            </button>
          </div>

          <div className="w-full flex flex-col items-center">
            <p className="text-foreground font-medium mb-4 text-[16px]">
              {orderType === "delivery" ? "Please select your location" : "Choose pickup branch"}
            </p>

            {orderType === "delivery" ? (
              <div className="space-y-4 w-full">
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="w-full text-foreground bg-background rounded-md border-border h-12 text-[15px] px-4 shadow-sm focus:ring-1 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="karachi" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">Karachi</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="w-full text-foreground bg-background rounded-md border-border h-12 text-[15px] px-4 shadow-sm focus:ring-1 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Please select your area" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-[200px]">
                    {areas.map((a) => (
                      <SelectItem key={a} value={a} className="focus:bg-primary/20 focus:text-foreground cursor-pointer">
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="w-full text-foreground bg-background rounded-md border-border h-12 text-[15px] px-4 shadow-sm focus:ring-1 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border max-h-[200px]">
                    {sectors.map((s) => (
                      <SelectItem key={s} value={s} className="focus:bg-primary/20 focus:text-foreground cursor-pointer">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <input
                  type="text"
                  placeholder="Exact address (House #, Street, etc.)"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-4 bg-background rounded-md border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-[15px] h-12 shadow-sm"
                />
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="p-4 rounded-md border-2 border-dashed border-primary/40 bg-primary/5 text-center">
                  <p className="font-bold text-foreground text-lg">{settings.pickupBranchName}</p>
                  <p className="text-sm text-muted-foreground mt-1">{settings.pickupBranchAddress}</p>
                </div>
              </div>
            )}

            <div className="w-full h-[1px] bg-border my-6" />

            <Button 
              onClick={handleSelect}
              disabled={loading}
              className="w-full bg-gradient-fire hover:opacity-90 text-primary-foreground rounded-xl h-12 text-lg font-medium shadow-none transition-all active:scale-[0.98]"
            >
              {loading ? "Saving..." : "Select"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};