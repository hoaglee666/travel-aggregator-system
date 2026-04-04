export class MockAgodaAPI {
  // Our "In-Memory" Database for Agoda
  private agodaDatabase = [
    // Da Lat
    {
      agoda_id: "AG-101",
      property_name: "Da Lat Palace Heritage",
      location: "Da Lat",
      star_rating: 4.8,
      nightly_rate_vnd: 2500000,
    },
    {
      agoda_id: "AG-102",
      property_name: "Golf Valley Hotel",
      location: "Da Lat",
      star_rating: 4.5,
      nightly_rate_vnd: 1200000,
    },
    {
      agoda_id: "AG-103",
      property_name: "Swiss-Belresort Tuyen Lam",
      location: "Da Lat",
      star_rating: 4.6,
      nightly_rate_vnd: 1550000,
    },
    // Vung Tau
    {
      agoda_id: "AG-201",
      property_name: "The Imperial Hotel",
      location: "Vung Tau",
      star_rating: 4.7,
      nightly_rate_vnd: 2800000,
    },
    {
      agoda_id: "AG-202",
      property_name: "Pullman Vung Tau",
      location: "Vung Tau",
      star_rating: 4.5,
      nightly_rate_vnd: 2200000,
    },
    // Ho Chi Minh City
    {
      agoda_id: "AG-301",
      property_name: "Caravelle Saigon",
      location: "Ho Chi Minh",
      star_rating: 4.9,
      nightly_rate_vnd: 3500000,
    },
    {
      agoda_id: "AG-302",
      property_name: "Rex Hotel",
      location: "Ho Chi Minh",
      star_rating: 4.4,
      nightly_rate_vnd: 2000000,
    },
  ];

  public async getAgodaHotels(city: string): Promise<any[]> {
    console.log(`[Network] Fetching Agoda data for ${city}...`);

    // Simulate network delay (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter the database based on the search query (Case-insensitive)
    const results = this.agodaDatabase.filter((hotel) =>
      hotel.location.toLowerCase().includes(city.toLowerCase()),
    );

    return results;
  }
}
