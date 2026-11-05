"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import {
  Sparkles,
  Utensils,
  Waves,
  ArrowRight,
  Coffee,
  Wifi,
  Shield,
  Bed,
  Layers,
  Phone,
  Mail,
  Store,
  MessageSquare
} from 'lucide-react';
import HomeView from './components/HomeView';
import AIAssistant from './components/ai-assistant/AIAssistant';

export default function HotelReservationPage() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<
    'home' | 'about' | 'rooms' | 'contact' | 'booking'
  >('home');

  // Authentication check
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // FIXED ERROR
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: 'Philippines',
    idType: 'Passport',
    checkIn: '',
    checkOut: '',
    guests: '1 Guest',
    roomType: 'Deluxe Room',
    paymentMethod: '',
    paymentName: '',
    paymentNumber: '',
    downpayment: '',
    receiptId: '',
    receiptDate: '',
    totalPrice: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'auth' | 'encrypt' | 'deliver' | 'sent'>('idle');
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
    setContactError('');
    setContactSuccess(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess(false);

    const { name, email, subject, message } = contactData;
    if (!name || !email || !subject || !message) {
      setContactError('Please fill in all fields before sending your message.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setContactError('Please enter a valid email address.');
      return;
    }

    // Success simulation
    setContactSuccess(true);
    setContactData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    setBookingError('');
  };

  const handleSendEmail = () => {
    setIsSendingEmail(true);
    setEmailStatus('auth');
    
    // Constructing the professional email body
    const subject = encodeURIComponent(`CONFIRMED: Reservation Receipt #${bookingData.receiptId} - Whisper of the Sea`);
    const body = encodeURIComponent(
`WHISPER OF THE SEA RESORT
Official Reservation Receipt
===========================================
Receipt ID: ${bookingData.receiptId}
Issued on: ${bookingData.receiptDate}
===========================================

Dear ${bookingData.firstName} ${bookingData.lastName},

Your sanctuary has been successfully reserved. Below is your high-fidelity booking summary:

GUEST PROFILE:
--------------
- Full Name: ${bookingData.firstName} ${bookingData.lastName}
- Contact Number: ${bookingData.phone}
- Email Address: ${bookingData.email}
- Address: ${bookingData.address}, ${bookingData.country}

ACCOMMODATION DETAILS:
----------------------
- Reserved Suite: ${bookingData.roomType}
- Guest Count: ${bookingData.guests}
- Check-In: ${bookingData.checkIn}
- Check-Out: ${bookingData.checkOut}

PAYMENT SUMMARY:
----------------
- Method: ${bookingData.paymentMethod}
- Account Holder: ${bookingData.paymentName}
- Account Reference: ${bookingData.paymentNumber}

STATUS: RESERVATION CONFIRMED & PENDING ARRIVAL

-------------------------------------------
IMPORTANT: Please present this digital or printed receipt to the concierge upon check-in.

We look forward to welcoming you to the whispering soul of the Pacific coast.

Stay Elegantly,
The Sanctuary Team
Whisper of the Sea Resort & Spa`
    );

    // Multi-stage high-fidelity transmission simulation
    setTimeout(() => setEmailStatus('encrypt'), 600);
    setTimeout(() => setEmailStatus('deliver'), 1200);
    
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSent(true);
      setEmailStatus('sent');
      
      // Target Gmail web interface specifically for a better "Transmitted to Gmail" experience
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${bookingData.email}&su=${subject}&body=${body}`;
      
      // Open Gmail in a new tab
      window.open(gmailUrl, '_blank');
      
    }, 2000);
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, address } = bookingData;
    if (!firstName || !lastName || !email || !phone || !address) {
      setBookingError('Please fill in all guest information details.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { checkIn, checkOut } = bookingData;
    if (!checkIn || !checkOut) {
      setBookingError('Please select both check-in and check-out dates.');
      return false;
    }
    return true;
  };

  const handleConfirmBooking = () => {
    if (!bookingData.paymentMethod) {
      setBookingError('Please select a payment method.');
      return;
    }

    if (!bookingData.paymentName || !bookingData.paymentNumber) {
      setBookingError(`Please provide your ${bookingData.paymentMethod} account name and number.`);
      return;
    }

    if (!bookingData.downpayment || parseFloat(bookingData.downpayment) <= 0) {
      setBookingError('A mandatory downpayment amount is required to secure your booking.');
      return;
    }

    setShowTerms(true);
  };

  const handleAcceptTerms = () => {
    // Generate Receipt ID and Date
    const rId = "WOS-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const rDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Attempt to get actual price from offerings
    let finalPrice = '₱ --';
    try {
      const roomOfferings = JSON.parse(localStorage.getItem('hotel_offerings') || '[]');
      const selectedRoom = roomOfferings.find((r: any) => r.title === bookingData.roomType);
      if (selectedRoom && selectedRoom.price) {
        finalPrice = selectedRoom.price;
      }
    } catch (e) {
      console.error('Failed to fetch price for receipt', e);
    }

    setBookingData(prev => ({ 
      ...prev, 
      receiptId: rId,
      receiptDate: rDate,
      totalPrice: finalPrice
    }));

    // Functional booking confirmation
    setBookingSuccess(true);
    setShowTerms(false);

    // Save to admin_bookings for admin visibility
    try {
      const currentBookings = JSON.parse(localStorage.getItem('admin_bookings') || '[]');
      
      const newBookingEntry = {
        id: rId,
        guestName: `${bookingData.firstName} ${bookingData.lastName}`,
        email: bookingData.email,
        roomType: bookingData.roomType,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        status: 'Confirmed',
        totalAmount: finalPrice,
        downpayment: bookingData.downpayment,
        paymentMethod: bookingData.paymentMethod,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('admin_bookings', JSON.stringify([...currentBookings, newBookingEntry]));
    } catch (e) {
      console.error('Failed to save booking to admin store', e);
    }

    // In a real app, you'd send this to an API
    console.log('Booking Confirmed:', { ...bookingData, receiptId: rId, receiptDate: rDate, totalPrice: finalPrice });
  };

  const resetBooking = () => {
    setBookingStep(1);
    setBookingData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      country: 'Philippines',
      idType: 'Passport',
      checkIn: '',
      checkOut: '',
      guests: '1 Guest',
      roomType: 'Deluxe Room',
      paymentMethod: '',
      paymentName: '',
      paymentNumber: '',
      downpayment: '',
      receiptId: '',
      receiptDate: '',
      totalPrice: ''
    });
    setBookingError('');
    setBookingSuccess(false);
    setShowTerms(false);
    setTermsAccepted(false);
    setActivePage('rooms');
  };

  const handleRoomSelection = (roomTitle: string) => {
    setBookingData(prev => ({ ...prev, roomType: roomTitle }));
    setBookingStep(1);
    setBookingError('');
    setBookingSuccess(false);
    setActivePage('booking');
  };

  const [dynamicOfferings, setDynamicOfferings] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('hotel_offerings');
    if (stored) {
      setDynamicOfferings(JSON.parse(stored));
    }
  }, [activePage]);

  const rooms = dynamicOfferings.filter(o => o.type === 'Room');
  const displayRooms = rooms.length > 0 ? rooms : [
    { title: "Superior Room", description: "Spacious rooms with modern amenities for a relaxing stay.", image: "img 1.jpg" },
    { title: "Deluxe Room", description: "Comfortable Stay designed for a pleasant and peaceful stay.", image: "img 2.jpg" },
    { title: "Suite Room", description: "Spacious suites with elegant ambiance and premium comfort.", image: "img 3.jpg" },
    { title: "Signature Ocean Suite", description: "Panoramic oceanic views paired with bespoke mid-century modular interiors.", image: "img 4.jpg" },
    { title: "Whispering Waves Haven", description: "A custom beach-level sanctuary featuring a private path to raw sand shores.", image: "img 5.jpg" },
    { title: "Sanctuary Penthouse", description: "The absolute pinnacle of resort luxury, offering panoramic rooftop ocean vistas.", image: "img 6.jpg" }
  ].map(r => ({ ...r, description: r.description })); // Aligning structure

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white font-sans selection:bg-[#addfac] selection:text-black scroll-smooth">

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-[#242424] border border-stone-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-8 h-8 rotate-12" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-serif italic text-white">Leaving So Soon?</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Are you sure you want to log out of your sanctuary session? Any unsaved booking progress may be lost.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={confirmLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Stay In Sanctuary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50">

        <div
          className="h-16 sm:h-20 md:h-24 w-auto flex items-center cursor-pointer"
          onClick={() => setActivePage('home')}
        >
          <img
            src="/logo_hotel-removebg-preview.png"
            alt="Whisper of the Sea Logo"
            className="h-full w-auto object-contain"
          />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wider">

          <button
            onClick={() => setActivePage('home')}
            className={`uppercase text-xs transition ${
              activePage === 'home'
                ? 'text-[#addfac]'
                : 'text-stone-400 hover:text-[#addfac]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActivePage('about')}
            className={`uppercase text-xs transition ${
              activePage === 'about'
                ? 'text-[#addfac]'
                : 'text-stone-400 hover:text-[#addfac]'
            }`}
          >
            About
          </button>

          <button
            onClick={() => setActivePage('rooms')}
            className={`uppercase text-xs transition ${
              activePage === 'rooms'
                ? 'text-[#addfac]'
                : 'text-stone-400 hover:text-[#addfac]'
            }`}
          >
            Rooms
          </button>

          <button
            onClick={() => setActivePage('booking')}
            className={`uppercase text-xs transition ${
              activePage === 'booking'
                ? 'text-[#addfac]'
                : 'text-stone-400 hover:text-[#addfac]'
            }`}
          >
            Booking
          </button>

          <button
            onClick={() => setActivePage('contact')}
            className={`uppercase text-xs transition ${
              activePage === 'contact'
                ? 'text-[#addfac]'
                : 'text-stone-400 hover:text-[#addfac]'
            }`}
          >
            Contact
          </button>

        </nav>

        <button 
          onClick={handleLogout}
          className="bg-gradient-to-r from-teal-600 to-[#addfac] text-black text-xs px-5 py-2.5 rounded font-semibold">
          Log Out
        </button>

      </header>

      {/* --- PAGE CONDITIONAL RENDERING --- */}
      {activePage === 'home' && (
        <HomeView setActivePage={setActivePage} />
      )}
      
      {/* --- STANDALONE ABOUT US VIEW --- */}
      {activePage === 'about' && (
        <div className="animate-fadeIn">
          {/* ABOUT BANNER SUB-HERO */}
          <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden flex items-center justify-center">
            <img 
              src="pic 1.jpg" 
              alt="About page banner" 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.3] saturate-[0.8]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C1C1C]/50 to-[#1C1C1C]"></div>
            <div className="relative text-center space-y-3 z-10">
              <h1 className="text-4xl md:text-6xl font-serif italic text-stone-100 tracking-wide">About Us</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-[#addfac]">
                <span className="cursor-pointer" onClick={() => setActivePage('home')}>Home</span> 
                <span className="text-stone-600 mx-2">•</span> About Our Sanctuary
              </p>
            </div>
          </section>

          {/* BRAND PROFILE SECTION */}
          <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative h-[380px] md:h-[480px] w-full">
              <div className="absolute top-0 left-0 w-[85%] h-[85%] rounded-lg overflow-hidden border border-stone-800 shadow-2xl">
                <img src="pic 2.jpg" alt="Luxury suite details" className="w-full h-full object-cover brightness-90" />
              </div>
              <div className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-lg overflow-hidden border-4 border-[#1C1C1C] shadow-2xl z-10">
                <img src="pic 3.jpg" alt="Resort layout look" className="w-full h-full object-cover brightness-90" />
              </div>
              <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[#addfac]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#addfac]">About Luxury Hotel</span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-stone-100 leading-tight">
                Discover The Best Luxury <br />
                <span className="not-italic font-sans font-light text-[#addfac]">Hotels In Philippines</span>
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                Whisper of the Sea Hotel & Resort introduces a brand-new definition of eco-elegance. Nestled seamlessly along the raw Pacific coastline, we combine state-of-the-art modular comfort architecture with high-fidelity hospitality.
              </p>
              
              {showFullAbout && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <h4 className="text-[#addfac] text-xs font-bold uppercase tracking-widest">Our Heritage</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Founded in 2012 by a collective of avant-garde architects and environmentalists, Whisper of the Sea was born from a vision to create a sanctuary that breathes with the ocean. What began as a single modular prototype has evolved into Philippines's premier coastal escape.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-[#addfac] text-xs font-bold uppercase tracking-widest">Modular Innovation</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Our "Lego-Luxury" approach allows us to place high-end suites on rugged cliff-sides with minimal site disruption. Each unit is pre-crafted with sustainable mahogany and floor-to-ceiling smart glass, then seamlessly integrated into the natural contours of the Pacific shelf.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[#addfac] text-xs font-bold uppercase tracking-widest">Sustainable Sanctuary</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      We operate on a 100% renewable grid. From our solar-kinetic energy harvesting to our circular water filtration systems, your stay contributes to the preservation of the very coastline you come to admire. Silence, luxury, and responsibility coexist here.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-5 border-l-2 border-[#addfac] bg-stone-900/30 text-stone-300 italic text-sm rounded-r-md">
                "Our philosophy is simple: complete harmony with nature without altering the definition of pristine luxury."
              </div>
              
              <button 
                onClick={() => setShowFullAbout(!showFullAbout)}
                className="bg-[#addfac] text-black font-semibold text-xs px-8 py-3 rounded-full uppercase tracking-wider hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#addfac]/10"
              >
                {showFullAbout ? 'Show Less' : 'Read More'}
              </button>
            </div>
          </section>

          {/* COMFORT SERVICES MATRIX */}
          <section className="bg-stone-900/20 py-20 border-t border-b border-stone-900">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16">
              <span className="text-xs uppercase tracking-widest text-[#addfac]">Our Hotel Services</span>
              <h3 className="text-2xl md:text-3xl font-serif text-stone-200">Our Comfortable Services</h3>
              <div className="w-16 h-[1px] bg-[#addfac] mx-auto mt-2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
              {(dynamicOfferings.filter(o => o.type === 'Service').length > 0 
                ? dynamicOfferings.filter(o => o.type === 'Service')
                : [
                    { title: "Hotel Security", icon: "Shield" },
                    { title: "Speed Internet", icon: "Wifi" },
                    { title: "Smart Lock", icon: "Sparkles" },
                    { title: "Gym Center", icon: "Coffee" },
                    { title: "Breakfast", icon: "Utensils" },
                    { title: "Swimming Pool", icon: "Waves" }
                  ]
              ).map((service, index) => (
                <div key={index} className="p-6 rounded-lg bg-[#242424]/40 border border-stone-800/60 hover:border-[#addfac]/40 transition-colors group">
                  <div className="mb-3 transform group-hover:scale-110 transition-transform flex justify-center text-[#addfac]">
                     {service.icon === 'Shield' && <Shield className="w-6 h-6" />}
                     {service.icon === 'Wifi' && <Wifi className="w-6 h-6" />}
                     {service.icon === 'Sparkles' && <Sparkles className="w-6 h-6" />}
                     {service.icon === 'Coffee' && <Coffee className="w-6 h-6" />}
                     {service.icon === 'Utensils' && <Utensils className="w-6 h-6" />}
                     {service.icon === 'Waves' && <Waves className="w-6 h-6" />}
                  </div>
                  <span className="text-xs uppercase font-medium tracking-wider text-stone-300 block">{service.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* EXPERIENCED TEAM SECTION */}
          <section className="max-w-7xl mx-auto px-6 py-20 text-center">
            <div className="space-y-3 mb-16">
              <span className="text-xs uppercase tracking-widest text-[#addfac]">Team Member</span>
              <h3 className="text-2xl md:text-3xl font-serif text-stone-200">Meet Our Experienced Team</h3>
              <div className="w-16 h-[1px] bg-[#addfac] mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 justify-center">
              {[
                { name: "Khate Charmeille", role: "General Manager", img: "members/khate.jpg" },
                { name: "Shane Garey Gales", role: "Head Concierge", img: "members/shane.jpg" },
                { name: "Lhorelyn Dalaguit", role: "Executive Chef", img: "members/lhor.jpg" },
                { name: "Roche Mae Salvaloza", role: "Guest Relations", img: "members/ochee.jpg" },
                { name: "Katrine Matedios", role: "Spa & Wellness Director", img: "members/kat.jpg" },
                { name: "Honeylyn Regulacion", role: "Operations Lead", img: "members/yorskie.jpg" },
                { name: "James Patrick Inoc", role: "Sommelier", img: "members/pat.jpg" }
              ].map((member, index) => (
                <div key={index} className="space-y-4 group">
                  <div className="w-full aspect-[3/4] rounded-t-full overflow-hidden border border-stone-800 shadow-xl relative bg-stone-900">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover filter brightness-90 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 object-top"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-stone-200 text-lg">{member.name}</h4>
                    <p className="text-xs text-[#addfac]/80 tracking-widest uppercase mt-0.5">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* --- STANDALONE ROOMS VIEW --- */}
      {activePage === 'rooms' && (
        <div className="animate-fadeIn pb-24">
          {/* ROOMS BANNER SUB-HERO */}
          <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden flex items-center justify-center">
            <img 
              src="pic 1.jpg" 
              alt="Rooms page banner" 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.25] saturate-[0.8]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C1C1C]/50 to-[#1C1C1C]"></div>
            <div className="relative text-center space-y-3 z-10">
              <h1 className="text-4xl md:text-6xl font-serif italic text-stone-100 tracking-wide">Our Rooms</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-[#addfac]">
                <span className="cursor-pointer" onClick={() => setActivePage('home')}>Home</span> 
                <span className="text-stone-600 mx-2">•</span> Exquisite Sanctums
              </p>
            </div>
          </section>

          {/* ROOM OPTIONS ICONIC ROW */}
          <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 border-b border-stone-800/80 pb-8">
              {[
                { icon: <Bed className="w-4 h-4 text-[#addfac]" />, label: "Comfortable Stay" },
                { icon: <Utensils className="w-4 h-4 text-[#addfac]" />, label: "Multi-Cuisine Restaurant" },
                { icon: <Sparkles className="w-4 h-4 text-[#addfac]" />, label: "Holistic Wellness" },
                { icon: <Layers className="w-4 h-4 text-[#addfac]" />, label: "Perfect Celebrations" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-stone-900/40 border border-stone-800 text-stone-300 text-xs tracking-wider uppercase font-medium">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ROOM GRID VIEW */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {displayRooms.map((room, idx) => (
                <div key={idx} className="space-y-5 group">
                  <div className="relative rounded-2xl overflow-hidden border border-stone-900 shadow-2xl aspect-[1.22/1]">
                    <img 
                      src={room.image} 
                      alt={room.title} 
                      className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="text-center space-y-2 px-2">
                    <h3 className="text-xl font-serif text-[#addfac] tracking-wide group-hover:text-white transition-colors">
                      {room.title}
                    </h3>
                    <p className="text-sm text-stone-400 font-light max-w-sm mx-auto leading-relaxed">
                      {room.description}
                    </p>
                    {room.price && (
                      <p className="text-[#addfac] font-bold text-sm tracking-widest">{room.price} / Night</p>
                    )}
                    <div className="pt-2">
                      <button 
                        onClick={() => handleRoomSelection(room.title)}
                        className="text-xs uppercase tracking-widest font-semibold border-b border-[#addfac]/40 hover:border-[#addfac] text-stone-200 hover:text-white transition-all pb-1"
                      >
                        Reserve Sanctuary
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* INTEGRATED MULTI-CUISINE FEATURE SPLIT BAR */}
          <section className="max-w-6xl mx-auto px-6 mt-16 pt-16 border-t border-stone-900 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4">
              <span className="text-xs tracking-widest uppercase text-[#addfac] font-semibold block">Gourmet Dining</span>
              <h3 className="text-2xl font-serif text-stone-100 tracking-wide">Multi-Cuisine Restaurant</h3>
              <p className="text-sm text-stone-400 leading-relaxed font-light">
                Indulge in a delightful journey of flavors crafted for every palate. Our master chefs combine fresh organic coastal ingredients with culinary art.
              </p>
            </div>
            <div className="md:col-span-7 h-48 md:h-64 rounded-xl overflow-hidden border border-stone-900 shadow-xl">
              <img 
                src="pic 1.jpg" 
                alt="Whisper of the Sea dining area" 
                className="w-full h-full object-cover brightness-75"
              />
            </div>
          </section>
        </div>
      )}

{/* --- MULTI STEP BOOKING PAGE --- */}
{activePage === 'booking' && (
  <div className="animate-fadeIn min-h-screen bg-[#1C1C1C] text-white">

    {/* HERO */}
    <section className="relative h-[320px] overflow-hidden flex items-center justify-center">
      <img
        src="pic 1.jpg"
        alt="Booking"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.25]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-[#1C1C1C]"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-serif italic text-white">
          Luxury Reservation
        </h1>

        <p className="mt-4 text-sm tracking-[0.3em] uppercase text-[#addfac]">
          Complete Your Booking Experience
        </p>
      </div>
    </section>

    {/* FORM */}
    <section className="max-w-5xl mx-auto px-6 py-16">

      <div className="bg-[#242424]/50 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* TOP STEP BAR */}
        <div className="border-b border-stone-800 p-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* STEP 1 */}
            <div className="flex items-center gap-4">

              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                bookingStep >= 1
                  ? "bg-[#addfac] text-black"
                  : "bg-stone-800 text-white"
              }`}>
                1
              </div>

              <div>
                <h3 className="text-white font-semibold">Client Information</h3>
                <p className="text-xs text-stone-400">
                  Personal Details
                </p>
              </div>

            </div>

            <div className="hidden md:block w-20 h-[1px] bg-stone-700"></div>

            {/* STEP 2 */}
            <div className="flex items-center gap-4">

              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                bookingStep >= 2
                  ? "bg-[#addfac] text-black"
                  : "bg-stone-800 text-white"
              }`}>
                2
              </div>

              <div>
                <h3 className="text-white font-semibold">Room Reservation</h3>
                <p className="text-xs text-stone-400">
                  Booking Schedule
                </p>
              </div>

            </div>

            <div className="hidden md:block w-20 h-[1px] bg-stone-700"></div>

            {/* STEP 3 */}
            <div className="flex items-center gap-4">

              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                bookingStep >= 3
                  ? "bg-[#addfac] text-black"
                  : "bg-stone-800 text-white"
              }`}>
                3
              </div>

              <div>
                <h3 className="text-white font-semibold">Billing Payment</h3>
                <p className="text-xs text-stone-400">
                  Secure Checkout
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-8 md:p-12 space-y-10">

          {bookingSuccess ? (
            <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
              <div className="bg-stone-900 border border-[#addfac]/30 rounded-3xl overflow-hidden shadow-2xl relative">
                
                {/* Receipt Header */}
                <div className="bg-gradient-to-r from-teal-900/40 to-[#addfac]/10 p-8 text-center border-b border-stone-800">
                  <div className="w-16 h-16 bg-[#addfac]/20 text-[#addfac] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-serif italic text-white tracking-wide">Reservation Receipt</h2>
                  <p className="text-[#addfac] text-[10px] uppercase tracking-[0.2em] mt-1 font-semibold">Whisper of the Sea Resort</p>
                  
                  <div className="mt-4 flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-stone-500">Receipt ID: {bookingData.receiptId}</span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500">Confirmed on: {bookingData.receiptDate}</span>
                  </div>
                </div>

                {/* Receipt Body */}
                <div className="p-8 space-y-8">
                  
                  {/* Guest Info */}
                  <div className="grid grid-cols-2 gap-8 border-b border-stone-800/50 pb-8">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Guest Name</span>
                      <p className="text-sm text-stone-200 font-medium">{bookingData.firstName} {bookingData.lastName}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Contact</span>
                      <p className="text-sm text-stone-200 font-medium">{bookingData.phone}</p>
                      <p className="text-[11px] text-stone-400">{bookingData.email}</p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-6 border-b border-stone-800/50 pb-8">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Accommodation</span>
                        <p className="text-base text-[#addfac] font-serif italic">{bookingData.roomType}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Guests</span>
                        <p className="text-sm text-stone-200 font-medium">{bookingData.guests}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Check-In</span>
                        <p className="text-sm text-stone-200 font-medium">{bookingData.checkIn}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] uppercase tracking-widest text-stone-500 block">Check-Out</span>
                        <p className="text-sm text-stone-200 font-medium">{bookingData.checkOut}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-[#1C1C1C]/50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-400 uppercase tracking-widest">Accommodation Total</span>
                      <span className="text-stone-200 font-semibold">{bookingData.totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-400 uppercase tracking-widest">Downpayment Paid</span>
                      <span className="text-emerald-500 font-semibold">
                        - ₱ {parseFloat(bookingData.downpayment).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-stone-800">
                      <span className="text-stone-400 uppercase tracking-widest font-bold">Remaining Balance</span>
                      <span className="text-[#addfac] font-bold text-sm">
                        ₱ {(
                          parseFloat(bookingData.totalPrice.replace(/[^0-9.-]+/g, "")) - 
                          parseFloat(bookingData.downpayment)
                        ).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <div className="flex justify-between items-center text-[10px] pt-3 border-t border-stone-800">
                        <span className="text-stone-500 uppercase tracking-widest">Payment Method</span>
                        <span className="text-stone-300 font-semibold uppercase">{bookingData.paymentMethod}</span>
                      </div>
                      {bookingData.paymentMethod !== 'Cash' && (
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-stone-500 uppercase tracking-widest">Account Name</span>
                          <span className="text-stone-300">{bookingData.paymentName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-stone-800 text-[#addfac]">
                      <span className="text-xs uppercase tracking-[0.3em] font-bold">Total Status</span>
                      <span className="text-sm font-bold uppercase tracking-widest">Confirmed & Pending</span>
                    </div>
                  </div>

                  {/* DELIVERY OPTION BAR */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Delivery Channel</span>
                    <button 
                      onClick={handleSendEmail}
                      disabled={isSendingEmail}
                      className={`w-full flex items-center justify-between bg-[#1C1C1C] border ${emailSent ? 'border-emerald-500/50' : 'border-stone-800 hover:border-[#addfac]/50'} rounded-2xl p-4 group transition-all active:scale-[0.99]`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${emailSent ? 'bg-emerald-500/20 text-emerald-500' : 'bg-stone-900 text-stone-400 group-hover:text-[#addfac]'}`}>
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-bold tracking-wide uppercase ${emailSent ? 'text-emerald-400' : 'text-stone-200'}`}>
                            {emailSent ? 'Transmitted to Gmail' : 'Send to Gmail Inbox'}
                          </p>
                          <p className="text-[10px] text-stone-500 font-medium">{bookingData.email}</p>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${emailSent ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#addfac] text-black hover:brightness-110'}`}>
                        {isSendingEmail ? (
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            {emailStatus === 'auth' ? 'AUTHENTICATING' : 
                             emailStatus === 'encrypt' ? 'ENCRYPTING' : 
                             emailStatus === 'deliver' ? 'DELIVERING' : 'TRANSMITTING'}
                          </span>
                        ) : emailSent ? 'SENT' : 'TRANSMIT'}
                      </div>
                    </button>
                    
                    {!emailSent && !isSendingEmail && (
                      <p className="text-[10px] text-stone-600 italic px-1">
                        * Clicking Transmit will automatically prepare your high-fidelity receipt draft.
                      </p>
                    )}
                  </div>

                </div>

                {/* Receipt Footer */}
                <div className="p-8 pt-0 text-center">
                  <button
                    onClick={resetBooking}
                    className="w-full border border-stone-800 text-stone-400 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-stone-800 hover:text-white transition-all"
                  >
                    Return to Reserve Sanctuary
                  </button>
                </div>
              </div>
            </div>
          ) : showTerms ? (
            <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
              <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 md:p-10 space-y-6">
                  <div className="w-16 h-16 bg-[#addfac]/10 text-[#addfac] rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-3xl font-serif italic text-white">Terms of Agreement</h2>
                    <p className="text-[#addfac] text-[10px] uppercase tracking-[0.2em] font-semibold">Whisper of the Sea Resort & Spa</p>
                  </div>

                  <div className="space-y-4 text-sm text-stone-400 leading-relaxed max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    <p>By proceeding with this reservation, you acknowledge and agree to the following terms and conditions:</p>
                    <ul className="list-disc pl-5 space-y-3 text-xs">
                      <li><strong>Check-in/Check-out:</strong> Official check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in or late check-out is subject to availability and may incur additional fees.</li>
                      <li><strong>Cancellation Policy:</strong> Cancellations made within 48 hours of the scheduled arrival date will incur a penalty equivalent to one night's room charge.</li>
                      <li><strong>No-Smoking Policy:</strong> Whisper of the Sea is a strictly smoke-free sanctuary. A deep cleaning fee of ₱5,000 will be charged for any violations within the suites.</li>
                      <li><strong>Identification:</strong> A valid government-issued photo ID or passport must be presented upon arrival for all staying guests.</li>
                      <li><strong>Liability:</strong> The resort is not responsible for loss, damage, or theft of personal valuables not secured in the provided room safe or at the front desk.</li>
                      <li><strong>Eco-Sanctuary Rules:</strong> To maintain our eco-elegance, we request guests to minimize noise during the "Whispering Hours" (10:00 PM - 7:00 AM).</li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-stone-800 space-y-6">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center mt-1">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="peer appearance-none w-5 h-5 border border-stone-700 rounded bg-stone-950 checked:bg-[#addfac] checked:border-[#addfac] transition-all cursor-pointer"
                        />
                        <Sparkles className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity" />
                      </div>
                      <span className="text-xs text-stone-400 group-hover:text-stone-300 transition-colors leading-relaxed select-none">
                        I have read and agree to the Whisper of the Sea Resort & Spa Terms of Agreement. I understand that my reservation is subject to these policies.
                      </span>
                    </label>

                    <button
                      onClick={handleAcceptTerms}
                      disabled={!termsAccepted}
                      className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg ${
                        termsAccepted 
                          ? "bg-[#addfac] text-black hover:brightness-110 shadow-[#addfac]/10" 
                          : "bg-stone-800 text-stone-500 cursor-not-allowed shadow-none"
                      }`}
                    >
                      Proceed to Receipt
                    </button>
                    <button
                      onClick={() => setShowTerms(false)}
                      className="w-full text-stone-500 hover:text-stone-300 py-1 text-[10px] uppercase tracking-widest transition-colors"
                    >
                      Go Back to Booking Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {bookingError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium animate-pulse">
                  {bookingError}
                </div>
              )}

              {/* ================= STEP 1 ================= */}
              {bookingStep === 1 && (
                <>
                  <div>
                    <h2 className="text-3xl font-serif text-white">
                      Guest Information
                    </h2>

                    <p className="text-stone-400 text-sm mt-3 leading-relaxed">
                      Please provide your complete personal information for your
                      reservation confirmation.
                    </p>
                  </div>

                  {/* FORM GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        First Name
                      </label>

                      <input
                        type="text"
                        name="firstName"
                        value={bookingData.firstName}
                        onChange={handleBookingChange}
                        placeholder="John"
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Last Name
                      </label>

                      <input
                        type="text"
                        name="lastName"
                        value={bookingData.lastName}
                        onChange={handleBookingChange}
                        placeholder="Doe"
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleBookingChange}
                        placeholder="example@gmail.com"
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleBookingChange}
                        placeholder="+63 9123456789"
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Complete Address
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={bookingData.address}
                        onChange={handleBookingChange}
                        placeholder="Street Address"
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Country
                      </label>

                      <select 
                        name="country"
                        value={bookingData.country}
                        onChange={handleBookingChange}
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac]"
                      >
                        <option>Philippines</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Japan</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Valid ID Type
                      </label>

                      <select 
                        name="idType"
                        value={bookingData.idType}
                        onChange={handleBookingChange}
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac]"
                      >
                        <option>Passport</option>
                        <option>Driver License</option>
                        <option>National ID</option>
                      </select>
                    </div>

                  </div>

                  {/* NEXT BUTTON */}
                  <div className="flex justify-end pt-4">

                    <button
                      onClick={() => validateStep1() && setBookingStep(2)}
                      className="bg-gradient-to-r from-teal-600 to-[#addfac] text-black px-10 py-4 rounded-xl font-semibold uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Continue Reservation
                    </button>

                  </div>
                </>
              )}

              {/* ================= STEP 2 ================= */}
              {bookingStep === 2 && (
                <>
                  <div>
                    <h2 className="text-3xl font-serif text-white">
                      Room Reservation
                    </h2>

                    <p className="text-stone-400 text-sm mt-3 leading-relaxed">
                      Select your booking schedule and room preferences.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Check In
                      </label>

                      <input
                        type="date"
                        name="checkIn"
                        value={bookingData.checkIn}
                        onChange={handleBookingChange}
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Check Out
                      </label>

                      <input
                        type="date"
                        name="checkOut"
                        value={bookingData.checkOut}
                        onChange={handleBookingChange}
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Guests
                      </label>

                      <select 
                        name="guests"
                        value={bookingData.guests}
                        onChange={handleBookingChange}
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac]"
                      >
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>3 Guests</option>
                        <option>4 Guests</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Room Type
                      </label>

                      <select 
                        name="roomType"
                        value={bookingData.roomType}
                        onChange={handleBookingChange}
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac]"
                      >
                        <option>Deluxe Room</option>
                        <option>Executive Suite</option>
                        <option>Presidential Suite</option>
                        <option>Superior Room</option>
                        <option>Suite Room</option>
                        <option>Signature Ocean Suite</option>
                        <option>Whispering Waves Haven</option>
                        <option>Sanctuary Penthouse</option>
                      </select>
                    </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="flex items-center justify-between pt-4">

                    <button
                      onClick={() => setBookingStep(1)}
                      className="border border-stone-700 px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-stone-800 transition text-stone-300"
                    >
                      Previous
                    </button>

                    <button
                      onClick={() => validateStep2() && setBookingStep(3)}
                      className="bg-gradient-to-r from-teal-600 to-[#addfac] text-black px-10 py-4 rounded-xl font-semibold uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Continue
                    </button>

                  </div>
                </>
              )}

              {/* ================= STEP 3 ================= */}
              {bookingStep === 3 && (
                <>
                  <div>
                    <h2 className="text-3xl font-serif text-white">
                      Billing Payment
                    </h2>

                    <p className="text-stone-400 text-sm mt-3 leading-relaxed">
                      Select your preferred payment method.
                    </p>
                  </div>

                  <div className="space-y-8">

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Payment Method
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Bank', 'Gcash'].map((method) => (
                          <button
                            key={method}
                            onClick={() => {
                              setBookingData(prev => ({ ...prev, paymentMethod: method }));
                              setBookingError('');
                            }}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 ${
                              bookingData.paymentMethod === method
                                ? 'bg-[#addfac]/10 border-[#addfac] text-[#addfac]'
                                : 'bg-[#1C1C1C] border-stone-800 text-stone-400 hover:border-[#addfac]/40'
                            }`}
                          >
                            <span className="text-sm font-semibold uppercase tracking-widest">{method}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conditional Payment Details */}
                    {bookingData.paymentMethod !== '' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                            {bookingData.paymentMethod} Account Name
                          </label>
                          <input
                            type="text"
                            name="paymentName"
                            value={bookingData.paymentName}
                            onChange={handleBookingChange}
                            placeholder="Full Name"
                            className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                            {bookingData.paymentMethod} Number
                          </label>
                          <input
                            type="text"
                            name="paymentNumber"
                            value={bookingData.paymentNumber}
                            onChange={handleBookingChange}
                            placeholder="Account or Phone Number"
                            className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 max-w-md animate-fadeIn">
                      <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium ml-1">
                        Mandatory Downpayment Amount (₱)
                      </label>
                      <input
                        type="number"
                        name="downpayment"
                        value={bookingData.downpayment}
                        onChange={handleBookingChange}
                        placeholder="e.g. 2000"
                        className="w-full bg-[#1C1C1C] border border-stone-700 rounded-xl px-5 py-4 outline-none focus:border-[#addfac] transition"
                      />
                      <p className="text-[10px] text-stone-500 italic px-1">
                        * A minimum downpayment is required to secure your reservation sanctuary.
                      </p>
                    </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="flex items-center justify-between pt-8">

                    <button
                      onClick={() => setBookingStep(2)}
                      className="border border-stone-700 px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-stone-800 transition text-stone-300"
                    >
                      Previous
                    </button>

                    <button
                      onClick={handleConfirmBooking}
                      className="bg-gradient-to-r from-teal-600 to-[#addfac] text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#addfac]/10"
                    >
                      Confirm Booking
                    </button>

                  </div>
                </>
              )}
            </>
          )}

        </div>

      </div>

    </section>

  </div>
)}
      {/* --- STANDALONE CONTACT VIEW (Brand New Implementation based on reference images) --- */}
      {activePage === 'contact' && (
        <div className="animate-fadeIn">
          {/* CONTACT HERO BANNER */}
          <section className="relative w-full h-[260px] md:h-[340px] overflow-hidden flex items-center justify-center">
            <img 
              src="pic 1.jpg" 
              alt="Contact sanctuary overview" 
              className="absolute inset-0 w-full h-full object-cover brightness-[0.25] saturate-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C1C1C]/60 to-[#1C1C1C]"></div>
            <div className="relative text-center space-y-2.5 z-10">
              <h1 className="text-4xl md:text-5xl font-serif italic text-stone-100 tracking-wide">Contact Us</h1>
              <p className="text-xs uppercase tracking-[0.25em] text-[#addfac]">
                <span className="cursor-pointer" onClick={() => setActivePage('home')}>Home</span> 
                <span className="text-stone-600 mx-1.5">•</span> Get In Touch With Us
              </p>
            </div>
          </section>

          {/* MAIN DUAL CANVAS BLOCK */}
          <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: INFORMATIONAL GRID CARDS & INTERACTIVE MAP MAPPER */}
            <div className="lg:col-span-5 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Card 1: Phone */}
                <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-[#addfac]/30 transition-all text-center space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#addfac]/10 flex items-center justify-center mx-auto">
                    <Phone className="w-4 h-4 text-[#addfac]" />
                  </div>
                  <h4 className="text-sm font-medium tracking-wide text-stone-200">Phone</h4>
                  <p className="text-xs text-stone-400 font-light font-mono">207-8767-452</p>
                </div>

                {/* Card 2: WhatsApp */}
                <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-[#addfac]/30 transition-all text-center space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#addfac]/10 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-4 h-4 text-[#addfac]" />
                  </div>
                  <h4 className="text-sm font-medium tracking-wide text-stone-200">WhatsApp</h4>
                  <p className="text-xs text-stone-400 font-light font-mono">082-123-234-345</p>
                </div>

                {/* Card 3: Email */}
                <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-[#addfac]/30 transition-all text-center space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#addfac]/10 flex items-center justify-center mx-auto">
                    <Mail className="w-4 h-4 text-[#addfac]" />
                  </div>
                  <h4 className="text-sm font-medium tracking-wide text-stone-200">Email</h4>
                  <p className="text-xs text-stone-400 font-light break-all">support@whispersea.com</p>
                </div>

                {/* Card 4: Our Shop / Resort Address */}
                <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-[#addfac]/30 transition-all text-center space-y-2">
                  <div className="w-9 h-9 rounded-full bg-[#addfac]/10 flex items-center justify-center mx-auto">
                    <Store className="w-4 h-4 text-[#addfac]" />
                  </div>
                  <h4 className="text-sm font-medium tracking-wide text-stone-200">Our Resort</h4>
                  <p className="text-xs text-stone-400 font-light leading-snug">2443 Oak Ridge Road, CA 94103</p>
                </div>
              </div>

              {/* INTEGRATED MAP VIEWPORT CANVAS PLACEHOLDER */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-800/80 shadow-xl bg-stone-900/20 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3]">
                <iframe 
                  title="Resort Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.123456789!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjciTiAxMjLCsDI1JzEwLjAiVw!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                  className="absolute inset-0 w-full h-full border-none filter brightness-75 contrast-125 grayscale invert"
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none border border-stone-800/60 rounded-2xl"></div>
              </div>
            </div>

            {/* RIGHT COLUMN: HIGH FIDELITY INTERACTIVE INPUT FORM WORKSPACE */}
            <div className="lg:col-span-7 bg-[#242424]/40 border border-stone-900/80 p-6 md:p-10 rounded-2xl shadow-xl space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#addfac]">Get In Touch</span>
                <h2 className="text-2xl md:text-3xl font-serif text-stone-100">Send Us A Message</h2>
                <p className="text-xs text-stone-400 max-w-xl leading-relaxed font-light">
                  Have inquiries about our luxury suites, events custom arrangements, or private dining plans? Leave us a request parameters note below.
                </p>
              </div>

              {/* Feedback Messages */}
              {contactError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium animate-pulse">
                  {contactError}
                </div>
              )}
              {contactSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
                  <Sparkles className="w-4 h-4" />
                  Your message has been sent to the sanctuary team. We will respond shortly.
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={contactData.name}
                      onChange={handleContactChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#1C1C1C] border border-stone-800 focus:border-[#addfac]/60 rounded px-4 py-3 text-xs text-stone-200 placeholder-stone-600 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      placeholder="example@journal.com"
                      className="w-full bg-[#1C1C1C] border border-stone-800 focus:border-[#addfac]/60 rounded px-4 py-3 text-xs text-stone-200 placeholder-stone-600 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">Subject Topic</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={contactData.subject}
                    onChange={handleContactChange}
                    placeholder="Reservation Inquiry / Special Arrangements"
                    className="w-full bg-[#1C1C1C] border border-stone-800 focus:border-[#addfac]/60 rounded px-4 py-3 text-xs text-stone-200 placeholder-stone-600 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 font-medium block">Message Body</label>
                  <textarea 
                    rows={5}
                    name="message"
                    value={contactData.message}
                    onChange={handleContactChange}
                    placeholder="Describe your requested premium dates or custom services requirements..."
                    className="w-full bg-[#1C1C1C] border border-stone-800 focus:border-[#addfac]/60 rounded px-4 py-3 text-xs text-stone-200 placeholder-stone-600 outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-[#addfac] text-black font-semibold text-xs py-3.5 rounded tracking-widest uppercase hover:brightness-110 transition-all shadow-md shadow-[#addfac]/5 active:scale-[0.98]"
                  >
                    Send Message Now
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* INTEGRATED FOOTER METRICS SYSTEM */}
          <footer className="w-full bg-stone-950/40 border-t border-stone-900 mt-16 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 items-start text-xs tracking-wide text-stone-400">
              <div className="space-y-3">
                <h5 className="font-serif text-[#addfac] text-sm tracking-wider uppercase font-medium">Whisper of the Sea</h5>
                <p className="font-light leading-relaxed">Pristine Philippines eco-elegance. Complete deep coastal luxury sanctuary infrastructure.</p>
              </div>
              <div className="space-y-2">
                <h5 className="text-stone-200 font-semibold tracking-widest uppercase text-[10px]">Quick Travel Links</h5>
                <ul className="space-y-1 font-light">
                  <li className="hover:text-[#addfac] cursor-pointer" onClick={() => setActivePage('home')}>Main Home Desk</li>
                  <li className="hover:text-[#addfac] cursor-pointer" onClick={() => setActivePage('about')}>Our Eco Profile</li>
                  <li className="hover:text-[#addfac] cursor-pointer" onClick={() => setActivePage('rooms')}>Reserve Sanctuary Room</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="text-stone-200 font-semibold tracking-widest uppercase text-[10px]">Legal Terms</h5>
                <ul className="space-y-1 font-light">
                  <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
                  <li className="hover:text-white cursor-pointer">Privacy Framework</li>
                  <li className="hover:text-white cursor-pointer">Support Center</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="text-stone-200 font-semibold tracking-widest uppercase text-[10px]">Direct Hotlines</h5>
                <p className="font-mono font-light text-stone-300">HQ: 207-8767-452</p>
                <p className="font-light break-all">support@whispersea.com</p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 text-center text-[10px] tracking-widest text-stone-600 mt-10 pt-4 border-t border-stone-900/50">
              © 2026 Whisper of the Sea Hotel & Resort | Created Elegance
            </div>
          </footer>
        </div>
      )}

      <AIAssistant />
    </div>
  );
}