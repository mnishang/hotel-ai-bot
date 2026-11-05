/**
 * ============================================================================
 *  AI ASSISTANT — HOTEL CONFIGURATION
 * ============================================================================
 *  This is the single config file for the AI Assistant.
 *
 *  The details below were taken from this website (Rooms, About, Booking,
 *  Contact and Terms pages). Update them here whenever the hotel changes its
 *  rates, policies or contact details.
 *
 *  Items marked [CONFIRM: ...] are inherited from the website but look
 *  inconsistent or incomplete, so please double-check them before launch.
 *
 *  Do NOT put API keys or secrets in this file. The provider key belongs in
 *  `.env.local` as AI_API_KEY (see `.env.example`).
 * ============================================================================
 */

/**
 * Structured room data. Used to build the prompt text and the built-in
 * fallback replies, so rates only need to be updated in one place.
 */
export const roomRates = [
  {
    name: "Superior Room",
    price: "₱3,500",
    description: "Spacious rooms with modern amenities for a relaxing stay.",
  },
  {
    name: "Deluxe Room",
    price: "₱4,500",
    description: "Comfortable stay designed for a pleasant and peaceful stay.",
  },
  {
    name: "Suite Room",
    price: "₱6,000",
    description: "Spacious suites with an elegant ambiance and premium comfort.",
  },
  {
    name: "Signature Ocean Suite",
    price: "₱8,500",
    description:
      "Panoramic ocean views paired with bespoke mid-century modular interiors.",
  },
  {
    name: "Whispering Waves Haven",
    price: "₱12,000",
    description:
      "A custom beach-level sanctuary with a private path to raw sand shores.",
  },
  {
    name: "Sanctuary Penthouse",
    price: "₱25,000",
    description:
      "The pinnacle of resort luxury with panoramic rooftop ocean views.",
  },
] as const;

const roomRateLines = roomRates
  .map((room) => `- ${room.name} — ${room.price} per night. ${room.description}`)
  .join("\n");

