"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Loader2, RefreshCw, ChevronDown, ChevronUp, UtensilsCrossed } from "lucide-react";
import { api, StaffDto, OrderResponseDto } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-900/30 text-yellow-400 border-yellow-500/30",
  Accepted: "bg-blue-900/30 text-blue-400 border-blue-500/30",
  Preparing: "bg-orange-900/30 text-orange-400 border-orange-500/30",
  Ready: "bg-green-900/30 text-green-400 border-green-500/30",
  Served: "bg-purple-900/30 text-purple-400 border-purple-500/30",
};

const ORDER_STATUS_FLOW: Record<string, { label: string; next: number }> = {
  Pending: { label: "Accept Order", next: 1 },
  Accepted: { label: "Mark Preparing", next: 2 },
  Preparing: { label: "Mark Ready", next: 3 },
  Ready: { label: "Mark Served", next: 4 },
  Served: { label: "Complete", next: 6 },
};

export default function WaiterPage() {
  const [waiters, setWaiters] = useState<StaffDto[]>([]);
  const [selectedWaiter, setSelectedWaiter] = useState<StaffDto | null>(null);
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [confirmMinutes, setConfirmMinutes] = useState<Record<string, number>>({});

  useEffect(() => {
    api.getWaiters().then(setWaiters).catch(() => {});
  }, []);

  const loadOrders = useCallback(async (waiterId: string, silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await api.getWaiterOrders(waiterId);
      setOrders(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedWaiter) return;
    loadOrders(selectedWaiter.userId);
    const interval = setInterval(() => loadOrders(selectedWaiter.userId, true), 15000);
    return () => clearInterval(interval);
  }, [selectedWaiter, loadOrders]);

  async function handleConfirm(orderId: string) {
    const mins = confirmMinutes[orderId] ?? 20;
    await api.confirmOrder(orderId, mins);
    if (selectedWaiter) loadOrders(selectedWaiter.userId, true);
  }

  async function handleStatusUpdate(orderId: string, currentStatus: string) {
    const next = ORDER_STATUS_FLOW[currentStatus]?.next;
    if (next == null) return;
    await api.updateOrderStatus(orderId, next);
    if (selectedWaiter) loadOrders(selectedWaiter.userId, true);
  }

  if (!selectedWaiter) return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gold-gradient mb-2">Waiter Dashboard</h1>
          <p className="text-muted-foreground">Select your profile to view your orders</p>
        </div>
        {waiters.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground"><Loader2 className="animate-spin mx-auto" size={32} /></div>
        ) : (
          <div className="space-y-3">
            {waiters.map(w => (
              <button key={w.id} onClick={() => setSelectedWaiter(w)}
                className="glass w-full p-5 rounded-2xl flex items-center gap-4 hover:border-primary/50 transition-all text-left">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary/20">
                  {w.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{w.fullName}</p>
                  <p className="text-xs text-muted-foreground">{w.specialties.join(", ")}</p>
                </div>
                <span className="ml-auto text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full border border-green-500/20">On Duty</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      <header className="glass sticky top-0 z-50 p-4 flex items-center justify-between border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
            {selectedWaiter.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm">{selectedWaiter.fullName}</p>
            <p className="text-xs text-muted-foreground">Waiter Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => loadOrders(selectedWaiter.id, true)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors" disabled={refreshing}>
            <RefreshCw size={16} className={`text-primary ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setSelectedWaiter(null)} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1 rounded-full border border-white/10 hover:border-white/20 transition-colors">
            Switch
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between py-2">
          <h2 className="font-bold text-lg">Active Orders</h2>
          <span className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <UtensilsCrossed className="mx-auto text-muted-foreground" size={48} />
            <p className="text-muted-foreground">No active orders right now</p>
            <p className="text-xs text-muted-foreground">Page refreshes every 15 seconds</p>
          </div>
        ) : (
          <AnimatePresence>
            {orders.map(order => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl overflow-hidden">
                {/* Order header */}
                <div className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {order.tableNumber}
                    </div>
                    <div>
                      <p className="font-bold text-sm">Table {order.tableNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} items · {order.totalAmount.toLocaleString()} RWF</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? "bg-white/10 text-foreground border-white/20"}`}>
                      {order.status}
                    </span>
                    {expandedOrder === order.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden border-t border-white/10">
                      <div className="p-4 space-y-4">
                        {/* Items */}
                        <div className="space-y-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                              <span className="text-primary">{(item.price * item.quantity).toLocaleString()} RWF</span>
                            </div>
                          ))}
                        </div>

                        {order.estimatedReadyInMinutes > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={14} className="text-primary" />
                            <span>Est. ready in <strong className="text-primary">{order.estimatedReadyInMinutes} min</strong></span>
                          </div>
                        )}

                        {/* Confirm with time (for Pending orders) */}
                        {order.status === "Pending" && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <label className="text-sm text-muted-foreground shrink-0">Est. minutes:</label>
                              <input type="number" min={5} max={120} defaultValue={20}
                                onChange={e => setConfirmMinutes(prev => ({ ...prev, [order.id]: parseInt(e.target.value) || 20 }))}
                                className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/50" />
                            </div>
                            <Button onClick={() => handleConfirm(order.id)} className="w-full rounded-xl">
                              <CheckCircle size={16} className="mr-2" /> Accept & Set Time
                            </Button>
                          </div>
                        )}

                        {/* Status progression buttons */}
                        {order.status !== "Pending" && ORDER_STATUS_FLOW[order.status] && (
                          <Button onClick={() => handleStatusUpdate(order.id, order.status)}
                            variant={order.status === "Ready" ? "default" : "outline"}
                            className="w-full rounded-xl border-primary/20">
                            {ORDER_STATUS_FLOW[order.status].label}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
