import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  X,
  ShieldCheck,
  RefreshCw,
  Package,
  Users,
  MessageSquare,
  Search,
  Trash2,
  Mail,
  MessageCircle,
  Check,
  AlertCircle,
  Wallet,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  ADMIN_EMAIL,
  ORDER_STATUSES,
  ORDER_STATUS_META,
  computeAdminStats,
  enrichClientsWithOrders,
  filterAdminOrders,
  isAdminEmail,
  type AdminMessageRecord,
  type AdminOrderRecord,
  type AdminUserRecord,
  type OrderStatus,
} from '../utils/admin';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'orders' | 'clients' | 'messages';

function formatWhatsAppPhone(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 8) return `216${digits}`;
  if (digits.startsWith('00')) return digits.slice(2);
  return digits;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, getFreshToken } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [messages, setMessages] = useState<AdminMessageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientSearch, setClientSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');

  const [savingOrderCode, setSavingOrderCode] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [confirmDeleteOrder, setConfirmDeleteOrder] = useState<string | null>(null);
  const [confirmDeleteMessage, setConfirmDeleteMessage] = useState<number | null>(null);

  const authorized = Boolean(user && isAdminEmail(user.email));

  const fetchOverview = useCallback(async () => {
    if (!user || !isAdminEmail(user.email)) return;
    setLoading(true);
    setError('');
    try {
      const idToken = await getFreshToken();
      if (!idToken) throw new Error('Session expirée. Veuillez vous reconnecter.');
      const res = await fetch('/api/admin/overview', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Accès refusé ou erreur serveur.');
      }
      const fetchedOrders: AdminOrderRecord[] = data.orders || [];
      setOrders(fetchedOrders);
      setUsers(data.users || []);
      setMessages(data.messages || []);

      const nextNotes: Record<string, string> = {};
      for (const ord of fetchedOrders) {
        nextNotes[ord.orderCode] = ord.notes ?? '';
      }
      setDraftNotes(nextNotes);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les données admin.');
    } finally {
      setLoading(false);
    }
  }, [user, getFreshToken]);

  useEffect(() => {
    if (isOpen && authorized) {
      fetchOverview();
    }
  }, [isOpen, authorized, fetchOverview]);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice((prev) => (prev === msg ? '' : prev));
    }, 3500);
  };

  const handleUpdateOrder = async (
    orderCode: string,
    payload: { status?: OrderStatus; notes?: string }
  ) => {
    setSavingOrderCode(orderCode);
    setError('');
    try {
      const idToken = await getFreshToken();
      if (!idToken) throw new Error('Session expirée.');
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderCode)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de la mise à jour.');

      setOrders((prev) =>
        prev.map((o) => (o.orderCode === orderCode ? { ...o, ...data.order } : o))
      );
      showNotice(`Commande #${orderCode} mise à jour.`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSavingOrderCode(null);
    }
  };

  const handleDeleteOrder = async (orderCode: string) => {
    setSavingOrderCode(orderCode);
    setError('');
    try {
      const idToken = await getFreshToken();
      if (!idToken) throw new Error('Session expirée.');
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderCode)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de la suppression.');

      setOrders((prev) => prev.filter((o) => o.orderCode !== orderCode));
      setConfirmDeleteOrder(null);
      showNotice(`Commande #${orderCode} supprimée.`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression.');
    } finally {
      setSavingOrderCode(null);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    setError('');
    try {
      const idToken = await getFreshToken();
      if (!idToken) throw new Error('Session expirée.');
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Échec de la suppression.');

      setMessages((prev) => prev.filter((m) => m.id !== id));
      setConfirmDeleteMessage(null);
      showNotice('Message supprimé.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du message.');
    }
  };

  const stats = useMemo(
    () => computeAdminStats(orders, users, messages),
    [orders, users, messages]
  );

  const filteredOrders = useMemo(
    () => filterAdminOrders(orders, statusFilter, orderSearch),
    [orders, statusFilter, orderSearch]
  );

  const enrichedClients = useMemo(
    () => enrichClientsWithOrders(users, orders),
    [users, orders]
  );

  const filteredClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return enrichedClients;
    return enrichedClients.filter((c) =>
      [c.displayName ?? '', c.email, c.uid].join(' ').toLowerCase().includes(q)
    );
  }, [enrichedClients, clientSearch]);

  const filteredMessages = useMemo(() => {
    const q = messageSearch.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) =>
      [m.name, m.email, m.phone ?? '', m.subject, m.message]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [messages, messageSearch]);

  if (!isOpen || !authorized) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-title"
    >
      <div className="relative w-full max-w-6xl bg-[#0c1220] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="admin-dashboard-title" className="text-lg sm:text-xl font-extrabold text-white">
                  Administration DigiPaiement.tn
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                  {ADMIN_EMAIL}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Gestion en direct des commandes, clients Google et messages Cloud SQL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchOverview}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le tableau de bord admin"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Bar */}
        <div className="px-4 sm:px-6 pt-4 pb-3 bg-slate-950/60 border-b border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Commandes</span>
                <Package className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-xl font-extrabold text-white mt-1">{stats.totalOrders}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/20">
              <div className="flex items-center justify-between text-[11px] text-amber-300">
                <span>En attente</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-xl font-extrabold text-amber-300 mt-1">{stats.pendingOrders}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/20">
              <div className="flex items-center justify-between text-[11px] text-emerald-300">
                <span>Activées</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xl font-extrabold text-emerald-300 mt-1">{stats.activatedOrders}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-[11px] text-cyan-300">
                <span>Volume TND</span>
                <Wallet className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-extrabold text-white mt-1">{stats.totalRevenueTnd} TND</p>
              <p className="text-[10px] text-emerald-400">{stats.activatedRevenueTnd} TND activés</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Clients</span>
                <Users className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-xl font-extrabold text-white mt-1">{stats.totalUsers}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Messages</span>
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-xl font-extrabold text-white mt-1">{stats.totalMessages}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-4" role="tablist" aria-label="Sections d'administration">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Commandes ({orders.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'clients'}
              onClick={() => setActiveTab('clients')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'clients'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clients ({users.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'messages'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Messages ({messages.length})</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {(error || notice) && (
          <div className="px-4 sm:px-6 pt-3 space-y-2">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {notice && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{notice}</span>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {loading && orders.length === 0 && users.length === 0 && messages.length === 0 ? (
            <div className="py-14 text-center text-sm text-slate-400">
              Chargement des données depuis Cloud SQL...
            </div>
          ) : activeTab === 'orders' ? (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <label htmlFor="admin-order-search" className="sr-only">
                    Rechercher une commande
                  </label>
                  <input
                    id="admin-order-search"
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Rechercher par #DG, nom, email, téléphone, service..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="admin-order-status-filter" className="sr-only">
                    Filtrer par statut
                  </label>
                  <select
                    id="admin-order-status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-56 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Tous les statuts ({orders.length})</option>
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {ORDER_STATUS_META[st].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/70 border border-slate-800 text-center text-sm text-slate-400">
                  Aucune commande trouvée pour ces critères.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const meta =
                      ORDER_STATUS_META[order.status as OrderStatus] ??
                      ORDER_STATUS_META.pending_payment;
                    const isSaving = savingOrderCode === order.orderCode;
                    const waDigits = formatWhatsAppPhone(order.phone);
                    const waText = encodeURIComponent(
                      `Bonjour ${order.fullName}, concernant votre commande #${order.orderCode} (${order.tool}) sur DigiPaiement.tn : `
                    );

                    return (
                      <div
                        key={order.orderCode}
                        className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-500/30">
                                #{order.orderCode}
                              </span>
                              <span className="text-sm font-bold text-white">{order.tool}</span>
                              <span className="text-xs text-slate-400">
                                • {order.planDuration} • {order.paymentMethod}
                              </span>
                              <span className="text-sm font-extrabold text-emerald-400">
                                {order.priceTnd} TND
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                              <span className="font-semibold text-white">{order.fullName}</span>
                              <a
                                href={`mailto:${order.email}`}
                                className="text-blue-300 hover:underline inline-flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3" />
                                {order.email}
                              </a>
                              <a
                                href={`https://wa.me/${waDigits}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-300 hover:underline inline-flex items-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                {order.phone}
                              </a>
                              <span className="text-slate-500">
                                {new Date(order.createdAt).toLocaleString('fr-TN')}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.badgeClass}`}
                            >
                              {meta.label}
                            </span>

                            <label htmlFor={`status-${order.orderCode}`} className="sr-only">
                              Statut commande #{order.orderCode}
                            </label>
                            <select
                              id={`status-${order.orderCode}`}
                              value={order.status}
                              disabled={isSaving}
                              onChange={(e) =>
                                handleUpdateOrder(order.orderCode, {
                                  status: e.target.value as OrderStatus,
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            >
                              {ORDER_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {ORDER_STATUS_META[st].label}
                                </option>
                              ))}
                            </select>

                            {confirmDeleteOrder === order.orderCode ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => handleDeleteOrder(order.orderCode)}
                                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white"
                                >
                                  Confirmer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteOrder(null)}
                                  className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300 hover:text-white"
                                >
                                  Annuler
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteOrder(order.orderCode)}
                                aria-label={`Supprimer la commande #${order.orderCode}`}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Admin notes editor */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-900">
                          <label htmlFor={`notes-${order.orderCode}`} className="sr-only">
                            Note admin pour #{order.orderCode}
                          </label>
                          <input
                            id={`notes-${order.orderCode}`}
                            type="text"
                            value={draftNotes[order.orderCode] ?? ''}
                            onChange={(e) =>
                              setDraftNotes((prev) => ({
                                ...prev,
                                [order.orderCode]: e.target.value,
                              }))
                            }
                            placeholder="Note interne (référence D17, lien d'invitation, remarque...)"
                            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            disabled={
                              isSaving ||
                              (draftNotes[order.orderCode] ?? '') === (order.notes ?? '')
                            }
                            onClick={() =>
                              handleUpdateOrder(order.orderCode, {
                                notes: draftNotes[order.orderCode] ?? '',
                              })
                            }
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
                          >
                            Enregistrer note
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : activeTab === 'clients' ? (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor="admin-client-search" className="sr-only">
                  Rechercher un client
                </label>
                <input
                  id="admin-client-search"
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Rechercher un client par nom, email ou UID..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {filteredClients.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/70 border border-slate-800 text-center text-sm text-slate-400">
                  Aucun client enregistré pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider bg-slate-900/60">
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Commandes</th>
                        <th className="py-3 px-4">Total TND</th>
                        <th className="py-3 px-4">Inscrit le</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-900/40">
                          <td className="py-3 px-4 font-semibold text-white">
                            {client.displayName || 'Client Google'}
                          </td>
                          <td className="py-3 px-4 text-blue-300">
                            <a href={`mailto:${client.email}`} className="hover:underline">
                              {client.email}
                            </a>
                          </td>
                          <td className="py-3 px-4 text-slate-200 font-semibold">
                            {client.ordersCount}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            {client.totalSpentTnd} TND
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-xs">
                            {new Date(client.createdAt).toLocaleDateString('fr-TN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor="admin-message-search" className="sr-only">
                  Rechercher un message
                </label>
                <input
                  id="admin-message-search"
                  type="text"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  placeholder="Rechercher dans les messages (nom, sujet, contenu)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {filteredMessages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/70 border border-slate-800 text-center text-sm text-slate-400">
                  Aucun message reçu pour le moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">{msg.subject}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span className="text-slate-200 font-medium">{msg.name}</span>
                            <a href={`mailto:${msg.email}`} className="text-blue-300 hover:underline">
                              {msg.email}
                            </a>
                            {msg.phone && <span>{msg.phone}</span>}
                            <span>{new Date(msg.createdAt).toLocaleString('fr-TN')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Répondre</span>
                          </a>

                          {confirmDeleteMessage === msg.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-red-600 hover:bg-red-500 text-white"
                              >
                                Confirmer
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteMessage(null)}
                                className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300 hover:text-white"
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteMessage(msg.id)}
                              aria-label={`Supprimer le message de ${msg.name}`}
                              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
