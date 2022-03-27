import { FormulableAndOperation, Sentence } from "..";
import { Population, TruthTable } from "../containers";
import { Cardinality, Function } from "../function";
import { Individual } from "../individual";
import { universalQuantifier, existencialQuantifier } from "../quantifiers";

let funcA: Function;
let population: Population;
let table: TruthTable;
let goku: Individual;
let vegeta: Individual;
let gohan: Individual;
let chichi: Individual;
let freezer: Individual;

function initializeTests(){
    funcA = new Function("A", Cardinality.One);
    population = new Population();
    table = new TruthTable();
    goku = new Individual("goku");
    vegeta = new Individual("vegeta");
    gohan = new Individual("gohan");
    chichi = new Individual("chichi");
    freezer = new Individual("freezer");
}

describe("Universal quantifier should", () => {
    beforeEach(() => initializeTests());

    it("throw exception when called with invalid parameters", () => {
        expect(() => universalQuantifier(null, funcA, population, table)).toThrowError();
        expect(() => universalQuantifier(funcA, null, population, table)).toThrowError();
        expect(() => universalQuantifier(funcA, funcA, null, table)).toThrowError();
        expect(() => universalQuantifier(funcA, funcA, population, null)).toThrowError();
        expect(() => universalQuantifier(funcA, funcA, population, table)).toThrowError();
        expect(() => universalQuantifier(new Function("A", Cardinality.None), funcA, population, table)).toThrowError();
        expect(() => universalQuantifier(funcA, new Function("A", Cardinality.None), population, table)).toThrowError();
    });

    it("calculate with one variable", () => {
        population.add(goku);
        population.add(vegeta);
        population.add(gohan);

        var premise = new Function("Premise", Cardinality.One);
        var formulable = new Function("Formulable", Cardinality.One);

        table.add(new Sentence(premise, goku));
        table.add(new Sentence(premise, vegeta));
        table.add(new Sentence(premise, gohan));

        table.add(new Sentence(formulable, goku));
        table.add(new Sentence(formulable, vegeta));

        expect(universalQuantifier(premise, formulable, population, table)).toBe(false);

        table.add(new Sentence(formulable, gohan));

        expect(universalQuantifier(premise, formulable, population, table)).toBe(true);
    });

    it("calculate with two variables", () => {
        population.add(goku);
        population.add(vegeta);
        population.add(gohan);

        var premise = new Function("Premise", Cardinality.Two);
        var formulable = new Function("Formulable", Cardinality.Two);

        table.add(new Sentence(premise, goku, vegeta));
        table.add(new Sentence(premise, goku, gohan));
        table.add(new Sentence(premise, vegeta, goku));
        table.add(new Sentence(premise, vegeta, gohan));
        table.add(new Sentence(premise, gohan, goku));
        table.add(new Sentence(premise, gohan, vegeta));

        table.add(new Sentence(formulable, goku, vegeta));
        table.add(new Sentence(formulable, goku, gohan));
        table.add(new Sentence(formulable, vegeta, goku));
        table.add(new Sentence(formulable, vegeta, gohan));
        table.add(new Sentence(formulable, gohan, goku));

        expect(universalQuantifier(premise, formulable, population, table)).toBe(false);

        table.add(new Sentence(formulable, gohan, vegeta));

        expect(universalQuantifier(premise, formulable, population, table)).toBe(true);
    });

    it("calculate with three variables", () => {
        population.add(goku);
        population.add(gohan);
        population.add(chichi);

        let son1 = new Function("Son", Cardinality.Two, "x", "y");
        let son2 = new Function("Son", Cardinality.Two, "z", "y");
        let lovers = new Function("Lovers", Cardinality.Two, "x", "z");
        
        let andOperation = new FormulableAndOperation(son1, lovers);

        table.add(new Sentence(son1, goku, gohan));
        table.add(new Sentence(son2, chichi, gohan));
        table.add(new Sentence(lovers, goku, chichi));

        expect(universalQuantifier(andOperation, son2, population, table)).toBe(true);
    });

    it("calculate with four individuals", () => {
        population.add(goku);
        population.add(gohan);
        population.add(vegeta);
        population.add(freezer);

        let good = new Function("Good", Cardinality.One, "x");
        let bad = new Function("Bad", Cardinality.One, "y");
        let enemies = new Function("Enemies", Cardinality.Two, "x", "y");
        
        let andOperation = new FormulableAndOperation(good, bad);

        table.add(new Sentence(good, goku));
        table.add(new Sentence(good, gohan));
        table.add(new Sentence(bad, vegeta));
        table.add(new Sentence(bad, freezer));
        table.add(new Sentence(enemies, goku, vegeta));
        table.add(new Sentence(enemies, gohan, vegeta));
        table.add(new Sentence(enemies, goku, freezer));

        expect(universalQuantifier(andOperation, enemies, population, table)).toBe(false);

        table.add(new Sentence(enemies, gohan, freezer));

        expect(universalQuantifier(andOperation, enemies, population, table)).toBe(true);
    });
});

