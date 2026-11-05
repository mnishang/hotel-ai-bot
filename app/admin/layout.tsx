"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  LogOut,
  Menu,
  X,
  Hotel,
  Calendar,
  Layout
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Authentication check
  useEffect(() => {
    const user = localStorage.getItem('user');
    // For now, any logged in user can access admin for demo purposes
    // In a real app, we would check for user.role === 'admin'
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Offerings', href: '/admin/offerings', icon: Layout },
    { name: 'Active Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Sales', href: '/admin/sales', icon: DollarSign },
    { name: 'User Accounts', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-slate-900 text-white flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <Hotel className="text-blue-400" />
              <span className="font-bold text-lg whitespace-nowrap">Admin Portal</span>
            </div>
          ) : (
            <Hotel className="text-blue-400 mx-auto" />
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-4 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="ml-4">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors rounded"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:hidden">
           <div className="flex items-center gap-2">
              <Hotel className="text-blue-600" />
              <span className="font-bold text-lg">Admin Portal</span>
            </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
