import { TruthTable, Population, Functionality, Rules } from './containers'

export class LogicAgent{
    private _table: TruthTable;
    private _population: Population;
    private _functions: Functionality;
    private _rules: Rules;

    constructor(){
        this._table = new TruthTable();
        this._population = new Population();
        this._functions = new Functionality();
        this._rules = new Rules();
    }

    get table(){
        return this._table;
    }

    get population(){
        return this._population;
    }

    get functions(){
        return this._functions;
    }

    get rules(){
        return this._rules;
    }

    set table(input: TruthTable){
        if(input == null)
            throw new Error("Truth table cannot be null.");

        this._table = input;
    }

    set population(input: Population){
        if(input == null)
            throw new Error("Population cannot be null.");

        this._population = input;
    }

    set functions(input: Functionality){
        if(input == null)
            throw new Error("Functionality cannot be null.");

        this._functions = input;
    }

    set rules(input: Rules){
        if(input == null)
            throw new Error("Rules cannot be null.");

        this._rules = input;
    }
}