export class MockAgodaAPI {
  // Simulates an external network request returning flat data
  public async getAgodaHotels(city: string): Promise<any[]> {
    console.log(`[Network] Fetching Agoda data for ${city}...`);
    return [
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
    ];
  }
}
