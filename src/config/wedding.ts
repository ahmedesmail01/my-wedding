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
    welcomeTextAr: string;
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
    title: "دعوة خطوبة أحمد & سما | Wedding Invitation",
    description: "نتشرف بدعوتكم لحضور حفل خطوبة. حضوركم يسعدنا ويتم به سرورنا.",
    keywords: "wedding invitation, أحمد وسما, دعوة خطوبة, الساحل الشمالي, wedding invite",
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
    url: "/sounds/WhatsApp%20Audio%202026-06-01%20at%201.34.12%20AM.mpeg",
    title: "زفة أحمد & سما",
    artist: "Wedding Soundtrack"
  },
  monogram: {
    lettersAr: "أ ٫ س",
    lettersEn: "A & S",
    titleAr: "أحمد & سما",
    titleEn: "Ahmed & Sama"
  },
  quotes: {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\n«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً»",
    english: "In the name of God, the Most Gracious, the Most Merciful\n\n\"And among His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.\""
  },
  hosts: {
    groomParentsAr: "الاستاذ نصر اسماعيل",
    groomParentsEn: "Mr. Nasr Ismail",
    brideParentsAr: "الاستاذ احمد سمير",
    brideParentsEn: "Mr. Ahmed Samir"
  },
  couple: {
    groomNameAr: "أحمد",
    groomNameEn: "Ahmed",
    brideNameAr: "سما",
    brideNameEn: "Sama"
  },
  event: {
    // Synchronized to June 2nd, 2026 at 9:00 PM (GMT+3 Cairo DST time)
    dateTimeIso: "2026-06-02T21:00:00+03:00",
    dateTextAr: "الثلاثاء | 2 يونيو 2026 | التاسعة مساءً",
    dateTextEn: "Tuesday, June 2, 2026 at 9:00 PM",
    venueNameAr: "قاعة ريماس",
    venueNameEn: "Rimas Hall",
    venueAddressAr: "السنطة - الغربية",
    venueAddressEn: "El Santa - Gharbia",
    googleMapsUrl: "https://maps.app.goo.gl/uq7vjgVQjb1mvpRa7",
    calendarTitle: "Wedding Ceremony of Ahmed & Sama",
    calendarDescription: "We are thrilled to celebrate our special day with you! Venue: Rimas Hall, El Santa, Gharbia, Egypt.",
    welcomeTextAr: "وبحضوركم يتم لنا الفرح والسرور"
  },
  rsvp: {
    enabled: true,
    maxGuestsPerInvite: 5
  },
  guestbook: {
    enabled: true,
    initialGreetings: [
      // {
      //   name: "خالد المحمدي",
      //   message: "ألف مبروك لأجمل عريسين! تمنياتي لكم بحياة زوجية سعيدة مليئة بالحب والرفاه والبنين.",
      //   date: "2026-05-30"
      // },
      // {
      //   name: "Dr. Sarah Johnson",
      //   message: "So happy for you both! Can't wait to celebrate this beautiful day. Wishing you all the love and happiness in the world!",
      //   date: "2026-05-31"
      // },
      // {
      //   name: "عائلة أبو العلا",
      //   message: "بارك الله لكما وبارك عليكما وجمع بينكما في خير. نراكم على خير قريباً بالساحل الشمالي إن شاء الله.",
      //   date: "2026-06-01"
      // }
    ]
  }
};
