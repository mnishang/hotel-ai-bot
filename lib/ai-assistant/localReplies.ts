import { hotelKnowledge, roomRates } from "./hotelKnowledge";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const CONTACT_LINE = `Phone: ${hotelKnowledge.phone}, WhatsApp: ${hotelKnowledge.whatsApp} or email ${hotelKnowledge.supportEmail}`;

const ROOM_LIST = roomRates
  .map((room) => `• ${room.name} — ${room.price} per night. ${room.description}`)
  .join("\n");

function replyToRooms(): string {
  return `Here are our published nightly rates in Philippine pesos:\n${ROOM_LIST}\n\nExecutive Suite and Presidential Suite are also available in the booking form, but their rates are not published. Rates can change, so the final rate is confirmed on the Booking page. Would you like help reserving a room?`;
}

function replyToRecommendation(): string {
  return `Here are my suggestions based on what you'd like most:\n• Best value: Superior Room (₱3,500) or Deluxe Room (₱4,500).\n• Ocean views for couples: Signature Ocean Suite (₱8,500) — panoramic ocean views with bespoke mid-century modular interiors.\n• Beach lovers: Whispering Waves Haven (₱12,000) — beach-level with a private path to the sand.\n• More space: Suite Room (₱6,000) — a spacious suite with an elegant ambiance.\n• Top-tier luxury: Sanctuary Penthouse (₱25,000) — our flagship suite with panoramic rooftop ocean views.\n\nTell me who is travelling and what matters most — view, beach, space or budget — and I can narrow it down. Exact room sizes and occupancy are not published.`;
}

function replyToBiggestRoom(): string {
  return `We don't publish exact room sizes, so I can't confirm the square meters of each room. The Sanctuary Penthouse is our flagship, top-tier suite and the most premium option in our lineup, with panoramic rooftop ocean views. Whispering Waves Haven is the beach-level option with a private path to the sand. For exact dimensions and maximum occupancy, please contact us at ${CONTACT_LINE} and our team will help you choose the right room.`;
}

function replyToBooking(): string {
  return `You can book on our Booking page in three steps:\n1. Enter your guest details (name, email, phone, address, country and ID type).\n2. Choose your check-in and check-out dates, number of guests and room type.\n3. Choose Bank transfer or GCash, enter the mandatory downpayment, and accept the Terms of Agreement.\n\nA Reservation Receipt with a Receipt ID is generated for you to present at check-in. You can also book by contacting us at ${CONTACT_LINE}.`;
}

function replyToCancellation(): string {
  return `Cancellations made within 48 hours of your scheduled arrival date incur a penalty equal to one night's room charge. Earlier cancellations, no-show rules and refund processing times are not published, so please contact us at ${CONTACT_LINE} and our team will assist you.`;
}

function replyToCheckIn(): string {
  return `Check-in is at 2:00 PM and check-out is at 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional fees. Would you like help with a reservation?`;
}

function replyToPayment(): string {
  return `Our online booking flow accepts Bank transfer and GCash. A mandatory downpayment is required to secure your reservation, and the remaining balance is settled with the resort. Cash, credit/debit cards, Maya and other methods are not listed in the online flow, so please confirm with us at ${CONTACT_LINE}. For your security, please never share card numbers or passwords in chat.`;
}

function replyToAmenities(): string {
  return `Our amenities include 24/7 security, high-speed fiber Wi-Fi, smart-lock keyless entry, a gym, an infinity pool, gourmet multi-cuisine breakfast, our multi-cuisine restaurant, spa and wellness services, ocean views and beach access. Whispering Waves Haven also has a private path to the beach. Parking, airport transfer and accessibility features are not published, so please contact us to confirm.`;
}

function replyToDining(): string {
  return `Our Multi-Cuisine Restaurant serves breakfast, lunch and dinner. Our master chefs combine fresh organic coastal ingredients with culinary art, and our Executive Chef is Lhorelyn Dalaguit. Breakfast is available, but we do not publish whether it is included in the room rate. Restaurant hours, menus and table reservations are not published, so please contact us at ${hotelKnowledge.supportEmail} for those details.`;
}

function replyToLocation(): string {
  return `Whisper of the Sea Resort & Spa is a coastal sanctuary on the Pacific coastline of the Philippines. Our published address is ${hotelKnowledge.address}. Airport transfers, parking and public transport details are not published, so please contact us at ${CONTACT_LINE} for directions and travel arrangements.`;
}

function replyToPolicies(): string {
  return `A few important policies: check-in is at 2:00 PM and check-out is at 12:00 PM; cancelling within 48 hours of arrival incurs a one-night charge; the resort is strictly smoke-free (a ₱5,000 deep-cleaning fee applies for smoking in suites); quiet hours are 10:00 PM to 7:00 AM; and every staying guest must present a valid government-issued photo ID or passport at check-in. Pets, children's policy, extra beds and maximum occupancy are not published. Is there a specific policy you'd like me to clarify?`;
}

