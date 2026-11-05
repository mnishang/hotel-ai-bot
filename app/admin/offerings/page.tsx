"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  Shield,
  Wifi,
  Waves,
  Coffee,
  Utensils,
  Layout,
  Bed
} from 'lucide-react';

interface Offering {
  id: number;
  type: 'Room' | 'Service';
  title: string;
  description: string;
  price?: string;
  image?: string;
  icon?: string;
}

export default function ManageOfferings() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
  const [activeTab, setActiveTab] = useState<'Room' | 'Service'>('Room');

  // FIXED: Pointing to the exact file with spaces
  const [formData, setFormData] = useState({
    type: 'Room' as 'Room' | 'Service',
    title: '',
    description: '',
    price: '',
    image: '/img 1.jpg',
    icon: 'Shield'
  });

  const availableIcons = [
    { name: 'Shield', component: Shield },
    { name: 'Wifi', component: Wifi },
    { name: 'Sparkles', component: Sparkles },
    { name: 'Coffee', component: Coffee },
    { name: 'Utensils', component: Utensils },
    { name: 'Waves', component: Waves },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('hotel_offerings');
    if (stored) {
      setOfferings(JSON.parse(stored));
    } else {
      // FIXED: Initial setup data updated to use spaces
      const defaults: Offering[] = [
        { id: 1, type: 'Room', title: "Superior Room", description: "Spacious rooms with modern amenities for a relaxing stay.", price: "₱3,500", image: "/img 1.jpg" },
        { id: 2, type: 'Room', title: "Deluxe Room", description: "Comfortable Stay designed for a pleasant and peaceful stay.", price: "₱4,500", image: "/img 2.jpg" },
        { id: 3, type: 'Room', title: "Suite Room", description: "Spacious suites with elegant ambiance and premium comfort.", price: "₱6,000", image: "/img 3.jpg" },
        { id: 4, type: 'Room', title: "Signature Ocean Suite", description: "Panoramic oceanic views paired with bespoke mid-century modular interiors.", price: "₱8,500", image: "/img 4.jpg" },
        { id: 5, type: 'Room', title: "Whispering Waves Haven", description: "A custom beach-level sanctuary featuring a private path to raw sand shores.", price: "₱12,000", image: "/img 5.jpg" },
        { id: 6, type: 'Room', title: "Sanctuary Penthouse", description: "The absolute pinnacle of resort luxury, offering panoramic rooftop ocean vistas.", price: "₱25,000", image: "/img 6.jpg" },
        { id: 7, type: 'Service', title: "Hotel Security", description: "24/7 Professional monitoring", icon: "Shield" },
        { id: 8, type: 'Service', title: "Speed Internet", description: "High-speed fiber connectivity", icon: "Wifi" },
        { id: 9, type: 'Service', title: "Swimming Pool", description: "Pristine infinity pool access", icon: "Waves" },
        { id: 10, type: 'Service', title: "Smart Lock", description: "Secure keyless entry system", icon: "Sparkles" },
        { id: 11, type: 'Service', title: "Gym Center", description: "Full-service fitness facility", icon: "Coffee" },
        { id: 12, type: 'Service', title: "Breakfast", description: "Gourmet multi-cuisine breakfast", icon: "Utensils" },
      ];
      setOfferings(defaults);
      localStorage.setItem('hotel_offerings', JSON.stringify(defaults));
    }
  }, []);

  const saveToStorage = (updated: Offering[]) => {
    setOfferings(updated);
    localStorage.setItem('hotel_offerings', JSON.stringify(updated));
  };

  const handleOpenModal = (offering: Offering | null = null) => {
    if (offering) {
      setEditingOffering(offering);
      setFormData({
        type: offering.type,
        title: offering.title,
        description: offering.description,
        price: offering.price || '',
        image: offering.image || '/img 1.jpg', // FIXED
        icon: offering.icon || 'Shield'
      });
    } else {
      setEditingOffering(null);
      setFormData({
        type: activeTab,
        title: '',
        description: '',
        price: '',
        image: activeTab === 'Room' ? '/img 1.jpg' : '', // FIXED
        icon: activeTab === 'Service' ? 'Shield' : ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffering(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOffering) {
      const updated = offerings.map(o => o.id === editingOffering.id ? { ...o, ...formData } : o);
      saveToStorage(updated);
    } else {
      const newItem: Offering = { id: Date.now(), ...formData };
      saveToStorage([...offerings, newItem]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Remove this offering? This will affect the public website.')) {
      const updated = offerings.filter(o => o.id !== id);
      saveToStorage(updated);
    }
  };

  const filtered = offerings.filter(o => o.type === activeTab);

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all offerings to defaults? This will overwrite your current changes.')) {
      // FIXED: Reset function targets correct physical file formats
      const defaults: Offering[] = [
        { id: 1, type: 'Room', title: "Superior Room", description: "Spacious rooms with modern amenities for a relaxing stay.", price: "₱3,500", image: "/img 1.jpg" },  
        { id: 2, type: 'Room', title: "Deluxe Room", description: "Comfortable Stay designed for a pleasant and peaceful stay.", price: "₱4,500", image: "/img 2.jpg" },
        { id: 3, type: 'Room', title: "Suite Room", description: "Spacious suites with elegant ambiance and premium comfort.", price: "₱6,000", image: "/img 3.jpg" },
        { id: 4, type: 'Room', title: "Signature Ocean Suite", description: "Panoramic oceanic views paired with bespoke mid-century modular interiors.", price: "₱8,500", image: "/img 4.jpg" },
        { id: 5, type: 'Room', title: "Whispering Waves Haven", description: "A custom beach-level sanctuary featuring a private path to raw sand shores.", price: "₱12,000", image: "/img 5.jpg" },
        { id: 6, type: 'Room', title: "Sanctuary Penthouse", description: "The absolute pinnacle of resort luxury, offering panoramic rooftop ocean vistas.", price: "₱25,000", image: "/img 6.jpg" },
        { id: 7, type: 'Service', title: "Hotel Security", description: "24/7 Professional monitoring", icon: "Shield" },
        { id: 8, type: 'Service', title: "Speed Internet", description: "High-speed fiber connectivity", icon: "Wifi" },
        { id: 9, type: 'Service', title: "Swimming Pool", description: "Pristine infinity pool access", icon: "Waves" },
        { id: 10, type: 'Service', title: "Smart Lock", description: "Secure keyless entry system", icon: "Sparkles" },
        { id: 11, type: 'Service', title: "Gym Center", description: "Full-service fitness facility", icon: "Coffee" },
        { id: 12, type: 'Service', title: "Breakfast", description: "Gourmet multi-cuisine breakfast", icon: "Utensils" },
      ];
      saveToStorage(defaults);
    }
  };

  const getIconComponent = (iconName: string) => {
    const found = availableIcons.find(i => i.name === iconName);
    if (found) {
      const IconComp = found.component;
      return <IconComp size={32} />;
    }
    return <Sparkles size={32} />;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Website Content Management</h1>
          <p className="text-slate-500 text-sm">Synchronize rooms and services with the homepage</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={resetToDefaults}
            className="px-4 py-2 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Reset to Defaults
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Add {activeTab}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('Room')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-widest uppercase transition-all border-b-2 ${activeTab === 'Room' ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Bed size={18} />
          Rooms
        </button>
        <button 
          onClick={() => setActiveTab('Service')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-widest uppercase transition-all border-b-2 ${activeTab === 'Service' ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <Sparkles size={18} />
          Services
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {item.type === 'Room' ? (
              <div className="h-48 bg-slate-100 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {item.price}
                </div>
              </div>
            ) : (
              <div className="h-48 bg-slate-50 flex items-center justify-center border-b border-slate-100">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                   {getIconComponent(item.icon || 'Shield')}
                </div>
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
              
              <div className="mt-auto flex gap-2 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => handleOpenModal(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  <Edit size={14} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <div className="w-16 h-16 bg-white text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Layout size={32} />
             </div>
             <p className="text-slate-400 font-medium">No {activeTab}s found.</p>
             <button onClick={() => handleOpenModal()} className="mt-4 text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">Add One Now</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingOffering ? `Edit ${activeTab}` : `Add New ${activeTab}`}
                </h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Update public website content</p>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={`e.g. ${activeTab === 'Room' ? 'Deluxe Room' : 'Spa Treatment'}`}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              {activeTab === 'Room' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Price Per Night</label>
                    <input
                      type="text"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="₱4,500"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cover Image</label>
                    {/* FIXED: Mapped drop-down selections to exact files with spaces */}
                    <select
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                    >
                      <option value="/img 1.jpg">Superior Room View</option>
                      <option value="/img 2.jpg">Deluxe Room View</option>
                      <option value="/img 3.jpg">Suite Room View</option>
                      <option value="/img 4.jpg">Signature Ocean Suite View</option>
                      <option value="/img 5.jpg">Whispering Waves Haven View</option>
                      <option value="/img 6.jpg">Sanctuary Penthouse View</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Display Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: icon.name }))}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                          formData.icon === icon.name 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                        }`}
                      >
                        <icon.component size={18} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Room' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Image Preview</label>
                  <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover brightness-90" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Detailed Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide an elegant description for guests..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  {editingOffering ? 'Update Website' : `Publish ${activeTab}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}