import { MockDataGenerator } from "../utils/MockDataGenerator";

export class MockExpediaAPI {
  private expediaDatabase = MockDataGenerator.generateExpediaDatabase();

  public async fetchExpediaProperties(locationCode: string): Promise<any> {
    console.log(`[Network] Fetching Expedia data for ${locationCode}...`);
    await new Promise((resolve) => setTimeout(resolve, 400)); // Lowered delay

    const filteredProperties = this.expediaDatabase.filter((prop) =>
      prop.details.city.toLowerCase().includes(locationCode.toLowerCase()),
    );

    return { status: "success", data: { properties: filteredProperties } };
  }
}
