export class MockExpediaAPI {
  // Simulates an external network request returning deeply nested data
  public async fetchExpediaProperties(locationCode: string): Promise<any> {
    console.log(`[Network] Fetching Expedia data for ${locationCode}...`);
    return {
      status: "success",
      data: {
        properties: [
          {
            internalCode: "EXP-999",
            details: { title: "Colline Hotel", city: "Da Lat", userScore: 9.2 }, // Rating out of 10!
            financials: { price_usd: 65.0 }, // Price in USD!
          },
        ],
      },
    };
  }
}
