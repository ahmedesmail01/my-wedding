export interface WeddingConfig {
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string; // Golden tones
    backgroundColor: string;
    fontFamilyEn: string;
    fontFamilyAr: string;
    particles: 'butterflies' | 'sparkles' | 'both';
  };
  audio: {
    url: string;
    title: string;
    artist: string;
  };
  monogram: {
    lettersAr: string; // e.g. "أ م"
    lettersEn: string; // e.g. "AM"
    titleAr: string;
    titleEn: string;
  };
  quotes: {
    arabic: string;
    english: string;
  };
  hosts: {
    groomParentsAr: string;
    groomParentsEn: string;
    brideParentsAr: string;
    brideParentsEn: string;
  };
  couple: {
    groomNameAr: string;
    groomNameEn: string;
    brideNameAr: string;
    brideNameEn: string;
  };
  event: {
    dateTimeIso: string; // ISO date format for countdown, e.g. "2026-08-29T20:00:00"
    dateTextAr: string;
    dateTextEn: string;
    venueNameAr: string;
    venueNameEn: string;
    venueAddressAr: string;
    venueAddressEn: string;
    googleMapsUrl: string;
    calendarTitle: string;
    calendarDescription: string;
  };
  rsvp: {
    enabled: boolean;
    maxGuestsPerInvite: number;
    sheetApiUrl?: string; // Optional: URL to post RSVP data to (e.g. Google Sheets, webhook)
  };
  guestbook: {
    enabled: boolean;
    initialGreetings: Array<{
      name: string;
      message: string;
      date: string;
    }>;
  };
}

export const weddingConfig: WeddingConfig = {
  seo: {
    title: "دعوة زفاف أحمد & مروة | Wedding Invitation",
    description: "نتشرف بدعوتكم لحضور حفل زفافنا. حضوركم يسعدنا ويتم به سرورنا.",
    keywords: "wedding invitation, أحمد ومروة, دعوة زفاف, الساحل الشمالي, wedding invite",
    ogImage: "/og-image.jpg"
  },
  theme: {
    primaryColor: "#2A363B",
    secondaryColor: "#99B898",
    accentColor: "#D4AF37", // Elegant gold
    backgroundColor: "#F8F7F4", // Soft Warm Off-White / Alabaster
    fontFamilyEn: "'Cinzel', serif",
    fontFamilyAr: "'Amiri', serif",
    particles: "both"
  },
  audio: {
    // Royalty-free soft cinematic wedding piano music track URL
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // fallback beautiful instrumental
    title: "Romantic Wedding Piano",
    artist: "Cinematic Instrumental"
  },
  monogram: {
    lettersAr: "أ ٫ م",
    lettersEn: "A & M",
    titleAr: "أحمد & مروة",
    titleEn: "Ahmed & Marwa"
  },
  quotes: {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً»",
    english: "In the name of God, the Most Gracious, the Most Merciful\n\n\"And among His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.\""
  },
  hosts: {
    groomParentsAr: "الدكتور حسام العزازي",
    groomParentsEn: "Dr. Hossam El-Azazy",
    brideParentsAr: "المستشار محمد ابو العلا",
    brideParentsEn: "Consultant Mohamed Abou El-Ela"
  },
  couple: {
    groomNameAr: "أحمد",
    groomNameEn: "Ahmed",
    brideNameAr: "مروة",
    brideNameEn: "Marwa"
  },
  event: {
    // Current local time in system is Jun 1, 2026. Let's schedule it for Aug 29, 2026.
    dateTimeIso: "2026-08-29T20:00:00",
    dateTextAr: "الجمعة | 29 أغسطس 2026 | الثامنة مساءً",
    dateTextEn: "Friday, August 29, 2026 at 8:00 PM",
    venueNameAr: "منتجع فينوس 1",
    venueNameEn: "Venus Resort 1",
    venueAddressAr: "الساحل الشمالي، مصر",
    venueAddressEn: "North Coast, Egypt",
    googleMapsUrl: "https://maps.google.com/?q=North+Coast+Egypt+Venus+Resort",
    calendarTitle: "Wedding Ceremony of Ahmed & Marwa",
    calendarDescription: "We are thrilled to celebrate our special day with you! Venue: Venus Resort 1, North Coast, Egypt."
  },
  rsvp: {
    enabled: true,
    maxGuestsPerInvite: 5
  },
  guestbook: {
    enabled: true,
    initialGreetings: [
      {
        name: "خالد المحمدي",
        message: "ألف مبروك لأجمل عريسين! تمنياتي لكم بحياة زوجية سعيدة مليئة بالحب والرفاه والبنين.",
        date: "2026-05-30"
      },
      {
        name: "Dr. Sarah Johnson",
        message: "So happy for you both! Can't wait to celebrate this beautiful day. Wishing you all the love and happiness in the world!",
        date: "2026-05-31"
      },
      {
        name: "عائلة أبو العلا",
        message: "بارك الله لكما وبارك عليكما وجمع بينكما في خير. نراكم على خير قريباً بالساحل الشمالي إن شاء الله.",
        date: "2026-06-01"
      }
    ]
  }
};
