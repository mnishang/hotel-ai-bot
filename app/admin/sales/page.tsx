"use client";

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar
} from 'lucide-react';

interface SaleTransaction {
  id: string;
  customer: string;
  item: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Refunded';
}

export default function SalesManagement() {
  const [sales, setSales] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedBookings = localStorage.getItem('admin_bookings');
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      // Map bookings to sale transaction format
      const bookingSales = bookings.map((b: any) => ({
        id: b.id.replace('WOS-', 'TXN-'),
        customer: b.guestName,
        item: b.roomType,
        amount: b.totalAmount,
        downpayment: b.downpayment || '0',
        date: b.timestamp ? b.timestamp.split('T')[0] : '2026-05-29',
        status: b.status === 'Confirmed' ? 'Completed' : 'Pending'
      }));
      setSales(bookingSales);
    }
  }, []);

  const filteredSales = sales.filter(s => 
    s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = sales.reduce((acc, curr) => {
    const val = parseInt(String(curr.amount).replace(/[^0-9]/g, '')) || 0;
    return acc + val;
  }, 0);

  const todaysSales = sales.reduce((acc, curr) => {
    const today = new Date().toISOString().split('T')[0];
    if (curr.date === today) {
      const val = parseInt(String(curr.downpayment).replace(/[^0-9]/g, '')) || 0;
      return acc + val;
    }
    return acc;
  }, 0);

  const pendingPayments = sales.reduce((acc, curr) => {
    const total = parseInt(String(curr.amount).replace(/[^0-9]/g, '')) || 0;
    const paid = parseInt(String(curr.downpayment).replace(/[^0-9]/g, '')) || 0;
    return acc + (total - paid);
  }, 0);

  const formatCurrency = (val: any) => {
    const num = parseInt(String(val).replace(/[^0-9]/g, '')) || 0;
    return `₱${num.toLocaleString()}`;
  };

  const calculateBalance = (total: any, paid: any) => {
    const t = parseInt(String(total).replace(/[^0-9]/g, '')) || 0;
    const p = parseInt(String(paid).replace(/[^0-9]/g, '')) || 0;
    return `₱${(t - p).toLocaleString()}`;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales & Revenue</h1>
          <p className="text-slate-500 text-sm">Monitor real-time guest bookings and earnings</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-emerald-500/20">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <TrendingUp size={24} />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expected Revenue</p>
              <p className="text-2xl font-bold text-slate-800">₱{totalRevenue.toLocaleString()}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <DollarSign size={24} />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Received</p>
              <p className="text-2xl font-bold text-slate-800">₱{todaysSales.toLocaleString()}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
              <Clock size={24} />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Remaining Balance</p>
              <p className="text-2xl font-bold text-slate-800">₱{pendingPayments.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Paid</th>
                <th className="px-6 py-4 text-right">Balance</th>
                <th className="px-6 py-4 text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    #{txn.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">{txn.customer}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {txn.item}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">
                    {formatCurrency(txn.downpayment)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-600 text-right">
                    {calculateBalance(txn.amount, txn.downpayment)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium text-center">
                    {txn.date}
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
