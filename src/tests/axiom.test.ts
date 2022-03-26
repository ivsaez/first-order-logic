import { FormulableAndOperation, FormulableImplicationOperation } from "..";
import { Axiom } from "../axiom";
import { Cardinality, Function } from "../function";

let funcA: Function;
let funcB: Function;
let funcC: Function;

describe("Axiom should", () => {
    beforeEach(() => {
        funcA = new Function("A", Cardinality.None);
        funcB = new Function("B", Cardinality.None);
        funcC = new Function("C", Cardinality.None);
    });

    it("throw exception if invalid input", () => {
        expect(() => new Axiom(null, new Function("A", Cardinality.None))).toThrowError();
        expect(() => new Axiom([], new Function("A", Cardinality.None))).toThrowError();
        expect(() => new Axiom([ new Function("A", Cardinality.None) ], null)).toThrowError();

        expect(() => new Axiom([ 
            new Function("A", Cardinality.One, "x"),
            new Function("B", Cardinality.One, "y") 
        ], new Function("C", Cardinality.One, "z"))).toThrowError();
    });

    it("create a new instance", () => {
        let axiom = new Axiom([ funcA, funcB ], funcC);

        expect(axiom.premises.length).toBe(2);
        expect((axiom.premises[0]  as Function).equals(funcA)).toBe(true);
        expect((axiom.premises[1]  as Function).equals(funcB)).toBe(true);
        expect((axiom.conclusion  as Function).equals(funcC)).toBe(true);
    });

    it("create a new instance with right variables", () => {
        let axiom = new Axiom([
            new Function("A", Cardinality.Two, "x", "y"),
            new Function("B", Cardinality.Two, "y", "z")
        ],
        new Function("C", Cardinality.Two, "x", "z"));

        expect(axiom.premises.length).toBe(2);
        expect((axiom.premises[0]  as Function).equals(new Function("A", Cardinality.Two, "x", "y"))).toBe(true);
        expect((axiom.premises[1]  as Function).equals(new Function("B", Cardinality.Two, "y", "z"))).toBe(true);
        expect((axiom.conclusion  as Function).equals(new Function("C", Cardinality.Two, "x", "z"))).toBe(true);
    });

    it("be represented with a string", () => {
        let axiom = new Axiom([ funcA, funcB ], funcC);

        expect(axiom.toString()).toBe("(A) & (B) > C");
    });

    it("create AND separated premises", () => {
        let axiom = new Axiom([ funcA, funcB ], funcC);

        let expectedPremise = new FormulableAndOperation(funcA, funcB);

        expect(axiom.premise.toString()).toBe(expectedPremise.toString());
    });

    it("return a formulable version", () => {
        let axiom = new Axiom([ funcA, funcB ], funcC);

        let expectedFormulable = new FormulableImplicationOperation(
            new FormulableAndOperation(funcA, funcB),
            funcC);

        expect(axiom.formulable.toString()).toBe(expectedFormulable.toString());
    });

    it("calculate equal axiom", () => {
        let axiom = new Axiom([ funcA, funcB ], funcC);
        let axiom2 = new Axiom([ funcA, funcB ], funcC);
        let axiom3 = new Axiom([ funcA, funcC ], funcB);

        expect(axiom.equals(axiom2)).toBe(true);
        expect(axiom.equals(axiom3)).toBe(false);
    });
});