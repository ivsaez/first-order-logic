import { Individual } from "../individual";

describe("Individual should", () => {
  it("create an individual", () => {
    let individual = new Individual("Individual");
    expect(individual.name).toBe("Individual");
  });

  it("throw an exception if null input", () => {
    expect(() => new Individual(null)).toThrowError();
  });

  it("throw an exception if empty input", () => {
    expect(() => new Individual("")).toThrowError();
  });

  it("throw an exception if incorrect input", () => {
    expect(() => new Individual("!·$%&/()=1235")).toThrowError();
  });

  it("throw an exception if variables input", () => {
    expect(() => new Individual("x")).toThrowError();
    expect(() => new Individual("y")).toThrowError();
  });

  it("detect equals", () => {
    let individual = new Individual("Individual");
    let individual2 = new Individual("Individual");
    let individual3 = new Individual("Other");

    expect(individual.equals(individual2)).toBe(true);
    expect(individual.equals(individual3)).toBe(false);
    expect(individual.equals(undefined)).toBe(false);
    expect(individual.equals(null)).toBe(false);
  });

  it("show correct toString", () => {
    let individual = new Individual("Individual");
    expect(individual.toString()).toBe("Individual");
  });
});