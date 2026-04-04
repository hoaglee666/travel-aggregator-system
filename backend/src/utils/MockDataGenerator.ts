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

export class MockDataGenerator {
  private static generateName(city: string): string {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    return `${prefix} ${city} ${suffix}`;
  }

  // Generates flat data for Agoda
  public static generateAgodaDatabase(hotelCountPerCity: number = 5) {
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
            star_rating: (Math.random() * (5.0 - 3.0) + 3.0).toFixed(1), // Random rating 3.0 - 5.0
            nightly_rate_vnd: Math.floor(
              Math.random() * (5000000 - 800000) + 800000,
            ), // 800k to 5m VND
          });
        }
      }
    }
    return database;
  }

  // Generates nested data for Expedia
  public static generateExpediaDatabase(hotelCountPerCity: number = 5) {
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
              userScore: (Math.random() * (10.0 - 6.0) + 6.0).toFixed(1), // 6.0 to 10.0 rating
            },
            financials: {
              price_usd: Math.floor(Math.random() * (250 - 40) + 40), // $40 to $250 USD
            },
          });
        }
      }
    }
    return database;
  }
}
