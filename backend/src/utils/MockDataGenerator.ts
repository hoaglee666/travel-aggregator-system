export const ASIA_REGIONS = {
  // --- Southeast Asia ---
  Vietnam: [
    "Ho Chi Minh City",
    "Hanoi",
    "Da Nang",
    "Da Lat",
    "Vung Tau",
    "Nha Trang",
    "Phu Quoc",
    "Hoi An",
    "Hue",
  ],
  Thailand: [
    "Bangkok",
    "Phuket",
    "Chiang Mai",
    "Pattaya",
    "Koh Samui",
    "Hua Hin",
    "Krabi",
    "Ayutthaya",
  ],
  Singapore: [
    "Marina Bay",
    "Sentosa",
    "Orchard",
    "Changi",
    "Bugis",
    "Clarke Quay",
  ],
  Malaysia: [
    "Kuala Lumpur",
    "Penang",
    "Langkawi",
    "Malacca",
    "Johor Bahru",
    "Kota Kinabalu",
    "Ipoh",
  ],
  Indonesia: ["Bali", "Jakarta", "Yogyakarta", "Bandung", "Surabaya", "Lombok"],
  Philippines: [
    "Manila",
    "Cebu",
    "Boracay",
    "Palawan",
    "Bohol",
    "Davao",
    "Makati",
  ],
  Cambodia: ["Siem Reap", "Phnom Penh", "Sihanoukville", "Kampot", "Kep"],
  Laos: ["Luang Prabang", "Vientiane", "Vang Vieng", "Pakse"],
  Brunei: ["Bandar Seri Begawan", "Jerudong", "Kuala Belait"],

  // --- East Asia ---
  Japan: [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Hokkaido",
    "Okinawa",
    "Fukuoka",
    "Nagoya",
    "Hiroshima",
    "Nara",
  ],
  "South Korea": [
    "Seoul",
    "Busan",
    "Jeju",
    "Incheon",
    "Gyeongju",
    "Daegu",
    "Suwon",
  ],
  Taiwan: ["Taipei", "Kaohsiung", "Taichung", "Tainan", "Hualien", "Jiufen"],
  China: [
    "Beijing",
    "Shanghai",
    "Guangzhou",
    "Shenzhen",
    "Chengdu",
    "Xi'an",
    "Hangzhou",
    "Sanya",
  ],
  "Hong Kong": [
    "Central",
    "Kowloon",
    "Lantau",
    "Tsim Sha Tsui",
    "Causeway Bay",
    "Mong Kok",
  ],
  Macau: ["Cotai", "Macau Peninsula", "Taipa", "Coloane"],
};

const PREFIXES = [
  "Grand",
  "Royal",
  "Boutique",
  "Imperial",
  "Central",
  "Ocean",
  "Mountain",
  "Cozy",
  "Golden",
  "Sunset",
  "Emerald",
  "Sapphire",
  "Riverside",
  "Heritage",
  "Majestic",
];
const SUFFIXES = [
  "Hotel",
  "Resort",
  "Palace",
  "Suites",
  "Retreat",
  "Lodge",
  "Inn",
  "Plaza",
  "Villas",
  "Spa & Resort",
  "Residences",
];
const BED_TYPES = [
  "1 King Bed",
  "2 Twin Beds",
  "1 Queen Bed",
  "Suite with Sea View",
];

export class MockDataGenerator {
  private static generateName(city: string): string {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    return `${prefix} ${city} ${suffix}`;
  }

  // Generates flat data for Agoda
  public static generateAgodaDatabase(hotelCountPerCity: number = 100) {
    let database: any[] = [];
    let idCounter = 1000;

    for (const [country, cities] of Object.entries(ASIA_REGIONS)) {
      for (const city of cities) {
        for (let i = 0; i < hotelCountPerCity; i++) {
          database.push({
            agoda_id: `AG-${idCounter++}`,
            property_name: this.generateName(city),
            location: city,
            country: country,
            star_rating: (Math.random() * (5.0 - 3.0) + 3.0).toFixed(1),
            nightly_rate_vnd: Math.floor(
              Math.random() * (5000000 - 800000) + 800000,
            ),
            // NEW: Realistic Availability Data
            availability: {
              rooms_left: Math.floor(Math.random() * 12) + 1,
              free_cancellation: Math.random() > 0.4,
              breakfast_included: Math.random() > 0.5,
            },
          });
        }
      }
    }
    return database;
  }