export const hotelKnowledge = {
  /* ------------------------------------------------------------------ */
  /* Hotel identity & contact details                                    */
  /* ------------------------------------------------------------------ */
  name: "Whisper of the Sea Resort & Spa",
  supportEmail: "support@whispersea.com",
  phone: "207-8767-452",
  whatsApp: "082-123-234-345",
  // [CONFIRM: the Contact page lists this address while also describing the
  // resort as being on the Pacific coastline of the Philippines.]
  address: "2443 Oak Ridge Road, CA 94103",
  // [CONFIRM: inferred from the support email domain — replace if different.]
  website: "https://www.whispersea.com",

  /* ------------------------------------------------------------------ */
  /* Widget copy (safe to edit — these are shown in the chat UI)         */
  /* ------------------------------------------------------------------ */
  welcomeMessage:
    "Hello and welcome! 😊 I'm your AI Assistant at Whisper of the Sea Resort & Spa. I'd be happy to help with room reservations, rates, policies and more. How can I help you today?",

  suggestedReplies: [
    "How do I reserve a room?",
    "What room types and rates are available?",
    "What are the check-in and check-out times?",
    "Is there a refund or cancellation policy?",
  ],

  /**
   * The knowledge base is formatted into the model's system prompt.
   * Keep entries factual and concise. If a detail is not confirmed, say so
   * instead of guessing.
   */
  knowledgeBase: {
    aboutTheHotel: `Whisper of the Sea Resort & Spa is a luxury eco-resort on the Pacific coastline of the Philippines. It was founded in 2012 by a collective of avant-garde architects and environmentalists with the vision of creating a sanctuary that breathes with the ocean. The resort is known for its "Lego-Luxury" modular architecture: suites are pre-crafted from sustainable mahogany with floor-to-ceiling smart glass, then integrated into the natural contours of the coastline with minimal site disruption. It operates on a 100% renewable grid using solar-kinetic energy harvesting and circular water filtration. Its philosophy is complete harmony with nature without altering the definition of pristine luxury. Brand voice: warm, elegant, calm and welcoming ("Stay Elegantly").`,

    bookingSteps: `Guests must be logged in to use the online booking flow, then follow three steps:
1. Client Information — first name, last name, email address, phone number, complete address, country and ID type (Passport, Driver License or National ID). All fields are required.
2. Room Reservation — check-in date, check-out date, number of guests (the form offers 1 to 4 guests) and room type.
3. Billing Payment — choose Bank or GCash, enter the account name and account/phone number, and enter the mandatory downpayment amount.
After that the guest reviews and accepts the Terms of Agreement. A Reservation Receipt is generated with a Receipt ID and confirmation date. The guest can send the receipt to their Gmail inbox and should present it at check-in. Bookings show as "Confirmed & Pending arrival". Guests can also book by contacting the resort directly.`,

    roomTypesAndRates: `Published nightly rates, in Philippine pesos (₱). Rates are subject to change and availability; the final rate is confirmed on the Booking page or by the resort.
${roomRateLines}
- Executive Suite and Presidential Suite are listed as room choices in the booking form, but their rates are not published on the website; direct guests to the resort for a quote.
Maximum occupancy, bed configurations and what each rate includes are not published. Breakfast is available at the resort, but it is not stated whether it is included in the room rate.`,

    roomRecommendations: `Room suggestions based on our published room descriptions (not on unpublished room sizes):
- Best value: Superior Room (₱3,500) or Deluxe Room (₱4,500).
- Couples or guests who want an ocean view: Signature Ocean Suite (₱8,500) — panoramic ocean views with bespoke mid-century modular interiors.
- Beach lovers: Whispering Waves Haven (₱12,000) — a beach-level sanctuary with a private path to the sand.
- Guests who want more space: Suite Room (₱6,000) — a spacious suite with an elegant ambiance.
- Top-tier luxury or special occasions: Sanctuary Penthouse (₱25,000) — the resort's flagship suite with panoramic rooftop ocean views.
Exact room sizes, bed configurations and maximum occupancy are not published.`,

    roomSizes: `Exact room sizes in square meters and maximum occupancy are not published on the website. The Sanctuary Penthouse is the flagship, top-tier suite in the published lineup, with panoramic rooftop ocean views. Whispering Waves Haven is the beach-level option with a private path to the sand. For exact dimensions and capacity, please contact the resort.`,

    dining: `Multi-Cuisine Restaurant — the resort's master chefs combine fresh organic coastal ingredients with culinary art for every palate. Breakfast, lunch and dinner are served. Executive Chef: Lhorelyn Dalaguit. Restaurant opening hours, menus and table reservations are not published; direct guests to the resort for those details.`,

    cancellationAndRefundPolicy: `Cancellations made within 48 hours of the scheduled arrival date incur a penalty equal to one night's room charge. Cancellations made earlier, no-show rules, and refund methods or processing times are not published. Refunds, when applicable, are handled by the resort. Guests should contact the resort directly to cancel or change a booking.`,

    checkInCheckOut: `Official check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional fees.`,

    paymentMethods: `The online booking flow accepts Bank transfer and GCash. A mandatory downpayment is required to secure the reservation. The remaining balance is the total accommodation rate minus the downpayment paid, and is settled with the resort. Cash, credit/debit cards, Maya and other methods are not listed in the online booking flow — confirm with the resort. Never ask for card numbers, passwords or one-time codes in chat.`,

    amenities: `24/7 hotel security; high-speed fiber Wi-Fi; smart-lock keyless entry; gym/fitness center; swimming pool (infinity pool); gourmet multi-cuisine breakfast; multi-cuisine restaurant; spa and wellness services; ocean views; beach access, with a private path to the beach at Whispering Waves Haven; eco-friendly operations on a 100% renewable grid with solar-kinetic energy and circular water filtration. Parking, airport transfer and accessibility features are not listed — confirm with the resort.`,

    locationAndDirections: `The resort is described as a coastal sanctuary on the Pacific coastline of the Philippines. The published address is 2443 Oak Ridge Road, CA 94103. Nearby landmarks, airport transfer options, parking and public transport are not published. For directions or travel arrangements, direct guests to the resort's phone, WhatsApp or email.`,

    otherPolicies: `Whisper of the Sea is a strictly smoke-free property; a ₱5,000 deep-cleaning fee applies for smoking inside suites. Quiet hours ("Whispering Hours") are 10:00 PM to 7:00 AM. A valid government-issued photo ID or passport must be presented on arrival for every staying guest. The resort is not responsible for loss, damage or theft of valuables that are not secured in the in-room safe or at the front desk. Pets, children's policy, extra beds and maximum occupancy are not published. Guests must accept the Terms of Agreement before a booking is confirmed.`,

    specialRequests: `Special requests such as celebrations, private dining or custom arrangements can be sent through the Contact page or by phone, WhatsApp or email. They are subject to availability and confirmation by the resort; the website does not guarantee them.`,

    contactAndHours: `Phone: 207-8767-452. WhatsApp: 082-123-234-345. Email: support@whispersea.com. Address: 2443 Oak Ridge Road, CA 94103. Front desk and support hours are not published.`,

    team: `Key team members: Khate Charmeille (General Manager), Shane Garey Gales (Head Concierge), Lhorelyn Dalaguit (Executive Chef), Roche Mae Salvaloza (Guest Relations), Katrine Matedios (Spa & Wellness Director), Honeylyn Regulacion (Operations Lead) and James Patrick Inoc (Sommelier).`,
  },
} as const;

/** Maximum characters accepted for one chat message. Shared by UI and API. */
export const AI_CHAT_MAX_MESSAGE_LENGTH = 2000;

/** Number of most recent messages sent to the model as conversation context. */
export const AI_CHAT_MAX_CONTEXT_MESSAGES = 20;

/** Maximum total characters accepted for the whole conversation payload. */
export const AI_CHAT_MAX_TOTAL_LENGTH = 20000;
