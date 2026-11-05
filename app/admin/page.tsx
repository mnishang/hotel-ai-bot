"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    // Load counts from localStorage
    const storedUsers = localStorage.getItem('admin_users');
    const storedBookings = localStorage.getItem('admin_bookings');

    if (storedUsers) {
      setUserCount(JSON.parse(storedUsers).length);
    }
    
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      setBookingCount(bookings.length);
      setRecentBookings(bookings.slice(-3).reverse());
      
      const revenue = bookings.reduce((acc: number, curr: any) => {
        if (curr.status === 'Confirmed') {
          return acc + (parseInt(curr.totalAmount.replace(/[^0-9]/g, '')) || 0);
        }
        return acc;
      }, 0);
      setTotalSales(revenue);
    }
  }, []);

  const stats = [
    { label: 'Total Users', value: userCount, icon: Users, color: 'bg-blue-500', href: '/admin/users' },
    { label: 'Active Bookings', value: bookingCount, icon: Calendar, color: 'bg-purple-500', href: '/admin/bookings' },
    { label: 'Total Sales', value: `₱${totalSales.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500', href: '/admin/sales' },
    { label: 'Pending Requests', value: '3', icon: Clock, color: 'bg-amber-500', href: '/admin/bookings' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-slate-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            href={stat.href}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className={`${stat.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">System Activity</h2>
            <Link href="/admin/users" className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">View All Users</Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {i === 1 ? 'New user registered' : i === 2 ? 'Sales record updated' : i === 3 ? 'Booking confirmed' : 'System maintenance check'}
                  </p>
                  <p className="text-xs text-slate-500">{i * 15} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Booking Overview</h2>
            <Link href="/admin/bookings" className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">Manage Bookings</Link>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
               <div>
                 <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Today's Check-ins</p>
                 <p className="text-2xl font-bold text-emerald-900">5 Guests</p>
               </div>
               <Calendar className="text-emerald-500" size={32} />
            </div>
            
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Recent Reservations</h3>
               {recentBookings.length > 0 ? recentBookings.map((booking) => (
                 <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                         {booking.guestName.charAt(0)}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-800">{booking.guestName}</p>
                          <p className="text-[10px] text-slate-500">{booking.roomType}</p>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">{booking.status}</span>
                 </div>
               )) : (
                 <p className="text-center text-xs text-slate-400 py-4">No recent reservations</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