describe("Existencial quantifier should", () => {
    beforeEach(() => initializeTests());

    it("throw exception when called with invalid parameters", () => {
        expect(() => existencialQuantifier(null, funcA, population, table)).toThrowError();
        expect(() => existencialQuantifier(funcA, null, population, table)).toThrowError();
        expect(() => existencialQuantifier(funcA, funcA, null, table)).toThrowError();
        expect(() => existencialQuantifier(funcA, funcA, population, null)).toThrowError();
        expect(() => existencialQuantifier(funcA, funcA, population, table)).toThrowError();
        expect(() => existencialQuantifier(new Function("A", Cardinality.None), funcA, population, table)).toThrowError();
        expect(() => existencialQuantifier(funcA, new Function("A", Cardinality.None), population, table)).toThrowError();
    });

    it("calculate with one variable", () => {
        population.add(goku);
        population.add(vegeta);
        population.add(gohan);

        var premise = new Function("Premise", Cardinality.One);
        var formulable = new Function("Formulable", Cardinality.One);

        table.add(new Sentence(premise, goku));
        table.add(new Sentence(premise, vegeta));
        table.add(new Sentence(premise, gohan));

        expect(existencialQuantifier(premise, formulable, population, table)).toBe(false);

        table.add(new Sentence(formulable, goku));

        expect(existencialQuantifier(premise, formulable, population, table)).toBe(true);
    });

    it("calculate with two variables", () => {
        population.add(goku);
        population.add(vegeta);
        population.add(gohan);

        var premise = new Function("Premise", Cardinality.Two);
        var formulable = new Function("Formulable", Cardinality.Two);

        table.add(new Sentence(premise, goku, vegeta));
        table.add(new Sentence(premise, goku, gohan));
        table.add(new Sentence(premise, vegeta, goku));
        table.add(new Sentence(premise, vegeta, gohan));
        table.add(new Sentence(premise, gohan, goku));
        table.add(new Sentence(premise, gohan, vegeta));

        expect(existencialQuantifier(premise, formulable, population, table)).toBe(false);

        table.add(new Sentence(formulable, goku, vegeta));

        expect(existencialQuantifier(premise, formulable, population, table)).toBe(true);
    });

    it("calculate with three variables", () => {
        population.add(goku);
        population.add(gohan);
        population.add(chichi);

        let son1 = new Function("Son", Cardinality.Two, "x", "y");
        let son2 = new Function("Son", Cardinality.Two, "z", "y");
        let lovers = new Function("Lovers", Cardinality.Two, "x", "z");
        
        let andOperation = new FormulableAndOperation(son1, lovers);

        table.add(new Sentence(son1, goku, gohan));
        table.add(new Sentence(son2, chichi, gohan));
        table.add(new Sentence(lovers, goku, chichi));

        expect(existencialQuantifier(andOperation, son2, population, table)).toBe(true);
    });

    it("calculate with four individuals", () => {
        population.add(goku);
        population.add(gohan);
        population.add(vegeta);
        population.add(freezer);

        let good = new Function("Good", Cardinality.One, "x");
        let bad = new Function("Bad", Cardinality.One, "y");
        let enemies = new Function("Enemies", Cardinality.Two, "x", "y");
        
        let andOperation = new FormulableAndOperation(good, bad);

        table.add(new Sentence(good, goku));
        table.add(new Sentence(good, gohan));
        table.add(new Sentence(bad, vegeta));
        table.add(new Sentence(bad, freezer));

        expect(existencialQuantifier(andOperation, enemies, population, table)).toBe(false);

        table.add(new Sentence(enemies, goku, vegeta));

        expect(existencialQuantifier(andOperation, enemies, population, table)).toBe(true);
    });
});