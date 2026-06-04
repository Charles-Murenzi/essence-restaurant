"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Utensils, User, ShoppingCart, CheckCircle, ChevronLeft,
  Star, Loader2, MessageSquare, Clock, Plus, Minus
} from "lucide-react";
import { api, CategoryDto, StaffDto, TableDto, OrderResponseDto } from "@/lib/api";

const STEPS = {
  TABLE: "table",
  WAITER: "waiter",
  MENU: "menu",
  CART: "cart",
  CONFIRM: "confirm",
};

interface CartItem { menuItemId: string; name: string; price: number; quantity: number }

export default function MenuPage() {
  const [step, setStep] = useState(STEPS.TABLE);
  const [tables, setTables] = useState<TableDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [waiters, setWaiters] = useState<StaffDto[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableDto | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<StaffDto | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryDto | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placedOrder, setPlacedOrder] = useState<OrderResponseDto | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    Promise.all([api.getTables(), api.getMenu(), api.getWaiters()])
      .then(([t, m, w]) => {
        setTables(t);
        setCategories(m);
        setActiveCategory(m[0] ?? null);
        setWaiters(w);
      })
      .catch(() => setError("Could not connect to the server. Please ask staff for help."))
      .finally(() => setPageLoading(false));
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function updateCart(item: { id: string; name: string; price: number }, delta: number) {
    setCart(prev => {
      const existing = prev.find(c => c.menuItemId === item.id);
      if (!existing && delta > 0) return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return prev.filter(c => c.menuItemId !== item.id);
      return prev.map(c => c.menuItemId === item.id ? { ...c, quantity: newQty } : c);
    });
  }

  async function handlePlaceOrder() {
    if (!selectedTable || cart.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const order = await api.placeOrder({
        tableId: selectedTable.id,
        waiterId: selectedWaiter?.userId,
        items: cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity })),
        specialInstructions,
        preferredPaymentMethod: 0,
      });
      setPlacedOrder(order);
      setStep(STEPS.CONFIRM);
    } catch {
      setError("Failed to place order. Please try again or call a waiter.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitRating() {
    if (!placedOrder || rating === 0) return;
    try {
      await api.submitRating(placedOrder.id, rating, feedback || undefined);
      setRatingSubmitted(true);
    } catch {
      setError("Failed to submit rating. Please try again.");
    }
  }

  async function handleSubmitFeedback() {
    if (!generalFeedback.trim()) return;
    try {
      await api.submitFeedback(generalFeedback, "General");
      setGeneralFeedback("");
      setFeedbackSubmitted(true);
    } catch {
      setError("Failed to send feedback. Please try again.");
    }
  }

  function resetFlow() {
    setStep(STEPS.TABLE);
    setCart([]);
    setSelectedWaiter(null);
    setSelectedTable(null);
    setPlacedOrder(null);
    setRating(0);
    setFeedback("");
    setFeedbackSubmitted(false);
    setGeneralFeedback("");
    setSpecialInstructions("");
  }

  function goBack() {
    if (step === STEPS.WAITER) setStep(STEPS.TABLE);
    else if (step === STEPS.MENU) setStep(STEPS.WAITER);
    else if (step === STEPS.CART) setStep(STEPS.MENU);
  }

  if (pageLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-primary mx-auto" size={48} />
        <p className="text-muted-foreground">Loading Essence...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="p-4 flex justify-between items-center glass sticky top-0 z-50 border-b border-primary/10">
        <div className="flex items-center gap-2">
          {[STEPS.WAITER, STEPS.MENU, STEPS.CART].includes(step) && (
            <button onClick={goBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft className="text-primary" size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold text-gold-gradient">ESSENCE</h1>
        </div>
        <div className="flex items-center gap-3">
          {selectedTable && (
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Table</p>
              <p className="font-bold text-primary">{selectedTable.tableNumber}</p>
            </div>
          )}
          {step === STEPS.MENU && (
            <button onClick={() => setStep(STEPS.CART)} className="relative p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
              <ShoppingCart className="text-primary" size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-2 text-red-300 hover:text-white">✕</button>
        </div>
      )}

      <main className="max-w-2xl mx-auto p-4">
        <AnimatePresence mode="wait">

          {/* STEP 1: TABLE SELECTION */}
          {step === STEPS.TABLE && (
            <motion.div key="table" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold mb-2">Welcome to <span className="text-gold-gradient">Essence</span></h2>
                <p className="text-muted-foreground">Select your table to begin</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {tables.map(table => (
                  <button key={table.id} disabled={table.isOccupied}
                    onClick={() => { setSelectedTable(table); setStep(STEPS.WAITER); }}
                    className={`glass p-6 rounded-2xl flex flex-col items-center gap-3 transition-all border
                      ${table.isOccupied ? "opacity-40 cursor-not-allowed" : "hover:border-primary/50 cursor-pointer"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                      ${table.isOccupied ? "bg-red-900/30 text-red-400" : "bg-primary/10 text-primary"}`}>
                      {table.tableNumber.charAt(0)}
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{table.tableNumber}</p>
                      <p className="text-xs text-muted-foreground">{table.capacity} seats</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block
                        ${table.isOccupied ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>
                        {table.isOccupied ? "Occupied" : "Available"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: WAITER SELECTION */}
          {step === STEPS.WAITER && (
            <motion.div key="waiter" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="text-center py-6">
                <h2 className="text-2xl font-bold mb-2">Choose Your Server</h2>
                <p className="text-muted-foreground text-sm">Pick a waiter who will take care of you today</p>
              </div>

              {waiters.length === 0 ? (
                <div className="text-center py-10 glass rounded-2xl">
                  <User className="mx-auto text-muted-foreground mb-3" size={40} />
                  <p className="text-muted-foreground mb-4">No waiters on duty right now</p>
                  <Button onClick={() => { setSelectedWaiter(null); setStep(STEPS.MENU); }}>Browse Menu Anyway</Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {waiters.map(waiter => (
                      <button key={waiter.id} onClick={() => { setSelectedWaiter(waiter); setStep(STEPS.MENU); }}
                        className="glass w-full p-5 rounded-2xl flex items-center gap-5 hover:border-primary/50 transition-all text-left">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border-2 border-primary/20 shrink-0">
                          {waiter.fullName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-lg">{waiter.fullName}</p>
                            <div className="flex items-center gap-1 text-primary shrink-0">
                              <Star size={14} fill="currentColor" />
                              <span className="text-sm font-bold">{waiter.rating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({waiter.reviewCount})</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{waiter.languages.join(" · ")}</p>
                          {waiter.specialties.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {waiter.specialties.map(s => (
                                <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => { setSelectedWaiter(null); setStep(STEPS.MENU); }}
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 transition-colors">
                    Skip — assign me any available waiter
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 3: MENU */}
          {step === STEPS.MENU && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {selectedWaiter && (
                <div className="glass p-3 rounded-xl flex items-center gap-3 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {selectedWaiter.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Your Server</p>
                    <p className="font-semibold text-sm">{selectedWaiter.fullName}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-primary text-xs">
                    <Star size={10} fill="currentColor" />
                    <span>{selectedWaiter.rating.toFixed(1)}</span>
                  </div>
                </div>
              )}

              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${activeCategory?.id === cat.id ? "bg-primary text-primary-foreground" : "glass hover:border-primary/30"}`}>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Menu items */}
              <div className="space-y-3">
                {activeCategory?.menuItems.filter(i => i.isAvailable).length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">No items available in this category</div>
                )}
                {activeCategory?.menuItems.filter(i => i.isAvailable).map(item => {
                  const inCart = cart.find(c => c.menuItemId === item.id);
                  return (
                    <div key={item.id} className="glass p-4 rounded-xl flex gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold">{item.name}</p>
                        {item.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>}
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-primary font-bold">{item.price.toLocaleString()} RWF</p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={10} /> ~{item.estimatedPrepTimeMinutes}min
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center shrink-0">
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCart(item, -1)} className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                              <Minus size={12} className="text-primary" />
                            </button>
                            <span className="w-6 text-center font-bold text-primary">{inCart.quantity}</span>
                            <button onClick={() => updateCart(item, 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors">
                              <Plus size={12} className="text-primary-foreground" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => updateCart(item, 1)}
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors">
                            <Plus size={14} className="text-primary-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: CART / REVIEW ORDER */}
          {step === STEPS.CART && (
            <motion.div key="cart" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
              <h2 className="text-2xl font-bold py-4">Your Order</h2>

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <ShoppingCart className="mx-auto text-muted-foreground" size={48} />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button onClick={() => setStep(STEPS.MENU)} variant="outline" className="rounded-full border-primary/20">Browse Menu</Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.menuItemId} className="glass p-4 rounded-xl flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.price.toLocaleString()} RWF each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCart({ id: item.menuItemId, name: item.name, price: item.price }, -1)}
                            className="w-7 h-7 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                            <Minus size={12} className="text-primary" />
                          </button>
                          <span className="w-6 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateCart({ id: item.menuItemId, name: item.name, price: item.price }, 1)}
                            className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-accent transition-colors">
                            <Plus size={12} className="text-primary-foreground" />
                          </button>
                        </div>
                        <p className="text-primary font-bold w-20 text-right text-sm">{(item.price * item.quantity).toLocaleString()} RWF</p>
                      </div>
                    ))}
                  </div>

                  <div className="glass p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span><span>{totalPrice.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2 mt-2">
                      <span>Total</span><span className="text-primary">{totalPrice.toLocaleString()} RWF</span>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl">
                    <label className="text-sm text-muted-foreground block mb-2">Special instructions (optional)</label>
                    <textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)}
                      placeholder="Allergies, preferences, how you'd like your food..." rows={3}
                      className="w-full bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/50" />
                  </div>

                  <Button onClick={handlePlaceOrder} disabled={loading} className="w-full py-6 text-lg rounded-xl">
                    {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                    Place Order · {totalPrice.toLocaleString()} RWF
                  </Button>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 5: CONFIRMED */}
          {step === STEPS.CONFIRM && placedOrder && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-8">
              <div className="text-center space-y-3">
                <div className="inline-flex p-5 bg-primary/20 rounded-full text-primary">
                  <CheckCircle size={56} />
                </div>
                <h2 className="text-3xl font-bold text-gold-gradient">Order Placed!</h2>
                <p className="text-muted-foreground">
                  {selectedWaiter ? `${selectedWaiter.fullName} will be with you shortly.` : "A waiter will be with you shortly."}
                </p>
              </div>

              <div className="glass p-5 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-xs">{placedOrder.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Table</span>
                  <span className="font-semibold">{placedOrder.tableNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Ready</span>
                  <span className="text-primary font-bold flex items-center gap-1"><Clock size={14} /> ~{placedOrder.estimatedReadyInMinutes} min</span>
                </div>
                <div className="flex justify-between font-bold border-t border-white/10 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-primary">{placedOrder.totalAmount.toLocaleString()} RWF</span>
                </div>
              </div>

              {/* Rating */}
              {selectedWaiter && !ratingSubmitted && (
                <div className="glass p-5 rounded-2xl space-y-4">
                  <h3 className="font-bold text-primary flex items-center gap-2"><Star size={16} fill="currentColor" /> Rate {selectedWaiter.fullName}</h3>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                        <Star size={28} className="text-primary" fill={star <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                    placeholder="Leave a comment (optional)..." rows={2}
                    className="w-full bg-white/5 rounded-lg p-3 text-sm resize-none outline-none border border-white/10 placeholder:text-muted-foreground/50" />
                  <Button onClick={handleSubmitRating} disabled={rating === 0} className="w-full rounded-full">
                    Submit Rating
                  </Button>
                </div>
              )}

              {ratingSubmitted && (
                <div className="glass p-4 rounded-2xl text-center text-green-400 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Thank you for your rating!
                </div>
              )}

              {/* General Feedback */}
              <div className="glass p-5 rounded-2xl space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-sm"><MessageSquare size={14} className="text-primary" /> General Feedback</h3>
                {feedbackSubmitted ? (
                  <div className="flex items-center justify-center gap-2 text-green-400 py-3">
                    <CheckCircle size={16} /> Thank you for your feedback!
                  </div>
                ) : (
                  <>
                    <textarea
                      value={generalFeedback}
                      onChange={e => setGeneralFeedback(e.target.value)}
                      placeholder="How was your experience? Food, ambience, service..."
                      rows={2}
                      className="w-full bg-white/5 rounded-lg p-3 text-sm resize-none outline-none border border-white/10 placeholder:text-muted-foreground/50" />
                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={!generalFeedback.trim()}
                      variant="outline"
                      className="w-full rounded-full border-primary/20 text-sm">
                      Send Feedback
                    </Button>
                  </>
                )}
              </div>

              <Button onClick={resetFlow} variant="outline" className="w-full rounded-full border-primary/20">
                New Order
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Sticky cart bar when on menu step */}
      {step === STEPS.MENU && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
          <div className="max-w-2xl mx-auto">
            <Button onClick={() => setStep(STEPS.CART)} className="w-full py-5 rounded-2xl text-base font-bold">
              <ShoppingCart className="mr-2" size={18} />
              Review Order · {totalItems} items · {totalPrice.toLocaleString()} RWF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
