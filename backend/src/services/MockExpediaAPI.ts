export class MockExpediaAPI {
  // Our "In-Memory" Database for Expedia
  private expediaDatabase = [
    // Da Lat
    {
      internalCode: "EXP-801",
      details: { title: "Colline Hotel", city: "Da Lat", userScore: 9.2 },
      financials: { price_usd: 65.0 },
    },
    {
      internalCode: "EXP-802",
      details: {
        title: "Mercure Dalat Resort",
        city: "Da Lat",
        userScore: 9.0,
      },
      financials: { price_usd: 80.0 },
    },
    // Vung Tau
    {
      internalCode: "EXP-901",
      details: { title: "Malibu Hotel", city: "Vung Tau", userScore: 8.8 },
      financials: { price_usd: 55.0 },
    },
    {
      internalCode: "EXP-902",
      details: {
        title: "Vias Hotel Vung Tau",
        city: "Vung Tau",
        userScore: 9.1,
      },
      financials: { price_usd: 70.0 },
    },
    // Ho Chi Minh City
    {
      internalCode: "EXP-701",
      details: {
        title: "Vinpearl Landmark 81",
        city: "Ho Chi Minh",
        userScore: 9.5,
      },
      financials: { price_usd: 120.0 },
    },
    {
      internalCode: "EXP-702",
      details: {
        title: "Hotel Majestic Saigon",
        city: "Ho Chi Minh",
        userScore: 8.9,
      },
      financials: { price_usd: 90.0 },
    },
  ];

  public async fetchExpediaProperties(locationCode: string): Promise<any> {
    console.log(`[Network] Fetching Expedia data for ${locationCode}...`);

    // Simulate network delay (800ms to mimic a slower API)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Filter the database
    const filteredProperties = this.expediaDatabase.filter((prop) =>
      prop.details.city.toLowerCase().includes(locationCode.toLowerCase()),
    );

    // Wrap the results in the messy structure Expedia normally uses
    return {
      status: "success",
      data: {
        properties: filteredProperties,
      },
    };
  }
}
