import { Sentence } from "../sentence";
import { Cardinality, Function } from "../function";
import { 
    EvaluableNegateOperation,
    EvaluableAndOperation,
    EvaluableImplicationOperation,
    EvaluableOrOperation,
    EvaluableEquivalenceOperation,
    FormulableNegateOperation,
    FormulableAndOperation,
    FormulableOrOperation,
    FormulableImplicationOperation,
    FormulableEquivalenceOperation
} from "../operations";
import { Mappings } from "../mappings";
import { TruthTable } from "../containers";

let funcA: Function;
let funcB: Function;
let sentenceA: Sentence;
let sentenceB: Sentence;

let negateEvaluableOperation: EvaluableNegateOperation;
let negateFormulableOperation: FormulableNegateOperation;
let andEvaluableOperation: EvaluableAndOperation;
let andFormulableOperation: FormulableAndOperation;
let orEvaluableOperation: EvaluableOrOperation;
let orFormulableOperation: FormulableOrOperation;
let implicationEvaluableOperation: EvaluableImplicationOperation;
let implicationFormulableOperation: FormulableImplicationOperation;
let equivalenceEvaluableOperation: EvaluableEquivalenceOperation;
let equivalenceFormulableOperation: FormulableEquivalenceOperation;

let mappings: Mappings;
let table: TruthTable;