  // Generates nested data for Expedia
  public static generateExpediaDatabase(hotelCountPerCity: number = 100) {
    let database: any[] = [];
    let idCounter = 8000;

    for (const [country, cities] of Object.entries(ASIA_REGIONS)) {
      for (const city of cities) {
        for (let i = 0; i < hotelCountPerCity; i++) {
          database.push({
            internalCode: `EXP-${idCounter++}`,
            details: {
              title: this.generateName(city),
              city: city,
              country: country,
              userScore: (Math.random() * (10.0 - 6.0) + 6.0).toFixed(1),
            },
            financials: {
              price_usd: Math.floor(Math.random() * (250 - 40) + 40),
            },
            // NEW: Realistic Availability Data
            inventory: {
              is_available: true,
              max_occupancy: Math.floor(Math.random() * 3) + 2,
              bed_configuration:
                BED_TYPES[Math.floor(Math.random() * BED_TYPES.length)],
              pay_at_property: Math.random() > 0.7,
            },
          });
        }
      }
    }
    return database;
  }

  public static generateBookingDatabase(hotelCountPerCity: number = 100) {
    let database: any[] = [];
    let idCounter = 3000;
    for (const [country, cities] of Object.entries(ASIA_REGIONS)) {
      for (const city of cities) {
        for (let i = 0; i < hotelCountPerCity; i++) {
          database.push({
            b_id: `BK-${idCounter++}`,
            hotel_info: {
              name: this.generateName(city),
              city: city,
              stars: Math.floor(Math.random() * 3) + 3,
            },
            price_data: {
              amount_vnd: Math.floor(
                Math.random() * (4500000 - 900000) + 900000,
              ),
            },
            // NEW: Realistic Availability Data
            room_details: {
              room_type: "Standard Double Room",
              available_from: new Date().toISOString().split("T")[0],
              remaining_allotment: Math.floor(Math.random() * 5) + 1,
              no_prepayment_needed: Math.random() > 0.6,
            },
          });
        }
      }
    }
    return database;
  }

  public static generateTripDatabase(hotelCountPerCity: number = 100) {
    let database: any[] = [];
    let idCounter = 5000;
    for (const [country, cities] of Object.entries(ASIA_REGIONS)) {
      for (const city of cities) {
        for (let i = 0; i < hotelCountPerCity; i++) {
          database.push({
            trip_id: `TRIP-${idCounter++}`,
            name: this.generateName(city),
            location: { city: city, country: country },
            review_score: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
            price_usd: Math.floor(Math.random() * (200 - 35) + 35),
            // NEW: Realistic Availability Data
            booking_conditions: {
              instant_confirmation: true,
              refundable: Math.random() > 0.3,
              member_discount_applied: Math.random() > 0.8,
            },
          });
        }
      }
    }
    return database;
  }

  public static generateHotelsComDatabase(hotelCountPerCity: number = 100) {
    let database: any[] = [];
    let idCounter = 7000;
    for (const [country, cities] of Object.entries(ASIA_REGIONS)) {
      for (const city of cities) {
        for (let i = 0; i < hotelCountPerCity; i++) {
          database.push({
            id: `HC-${idCounter++}`,
            property_details: {
              name: this.generateName(city),
              city: city,
              rating_out_of_10: (Math.random() * (10.0 - 7.0) + 7.0).toFixed(1),
            },
            rate: {
              price_vnd: Math.floor(
                Math.random() * (5000000 - 1000000) + 1000000,
              ),
            },
            // NEW: Realistic Availability Data
            logistics: {
              check_in_time: "14:00",
              check_out_time: "12:00",
              loyalty_points_earned: Math.floor(Math.random() * 500) + 100,
              stock_status: "AVAILABLE",
            },
          });
        }
      }
    }
    return database;
  }
}
