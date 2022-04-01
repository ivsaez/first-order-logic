import { Axiom } from "../axiom";
import { Individual, Sentence, Function, Cardinality } from "../basis";
import { Rules, Population, TruthTable } from "../containers";
import { modusPonens } from "../reasoners";
import { FormulableNegateOperation } from "../operations";

let rules: Rules;
let population: Population;
let table: TruthTable;
let goku: Individual;
let vegeta: Individual;
let gohan: Individual;
let chichi: Individual;

describe("Modus ponens should", () => {
    beforeEach(() => {
        rules = new Rules();
        population = new Population();
        table = new TruthTable();
        goku = new Individual("goku");
        vegeta = new Individual("vegeta");
        gohan = new Individual("gohan");
        chichi = new Individual("chichi");
    });

    it("throw exception if wrong input", () => {
        expect(() => modusPonens(null, population, table, [])).toThrowError();
        expect(() => modusPonens(rules, null, table, [])).toThrowError();
        expect(() => modusPonens(rules, population, null, [])).toThrowError();
        expect(() => modusPonens(rules, population, table, null)).toThrowError();
        expect(() => modusPonens(rules, population, table, [])).toThrowError();

        let oneVariableAxiom = new Axiom(
            [ new Function("A", Cardinality.One) ], 
            new Function("B", Cardinality.One));
        rules.add(oneVariableAxiom);
        expect(() => modusPonens(rules, population, table, [])).toThrowError();
    });

    it("infere single premise axiom without variables", () =>{
        let premise = new Function("A", Cardinality.None);
        let conclusion = new Function("B", Cardinality.None);

        table.add(new Sentence(premise));

        rules.add(new Axiom([premise], conclusion));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(1);
        expect(result.added[0].equals(new Sentence(conclusion))).toBe(true);
    });

    it("infere single premise axiom without combined variables", () =>{
        let premise1 = new Function("Moon", Cardinality.None);
        let premise2 = new Function("Sayan", Cardinality.One);
        let conclusion = new Function("Monkey", Cardinality.One);

        population.add(goku);

        table.add(new Sentence(premise1));
        table.add(new Sentence(premise2, goku));

        rules.add(new Axiom([premise1, premise2], conclusion));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(1);
        expect(result.added[0].equals(new Sentence(conclusion, goku))).toBe(true);
    });

    it("infere single premise axiom with one variable", () =>{
        let premise = new Function("A", Cardinality.One);
        let conclusion = new Function("B", Cardinality.One);

        population.add(goku);

        table.add(new Sentence(premise, goku));

        rules.add(new Axiom([premise], conclusion));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(1);
        expect(result.added[0].equals(new Sentence(conclusion, goku))).toBe(true);
    });

    it("infere single premise axiom with two variables", () =>{
        let premise = new Function("A", Cardinality.Two);
        let conclusion = new Function("B", Cardinality.Two);

        population.add(goku);
        population.add(vegeta);

        table.add(new Sentence(premise, goku, vegeta));

        rules.add(new Axiom([premise], conclusion));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(1);
        expect(result.added[0].equals(new Sentence(conclusion, goku, vegeta))).toBe(true);
    });

    it("infere two premises axiom with two variables", () =>{
        let premise1 = new Function("A", Cardinality.Two);
        let premise2 = new Function("B", Cardinality.Two);
        let conclusion = new Function("C", Cardinality.Two);

        population.add(goku);
        population.add(vegeta);

        table.add(new Sentence(premise1, goku, vegeta));
        table.add(new Sentence(premise2, goku, vegeta));

        rules.add(new Axiom([premise1, premise2], conclusion));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(1);
        expect(result.added[0].equals(new Sentence(conclusion, goku, vegeta))).toBe(true);
    });

    it("infere two premises axiom with two variables using added", () =>{
        let premise1 = new Function("A", Cardinality.Two);
        let premise2 = new Function("B", Cardinality.Two);
        let conclusion = new Function("C", Cardinality.Two);

        population.add(goku);
        population.add(vegeta);

        table.add(new Sentence(premise1, goku, vegeta));

        rules.add(new Axiom([premise1, premise2], conclusion));

        var result = modusPonens(rules, population, table, [ new Sentence(premise2, goku, vegeta) ]);

        expect(result.count).toBe(2);
        expect(result.added[1].equals(new Sentence(conclusion, goku, vegeta))).toBe(true);
    });

    it("infere two premises axiom with mixed variables", () =>{
        let premise1 = new Function("Son", Cardinality.Two, "x", "z");
        let premise2 = new Function("Lovers", Cardinality.Two, "x", "y");
        let conclusion = new Function("Son", Cardinality.Two, "y", "z");

        population.add(goku);
        population.add(gohan);
        population.add(chichi);

        table.add(new Sentence(premise1, goku, gohan));
        table.add(new Sentence(premise2, goku, chichi));

        rules.add(new Axiom([premise1, premise2], conclusion));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(1);
        expect(result.added[0].equals(new Sentence(conclusion, chichi, gohan))).toBe(true);
    });

    it("infere two axioms with mixed variables", () =>{
        let premise1 = new Function("Son", Cardinality.Two, "x", "z");
        let premise2 = new Function("Lovers", Cardinality.Two, "x", "y");
        let conclusion1 = new Function("Son", Cardinality.Two, "y", "z");
        let conclusion2 = new Function("Parent", Cardinality.One, "x");

        population.add(goku);
        population.add(gohan);
        population.add(chichi);

        table.add(new Sentence(premise1, goku, gohan));
        table.add(new Sentence(premise2, goku, chichi));

        rules.add(new Axiom([premise1, premise2], conclusion1));
        rules.add(new Axiom([premise1], conclusion2));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(3);
        expect(result.added[0].equals(new Sentence(conclusion1, chichi, gohan))).toBe(true);
        expect(result.added[1].equals(new Sentence(conclusion2, goku))).toBe(true);
        expect(result.added[2].equals(new Sentence(conclusion2, chichi))).toBe(true);
    });

    it("infere single premise axiom with one variable negated", () =>{
        let premise = new Function("A", Cardinality.One);
        let conclusion = new Function("B", Cardinality.One);

        population.add(goku);

        table.add(new Sentence(premise, goku));
        table.add(new Sentence(conclusion, goku));

        rules.add(new Axiom([premise], new FormulableNegateOperation(conclusion)));

        var result = modusPonens(rules, population, table, []);

        expect(result.count).toBe(1);
        expect(result.removed[0].equals(new Sentence(conclusion, goku))).toBe(true);
    });

    it("infere single premise axiom with opposite negated", () =>{
        let premise1 = new Function("A", Cardinality.One);
        let premise2 = new Function("B", Cardinality.One);

        population.add(goku);

        table.add(new Sentence(premise1, goku));

        rules.add(new Axiom([premise1], new FormulableNegateOperation(premise2)));
        rules.add(new Axiom([premise2], new FormulableNegateOperation(premise1)));

        var result = modusPonens(rules, population, table, [ new Sentence(premise2, goku) ]);

        expect(result.count).toBe(2);
        expect(result.added[0].equals(new Sentence(premise2, goku))).toBe(true);
        expect(result.removed[0].equals(new Sentence(premise1, goku))).toBe(true);
    });
});