describe("Operations should", () => {
    beforeEach(() => {
        funcA = new Function("A", Cardinality.None);
        funcB = new Function("B", Cardinality.None);
        sentenceA = Sentence.build("A");
        sentenceB = Sentence.build("B");

        negateEvaluableOperation = new EvaluableNegateOperation(sentenceA);
        negateFormulableOperation = new FormulableNegateOperation(funcA);
        andEvaluableOperation = new EvaluableAndOperation(sentenceA, sentenceB);
        andFormulableOperation = new FormulableAndOperation(funcA, funcB);
        orEvaluableOperation = new EvaluableOrOperation(sentenceA, sentenceB);
        orFormulableOperation = new FormulableOrOperation(funcA, funcB);
        implicationEvaluableOperation = new EvaluableImplicationOperation(sentenceA, sentenceB);
        implicationFormulableOperation = new FormulableImplicationOperation(funcA, funcB);
        equivalenceEvaluableOperation = new EvaluableEquivalenceOperation(sentenceA, sentenceB);
        equivalenceFormulableOperation = new FormulableEquivalenceOperation(funcA, funcB);

        mappings = new Mappings();
        table = new TruthTable();
    });

    it("throw exception when creating with invalid input", () => {
        expect(() => new EvaluableNegateOperation(null)).toThrowError();
        expect(() => new FormulableNegateOperation(null)).toThrowError();
        expect(() => new EvaluableAndOperation(null, sentenceA)).toThrowError();
        expect(() => new EvaluableAndOperation(sentenceA, null)).toThrowError();
        expect(() => new FormulableAndOperation(null, funcA)).toThrowError();
        expect(() => new FormulableAndOperation(funcA, null)).toThrowError();
        expect(() => new EvaluableOrOperation(null, sentenceA)).toThrowError();
        expect(() => new EvaluableOrOperation(sentenceA, null)).toThrowError();
        expect(() => new FormulableOrOperation(null, funcA)).toThrowError();
        expect(() => new FormulableOrOperation(funcA, null)).toThrowError();
        expect(() => new EvaluableImplicationOperation(null, sentenceA)).toThrowError();
        expect(() => new EvaluableImplicationOperation(sentenceA, null)).toThrowError();
        expect(() => new FormulableImplicationOperation(null, funcA)).toThrowError();
        expect(() => new FormulableImplicationOperation(funcA, null)).toThrowError();
        expect(() => new EvaluableEquivalenceOperation(null, sentenceA)).toThrowError();
        expect(() => new EvaluableEquivalenceOperation(sentenceA, null)).toThrowError();
        expect(() => new FormulableEquivalenceOperation(null, funcA)).toThrowError();
        expect(() => new FormulableEquivalenceOperation(funcA, null)).toThrowError();
    });

    it("have right string representation", () => {
        expect(negateEvaluableOperation.toString()).toBe("¬(A)");
        expect(negateFormulableOperation.toString()).toBe("¬(A)");
        expect(andEvaluableOperation.toString()).toBe("(A & B)");
        expect(andFormulableOperation.toString()).toBe("(A & B)");
        expect(orEvaluableOperation.toString()).toBe("(A | B)");
        expect(orFormulableOperation.toString()).toBe("(A | B)");
        expect(implicationEvaluableOperation.toString()).toBe("(A > B)");
        expect(implicationFormulableOperation.toString()).toBe("(A > B)");
        expect(equivalenceEvaluableOperation.toString()).toBe("(A = B)");
        expect(equivalenceFormulableOperation.toString()).toBe("(A = B)");
    });

    it("evaluate negate operation", () => {
        expect(negateEvaluableOperation.evaluate(table)).toBe(true);  
        table.add(sentenceA);
        expect(negateEvaluableOperation.evaluate(table)).toBe(false);
    });

    it("evaluate and operation", () => {
        expect(andEvaluableOperation.evaluate(table)).toBe(false);  
        table.add(sentenceA);
        expect(andEvaluableOperation.evaluate(table)).toBe(false);
        table.add(sentenceB);
        expect(andEvaluableOperation.evaluate(table)).toBe(true);
        table.remove(sentenceA);
        expect(andEvaluableOperation.evaluate(table)).toBe(false);
    });

    it("evaluate or operation", () => {
        expect(orEvaluableOperation.evaluate(table)).toBe(false);  
        table.add(sentenceA);
        expect(orEvaluableOperation.evaluate(table)).toBe(true);
        table.add(sentenceB);
        expect(orEvaluableOperation.evaluate(table)).toBe(true);
        table.remove(sentenceA);
        expect(orEvaluableOperation.evaluate(table)).toBe(true);
    });

    it("evaluate implication operation", () => {
        expect(implicationEvaluableOperation.evaluate(table)).toBe(true);  
        table.add(sentenceA);
        expect(implicationEvaluableOperation.evaluate(table)).toBe(false);
        table.add(sentenceB);
        expect(implicationEvaluableOperation.evaluate(table)).toBe(true);
        table.remove(sentenceA);
        expect(implicationEvaluableOperation.evaluate(table)).toBe(true);
    });

    it("evaluate equivalence operation", () => {
        expect(equivalenceEvaluableOperation.evaluate(table)).toBe(true);  
        table.add(sentenceA);
        expect(equivalenceEvaluableOperation.evaluate(table)).toBe(false);
        table.add(sentenceB);
        expect(equivalenceEvaluableOperation.evaluate(table)).toBe(true);
        table.remove(sentenceA);
        expect(equivalenceEvaluableOperation.evaluate(table)).toBe(false);
    });

    it("formulate negate operation", () => {
        let formulation = negateFormulableOperation.formulate(mappings) as EvaluableNegateOperation;
        let operand = formulation.operand as Sentence;
        expect(operand.equals(sentenceA));
    });

    it("formulate and operation", () => {
        let formulation = andFormulableOperation.formulate(mappings) as EvaluableAndOperation;
        let operand = formulation.operand as Sentence;
        let secondOperand = formulation.secondOperand as Sentence;
        expect(operand.equals(sentenceA));
        expect(secondOperand.equals(sentenceB));
    });

    it("formulate or operation", () => {
        let formulation = orFormulableOperation.formulate(mappings) as EvaluableOrOperation;
        let operand = formulation.operand as Sentence;
        let secondOperand = formulation.secondOperand as Sentence;
        expect(operand.equals(sentenceA));
        expect(secondOperand.equals(sentenceB));
    });

    it("formulate implication operation", () => {
        let formulation = implicationFormulableOperation.formulate(mappings) as EvaluableImplicationOperation;
        let operand = formulation.operand as Sentence;
        let secondOperand = formulation.secondOperand as Sentence;
        expect(operand.equals(sentenceA));
        expect(secondOperand.equals(sentenceB));
    });

    it("formulate equivalence operation", () => {
        let formulation = equivalenceFormulableOperation.formulate(mappings) as EvaluableEquivalenceOperation;
        let operand = formulation.operand as Sentence;
        let secondOperand = formulation.secondOperand as Sentence;
        expect(operand.equals(sentenceA));
        expect(secondOperand.equals(sentenceB));
    });
});