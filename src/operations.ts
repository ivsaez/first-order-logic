import { TruthTable } from "./containers";
import { IEvaluable, IEvaluableNode, IFormulableNode, IStringable } from "./interfaces";
import { Mappings } from "./mappings";

type UnaryOperation = (a: boolean) => boolean;
type BinaryOperation = (a: boolean, b: boolean) => boolean;
type UnaryFormulation = (a: IEvaluable) => IEvaluable;
type BinaryFormulation = (a: IEvaluable, b: IEvaluable) => IEvaluable;

const NegateSymbol: string = "¬";
const AndSymbol: string = "&";
const OrSymbol: string = "|";
const ImplicationSymbol: string = ">";
const EquivalenceSymbol: string = "=";

const unaryToString = (symbol: string, a: IStringable) => 
    `${symbol}(${a.toString()})`;
const binaryToString = (symbol: string, a: IStringable, b: IStringable) => 
    `(${a.toString()} ${symbol} ${b.toString()})`;

abstract class EvaluableUnaryOperation implements IEvaluableNode
{
    private _operation: UnaryOperation;
    private _symbol: string;

    protected _operand: IEvaluableNode;

    constructor(symbol: string, operand: IEvaluableNode, operation: UnaryOperation){
        if(symbol == null)
            throw new Error("Symbol cannot be null");
        
        if(operand == null)
            throw new Error("Operand cannot be null");
        
        if(operation == null)
            throw new Error("Operation cannot be null");

        this._symbol = symbol;
        this._operand = operand;
        this._operation = operation;
    }

    get operand(){
        return this._operand;
    }

    evaluate(truthTable: TruthTable): boolean {
        return this._operation(this._operand.evaluate(truthTable));
    }

    toString(): string {
        return unaryToString(this._symbol, this._operand);
    }
}

abstract class EvaluableBinaryOperation implements IEvaluableNode
{
    private _operation: BinaryOperation;
    private _symbol: string;

    protected _operand: IEvaluableNode;
    protected _secondOperand: IEvaluableNode;

    constructor(symbol: string, operand: IEvaluableNode, secondOperand: IEvaluableNode, operation: BinaryOperation){
        if(symbol == null)
            throw new Error("Symbol cannot be null");
        
        if(operand == null)
            throw new Error("Operand cannot be null");
        
        if(secondOperand == null)
            throw new Error("Second operand cannot be null");
        
        if(operation == null)
            throw new Error("Operation cannot be null");

        this._symbol = symbol;
        this._operand = operand;
        this._secondOperand = secondOperand;
        this._operation = operation;
    }

    get operand(){
        return this._operand;
    }

    get secondOperand(){
        return this._secondOperand;
    }

    evaluate(truthTable: TruthTable): boolean {
        return this._operation(this._operand.evaluate(truthTable), this._secondOperand.evaluate(truthTable));
    }

    toString(): string {
        return binaryToString(this._symbol, this._operand, this._secondOperand);
    }
}

export class EvaluableNegateOperation extends EvaluableUnaryOperation{
    constructor(operand: IEvaluableNode){
        super(NegateSymbol, operand, (a) => !a);
    }
}

export class EvaluableAndOperation extends EvaluableBinaryOperation{
    constructor(operand: IEvaluableNode, secondOperand: IEvaluableNode){
        super(AndSymbol, operand, secondOperand, (a, b) => a && b);
    }
}

export class EvaluableOrOperation extends EvaluableBinaryOperation{
    constructor(operand: IEvaluableNode, secondOperand: IEvaluableNode){
        super(OrSymbol, operand, secondOperand, (a, b) => a || b);
    }
}

export class EvaluableImplicationOperation extends EvaluableBinaryOperation{
    constructor(operand: IEvaluableNode, secondOperand: IEvaluableNode){
        super(ImplicationSymbol, operand, secondOperand, (a, b) => !a || b);
    }
}

export class EvaluableEquivalenceOperation extends EvaluableBinaryOperation{
    constructor(operand: IEvaluableNode, secondOperand: IEvaluableNode){
        super(EquivalenceSymbol, operand, secondOperand, (a, b) => a === b);
    }
}

abstract class FormulableUnaryOperation implements IFormulableNode
{
    private _symbol: string;
    private _operation: UnaryFormulation;

    protected _operand: IFormulableNode;

    constructor(symbol: string, operand: IFormulableNode, operation: UnaryFormulation){
        if(symbol == null)
            throw new Error("Symbol cannot be null");
        
        if(operand == null)
            throw new Error("Operand cannot be null");
        
        if(operation == null)
            throw new Error("Operation cannot be null");

        this._symbol = symbol;
        this._operand = operand;
        this._operation = operation;
    }

    get operand(){
        return this._operand;
    }

    get variables(): string[] {
        return this._operand.variables;    
    }

    formulate(mappings: Mappings): IEvaluable {
        return this._operation(this._operand.formulate(mappings));
    }

    toString(): string {
        return unaryToString(this._symbol, this._operand);
    }
}

abstract class FormulableBinaryOperation implements IFormulableNode
{
    private _symbol: string;
    private _operation: BinaryFormulation;

    protected _operand: IFormulableNode;
    protected _secondOperand: IFormulableNode;

    constructor(symbol: string, operand: IFormulableNode, secondOperand: IFormulableNode, operation: BinaryFormulation){
        if(symbol == null)
            throw new Error("Symbol cannot be null");
        
        if(operand == null)
            throw new Error("Operand cannot be null");

        if(secondOperand == null)
            throw new Error("Second operand cannot be null");
        
        if(operation == null)
            throw new Error("Operation cannot be null");

        this._symbol = symbol;
        this._operand = operand;
        this._secondOperand = secondOperand;
        this._operation = operation;
    }

    get operand(){
        return this._operand;
    }

    get secondOperand(){
        return this._secondOperand;
    }

    get variables(): string[] {
        let variablesSet = new Set<string>([ 
            ...this._operand.variables, 
            ...this._secondOperand.variables ]);
        return [ ...variablesSet ];    
    }

    formulate(mappings: Mappings): IEvaluable {
        return this._operation(this._operand.formulate(mappings), this._secondOperand.formulate(mappings));
    }

    toString(): string {
        return binaryToString(this._symbol, this._operand, this._secondOperand);
    }
}

export class FormulableNegateOperation extends FormulableUnaryOperation
{
    constructor(operand: IFormulableNode){
        super(NegateSymbol, operand, a => new EvaluableNegateOperation(a));
    }
}

export class FormulableAndOperation extends FormulableBinaryOperation
{
    constructor(operand: IFormulableNode, secondOperand: IFormulableNode){
        super(AndSymbol, operand, secondOperand, (a, b) => new EvaluableAndOperation(a, b));
    }
}

export class FormulableOrOperation extends FormulableBinaryOperation
{
    constructor(operand: IFormulableNode, secondOperand: IFormulableNode){
        super(OrSymbol, operand, secondOperand, (a, b) => new EvaluableOrOperation(a, b));
    }
}

export class FormulableImplicationOperation extends FormulableBinaryOperation
{
    constructor(operand: IFormulableNode, secondOperand: IFormulableNode){
        super(ImplicationSymbol, operand, secondOperand, (a, b) => new EvaluableImplicationOperation(a, b));
    }
}

export class FormulableEquivalenceOperation extends FormulableBinaryOperation
{
    constructor(operand: IFormulableNode, secondOperand: IFormulableNode){
        super(EquivalenceSymbol, operand, secondOperand, (a, b) => new EvaluableEquivalenceOperation(a, b));
    }
}