function replyToSpecialRequests(): string {
  return `We'd be happy to help with celebrations, private dining or custom arrangements. Please send the details through our Contact page or reach us at ${CONTACT_LINE}. These requests are subject to availability and confirmation by our team.`;
}

function replyToAvailability(): string {
  return `I can't check live room availability from here, but you can view and reserve rooms on our Booking page. For specific dates or larger groups, please contact us at ${CONTACT_LINE} and our team will confirm availability for you.`;
}

function replyToContact(): string {
  return `You can reach us at:\n• Phone: ${hotelKnowledge.phone}\n• WhatsApp: ${hotelKnowledge.whatsApp}\n• Email: ${hotelKnowledge.supportEmail}\n• Address: ${hotelKnowledge.address}\n\nFront desk and support hours are not published, so please leave a message and our team will get back to you.`;
}

function replyToTeam(): string {
  return hotelKnowledge.knowledgeBase.team;
}

function replyToAbout(): string {
  return hotelKnowledge.knowledgeBase.aboutTheHotel;
}

function replyToGreeting(): string {
  return `Hello! 😊 Welcome to ${hotelKnowledge.name}. I can help with rooms and rates, booking, payments, check-in and check-out, policies, amenities, dining, or directions. What would you like to know?`;
}

function replyToThanks(): string {
  return `You're very welcome! 😊 Is there anything else I can help you with before your stay?`;
}

function replyToGeneric(): string {
  return `I'd be glad to help! 😊 I can answer questions about room types and rates, booking, payments, check-in and check-out, cancellation, amenities, dining, policies, location and special requests. Which one would you like to know about?`;
}

/**
 * Built-in, knowledge-based replies used when no AI provider key is configured
 * or when the provider is temporarily unavailable. This keeps the chat useful
 * instead of always showing the generic error message.
 */
export function buildLocalReply(messages: ChatMessage[]): string {
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  const text = (lastUserMessage?.content ?? "").toLowerCase().trim();

  if (!text) return replyToGreeting();

  // Short greetings only, so "hello, what are your rates?" still gets rates.
  if (
    /^(hi|hello|hey|good (morning|afternoon|evening))\b/.test(text) &&
    text.length <= 25
  ) {
    return replyToGreeting();
  }

  if (/\b(thanks|thank you|thankyou|ty)\b/.test(text)) {
    return replyToThanks();
  }

  if (/(cancel|refund|no[\s-]?show|penalty)/.test(text)) {
    return replyToCancellation();
  }

  if (/(check[\s-]?in|check[\s-]?out|arrival|departure|early check|late check)/.test(text)) {
    return replyToCheckIn();
  }

  if (
    /(availab|vacan|is there .* (room|suite)|do you have .* (room|suite)|free room)/.test(
      text,
    ) &&
    !/(rate|price|cost|room type|room types)/.test(text)
  ) {
    return replyToAvailability();
  }

  if (/(biggest|largest|most spacious|big room|large room|room size|square|sqm|how big|dimensions)/.test(text)) {
    return replyToBiggestRoom();
  }

  if (/(reserve|reservation|booking|book a|book room|how do i book)/.test(text)) {
    return replyToBooking();
  }

  if (
    /(rate|price|cost|how much|room type|room types|suite|penthouse|villa|haven|superior room|deluxe room|signature ocean)/.test(
      text,
    )
  ) {
    return replyToRooms();
  }

  if (
    /(recommend|suggest|best room|which room|what room|ideal room|good for couples|good for family)/.test(
      text,
    )
  ) {
    return replyToRecommendation();
  }

  if (
    /(pay|payment|payment method|gcash|bank transfer|downpayment|deposit|cash|credit card|debit card|maya)/.test(
      text,
    )
  ) {
    return replyToPayment();
  }

  if (/(manager|concierge|sommelier|staff|team|general manager)/.test(text)) {
    return replyToTeam();
  }

  if (/(restaurant|dining|food|eat|chef|menu|breakfast|lunch|dinner)/.test(text)) {
    return replyToDining();
  }

  if (
    /(amenit|pool|wifi|wi-fi|gym|spa|security|smart lock|fitness|beach access)/.test(
      text,
    )
  ) {
    return replyToAmenities();
  }

  if (/(where|location|address|direction|map|airport|transfer|how to get|nearby)/.test(text)) {
    return replyToLocation();
  }

  if (
    /(policy|policies|smok|pet|child|quiet|identification|\bid\b|safe|valuable|extra bed|occupancy)/.test(
      text,
    )
  ) {
    return replyToPolicies();
  }

  if (/(special request|celebration|birthday|anniversary|private dining|event|wedding)/.test(text)) {
    return replyToSpecialRequests();
  }

  if (/(contact|phone|call|email|whatsapp|hours|open)/.test(text)) {
    return replyToContact();
  }

  if (/(about|history|founded|eco|sustainab|who are you|what is the hotel)/.test(text)) {
    return replyToAbout();
  }

  return replyToGeneric();
}
