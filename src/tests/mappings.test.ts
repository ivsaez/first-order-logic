import { Individual } from "../individual";
import { Mappings } from "../mappings";

let mappings: Mappings = null;

describe("Mappings should", () => {
    beforeEach(() => {
        mappings = new Mappings();
    });

    it("throw exception if adding invalid variable", () => {
        expect(() => mappings.addVariable(null)).toThrowError();
        expect(() => mappings.addVariable("")).toThrowError();

        mappings.addVariable("x");
        expect(() => mappings.addVariable("x")).toThrowError();
    });

    it("throw exception if checking invalid variable", () => {
        expect(() => mappings.hasVariable(null)).toThrowError();
        expect(() => mappings.hasVariable("")).toThrowError();
    });

    it("add single variables", () => {
        mappings.addVariable("x");
        mappings.addVariable("y");

        expect(mappings.variables.length).toBe(2);
        expect(mappings.variables[0]).toBe("x");
        expect(mappings.variables[1]).toBe("y");
    });

    it("throw exception if adding invalid variables", () => {
        expect(() => mappings.addVariables(null)).toThrowError();
        expect(() => mappings.addVariables([])).toThrowError();
        expect(() => mappings.addVariables([ null ])).toThrowError();
        expect(() => mappings.addVariables([ "" ])).toThrowError();
    });

    it("add variables", () => {
        mappings.addVariables([ "x", "y" ]);

        expect(mappings.variables.length).toBe(2);
        expect(mappings.variables[0]).toBe("x");
        expect(mappings.variables[1]).toBe("y");
    });

    it("throw exception if mapping invalid variables or individuals", () => {
        expect(() => mappings.map(null, new Individual("A"))).toThrowError();
        expect(() => mappings.map("", new Individual("A"))).toThrowError();
        expect(() => mappings.map("x", new Individual("A"))).toThrowError();
        expect(() => mappings.mapNext(null)).toThrowError();
    });

    it("throw exception if obtaining wrong mappings", () => {
        expect(() => mappings.mapping(null)).toThrowError();
        expect(() => mappings.mapping("")).toThrowError();
        expect(() => mappings.mapping("x")).toThrowError();
    });

    it("throw exception when asking for a mapping with wrong data", () => {
        expect(() => mappings.hasMapping(null)).toThrowError();
        expect(() => mappings.hasMapping("")).toThrowError();
    });

    it("map variables", () => {
        mappings.addVariables([ "x", "y", "z" ]);
        mappings.map("x", new Individual("A"));
        mappings.map("y", new Individual("B"));

        expect(mappings.mapping("x").equals(new Individual("A"))).toBe(true);
        expect(mappings.mapping("y").equals(new Individual("B"))).toBe(true);
        expect(mappings.hasMapping("x")).toBe(true);
        expect(mappings.hasMapping("y")).toBe(true);
        expect(mappings.hasMapping("z")).toBe(false);
        expect(mappings.hasAllVariablesMapped).toBe(false);

        mappings.mapNext(new Individual("C"));
        expect(mappings.mapping("z").equals(new Individual("C"))).toBe(true);
        expect(mappings.hasMapping("z")).toBe(true);
        expect(mappings.hasAllVariablesMapped).toBe(true);
        
        expect(() => mappings.mapNext(new Individual("D"))).toThrowError();
    });

    it("throw exception if removing variables wrongly", () => {
        expect(() => mappings.removeVariable(null)).toThrowError();
        expect(() => mappings.removeVariable("")).toThrowError();
        expect(() => mappings.removeVariable("x")).toThrowError();
    });

    it("remove a variable", () => {
        mappings.addVariables([ "x", "y", "z" ]);

        mappings.removeVariable("y");

        expect(mappings.variables.length).toBe(2);
        expect(mappings.variables[0]).toBe("x");
        expect(mappings.variables[1]).toBe("z");
    });

    it("throw exception if removing mapping wrongly", () => {
        expect(() => mappings.removeMapping(null)).toThrowError();
        expect(() => mappings.removeMapping("")).toThrowError();
        expect(() => mappings.removeMapping("x")).toThrowError();
    });

    it("remove a mapping", () => {
        mappings.addVariables([ "x", "y" ]);

        mappings.map("x", new Individual("A"));
        mappings.map("y", new Individual("B"));

        expect(mappings.hasAllVariablesMapped).toBe(true);

        mappings.removeMapping("y");

        expect(mappings.hasAllVariablesMapped).toBe(false);
        expect(mappings.mapping("y")).toBe(null);
    });

    it("throw exception if removing individual wrongly", () => {
        expect(() => mappings.removeIndividual(null)).toThrowError();
        expect(() => mappings.removeIndividual(new Individual("A"))).toThrowError();
    });

    it("remove an individual", () => {
        mappings.addVariables([ "x", "y" ]);

        mappings.map("x", new Individual("A"));
        mappings.map("y", new Individual("B"));

        expect(mappings.hasAllVariablesMapped).toBe(true);
        expect(mappings.hasIndividual(new Individual("A"))).toBe(true);
        expect(mappings.hasIndividual(new Individual("B"))).toBe(true);

        mappings.removeIndividual(new Individual("B"));

        expect(mappings.hasAllVariablesMapped).toBe(false);
        expect(mappings.mapping("y")).toBe(null);
        expect(mappings.hasIndividual(new Individual("B"))).toBe(false);
    });

    it("throw exception if calling has individual wrongly", () => {
        expect(() => mappings.hasIndividual(null)).toThrowError();
    });

    it("copy itself", () => {
        mappings.addVariables([ "x", "y" ]);

        mappings.map("x", new Individual("A"));
        mappings.map("y", new Individual("B"));

        let copy = mappings.copy();

        expect(mappings.mapping("x").equals(new Individual("A"))).toBe(true);
        expect(mappings.mapping("y").equals(new Individual("B"))).toBe(true);
    });
});