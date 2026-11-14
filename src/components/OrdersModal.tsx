import React, { useEffect, useState, useCallback } from 'react';
import { X, Package, Clock, CheckCircle2, LogIn, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: string;
  tool: string;
  planDuration: string;
  paymentMethod: string;
  priceTnd: number;
  status: string;
  createdAt: string;
}

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewOrder: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  onOpenNewOrder,
}) => {
  const { user, signInWithGoogle, getFreshToken, authError } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const idToken = await getFreshToken();
      if (!idToken) return;
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de chargement');
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Impossible de récupérer vos commandes.');
    } finally {
      setLoading(false);
    }
  }, [user, getFreshToken]);

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user, fetchOrders]);

  if (!isOpen) return null;

  const formatStatus = (status: string) => {
    if (status === 'activated') {
      return {
        label: 'Activé',
        className: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
        Icon: CheckCircle2,
      };
    }
    if (status === 'processing') {
      return {
        label: 'En traitement',
        className: 'bg-blue-950/70 text-blue-300 border-blue-500/30',
        Icon: RefreshCw,
      };
    }
    return {
      label: 'En attente de paiement',
      className: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
      Icon: Clock,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0c1220] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mes Commandes</h3>
              <p className="text-xs text-slate-400">
                Suivi de vos activations et paiements en Dinars (TND)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer mes commandes"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {!user ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-slate-300">
                Connectez-vous avec Google pour consulter l'historique et le statut de vos commandes.
              </p>
              {authError && (
                <p className="text-xs text-red-400">{authError}</p>
              )}
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Se connecter avec Google</span>
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Chargement de vos commandes...
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm text-slate-300">
                Vous n'avez encore passé aucune commande avec ce compte ({user.email}).
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewOrder();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
              >
                <span>Passer une commande</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const badge = formatStatus(order.status);
                const StatusIcon = badge.Icon;
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          #{order.id}
                        </span>
                        <span className="text-sm font-bold text-white">{order.tool}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {order.planDuration} • {order.paymentMethod} •{' '}
                        {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-sm font-extrabold text-white">
                        {order.priceTnd} TND
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.className}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
