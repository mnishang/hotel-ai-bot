"use client";

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react';

interface Booking {
  id: string;
  guestName: string;
  email: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  totalAmount: string;
}

export default function ActiveBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedBookings = localStorage.getItem('admin_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      const defaultBookings: any[] = [
        { id: 'WOS-4829', guestName: 'John Doe', email: 'john@example.com', roomType: 'Deluxe Room', checkIn: '2026-06-01', checkOut: '2026-06-05', status: 'Confirmed', totalAmount: '₱18,000', downpayment: '2000', timestamp: new Date().toISOString() },
        { id: 'WOS-7712', guestName: 'Sarah Jenkins', email: 'sarah@web.com', roomType: 'Suite Room', checkIn: '2026-06-10', checkOut: '2026-06-12', status: 'Pending', totalAmount: '₱12,000', downpayment: '1500', timestamp: new Date().toISOString() },
        { id: 'WOS-9930', guestName: 'Michael Chen', email: 'mchen@test.com', roomType: 'Presidential Suite', checkIn: '2026-06-15', checkOut: '2026-06-20', status: 'Confirmed', totalAmount: '₱75,000', downpayment: '10000', timestamp: new Date().toISOString() },
      ];
      setBookings(defaultBookings);
      localStorage.setItem('admin_bookings', JSON.stringify(defaultBookings));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this booking?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem('admin_bookings', JSON.stringify(updated));
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Active Bookings</h1>
          <p className="text-slate-500 text-sm">Manage guest reservations and check-in status</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 flex items-center gap-2">
             <Calendar size={16} />
             {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by guest name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Room Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{booking.guestName}</p>
                    <p className="text-xs text-slate-500">{booking.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {booking.roomType}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-700 font-medium">{booking.checkIn}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">to {booking.checkOut}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-fit ${
                      booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {booking.status === 'Confirmed' ? <CheckCircle2 size={12} /> : 
                       booking.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    No bookings found.
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
