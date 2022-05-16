import { TextExpression, VariableExpression, FunctionExpression, SentenceExpression } from "./expressions";
import { IStringable, IEvaluable, IFormulableNode } from "./interfaces";
import { Mappings } from "./mappings";
import { Functionality, Population, TruthTable } from "./containers";

export class Individual implements IStringable{
    private _name: string;

    constructor(name: string){
        if(name == null)
            throw new Error("Name cannot be null.");
        
        if(name === "x" || name === "y")
            throw new Error("x and y are reserved names.");
        
        if(!TextExpression.test(name))
            throw new Error("Individual name only accepts letters and capital letters.");

        this._name = name;
    }

    get name(){
        return this._name;
    }

    equals(obj: Individual) : boolean { 
        if(obj == null) return false;
        return this._name === obj._name;
    }

    toString(): string{
        return this._name;
    }
}

export class Function implements IFormulableNode {
    private _name: string;
    private _cardinality: Cardinality;
    private _firstVariable: string;
    private _secondVariable: string;
    private _reflexive: boolean;

    constructor(
        name: string, 
        cardinality: Cardinality,
        firstVariable: string = "x",
        secondVariable: string = "y",
        isReflexive: boolean = false){
        
        this.validateName(name);
        this.validateVariable(firstVariable);
        this.validateVariable(secondVariable);

        if (cardinality === Cardinality.Two && firstVariable === secondVariable) 
            throw new Error("Variables must be different");

        this._name = name;
        this._cardinality = cardinality;
        this._firstVariable = (cardinality === Cardinality.One || cardinality === Cardinality.Two) 
            ? firstVariable 
            : null;
        this._secondVariable = (cardinality === Cardinality.Two) 
            ? secondVariable 
            : null;

        this.setReflexiveBasedOnCardinality(cardinality, isReflexive);
    }

    get name(){
        return this._name;
    }

    get cardinality(){
        return this._cardinality;
    }

    get firstVariable(){
        return this._firstVariable;
    }

    get secondVariable(){
        return this._secondVariable;
    }

    get isReflexive(): boolean{
        return this._reflexive;
    }

    get variables(): string[]{
        let result = [];

        if(this._cardinality === Cardinality.One)
        {
            result.push(this._firstVariable);
        }
        else if(this._cardinality === Cardinality.Two)
        {
            result.push(this._firstVariable);
            result.push(this._secondVariable);
        }

        return result;
    }

    equals(obj: Function) : boolean { 
        if(obj == null) return false;
        return this._name === obj._name
            && this._cardinality === obj._cardinality
            && this._reflexive === obj._reflexive;
    }

    toString(): string{
        switch (this._cardinality)
        {
            case Cardinality.One:
                return `${this._name}[${this._firstVariable}]`;

            case Cardinality.Two:
                return `${this._name}[${this._firstVariable},${this._secondVariable}]`;

            default:
                return this._name;
        }
    }

    formulate(mappings: Mappings): IEvaluable{
        if (this._cardinality === Cardinality.None)
        {
            return new Sentence(this);
        }
        else if (this._cardinality === Cardinality.One)
        {
            if (!mappings.hasVariable(this._firstVariable)) 
                throw new Error(`${this._firstVariable} variable is missing`);

            return new Sentence(this, mappings.mapping(this._firstVariable));
        }
        else
        {
            if (!mappings.hasVariable(this._firstVariable)) 
                throw new Error(`${this._firstVariable} variable is missing`);
            
            if (!mappings.hasVariable(this._secondVariable)) 
                throw new Error(`${this._secondVariable} variable is missing`);

            return new Sentence(
                this, 
                mappings.mapping(this._firstVariable), 
                mappings.mapping(this._secondVariable));
        }
    }

    static build(input: string): Function{
        
        if (!this.validate(input)) 
            throw new Error("Wrong function input.")

        let isReflexive: boolean = input.startsWith("~");
        input = input.replace("~", "");

        let parts = input.split('[');

        if (parts.length > 1)
        {
            let removedCorxet: string = parts[1].replace("]", "");

            if (removedCorxet.includes(","))
            {
                let subParts: string[] = removedCorxet.split(',');
                return new Function(parts[0], Cardinality.Two, subParts[0], subParts[1], isReflexive);
            }
            
            return new Function(parts[0], Cardinality.One, removedCorxet);
        }
        
        return new Function(parts[0], Cardinality.None);
    }

    static validate(input: string): boolean
    {
        if (input == null) 
            throw new Error("Input cannot be null.");

        return FunctionExpression.test(input);
    }

    private validateName(name: string): void{
        if (name == null) 
            throw new Error("Name cannot be null.");

        if(!TextExpression.test(name))
            throw new Error("Function name only accepts letters and capital letters.");
    }

    private validateVariable(variable: string): void{
        if (variable == null) 
            throw new Error("Variable cannot be null.");

        if(!VariableExpression.test(variable))
            throw new Error("Variable only accepts lowercase letters.");
    }

    private setReflexiveBasedOnCardinality(cardinality: Cardinality, isReflexive: boolean): void
    {
        if (cardinality === Cardinality.Two) this._reflexive = isReflexive;
        else this._reflexive = false;
    }
}

export enum Cardinality{
    None = 0,
    One = 1,
    Two = 2
}

export class Sentence implements IStringable, IEvaluable{
    private _function: Function;
    private _first: Individual;
    private _second: Individual;

    constructor(func: Function, first: Individual = null, second: Individual = null){
        if(func == null)
            throw new Error("Function cannot be null.");

        this._function = func;

        if(this._function.cardinality === Cardinality.One){
            if(first == null)
                throw new Error("First individual cannot be null with the specified cardinality.");
        }else if(this._function.cardinality === Cardinality.Two){
            if(first == null)
                throw new Error("First individual cannot be null with the specified cardinality.");
            
            if(second == null)
                throw new Error("Second individual cannot be null with the specified cardinality.");
            
            if(first.equals(second)){
                throw new Error("Individuals must be different.");
            }
        }else{
            if(first != null || second != null)
                throw new Error("Should not be individuals with a cardinality None function.");
        }

        this._first = first;
        this._second = second;
    }

    get function(){
        return this._function;
    }

    get first(){
        return this._first;
    }

    get second(){
        return this._second;
    }

    toString(): string{
        switch (this._function.cardinality)
        {
            case Cardinality.One:
                return `${this._function.name}[${this._first.toString()}]`;

            case Cardinality.Two:
                if(this._function.isReflexive){
                    let orderedIndividuals = [this._first.toString(), this._second.toString()].sort();
                    return `${this._function.name}[${orderedIndividuals[0]},${orderedIndividuals[1]}]`;
                }
                else{
                    return `${this._function.name}[${this._first.toString()},${this._second.toString()}]`;
                }

            default:
                return this._function.toString();
        }
    }

    equals(obj: Sentence): boolean
    {
        if (obj == null) return false;

        if (!this._function.equals(obj._function)) return false;

        if (this._function.cardinality === Cardinality.One)
            return this._first != null 
                && obj._first != null
                && this._first.equals(obj._first);

        if (this._function.cardinality === Cardinality.Two && !this._function.isReflexive)
            return this._first != null
                && obj._first != null
                && this._second != null
                && obj._second != null
                && this._first.equals(obj._first) 
                && this._second.equals(obj._second);

        if (this._function.cardinality === Cardinality.Two && this._function.isReflexive)
            return this._first != null
                && obj._first != null
                && this._second != null
                && obj._second != null
                && ((this._first.equals(obj._first) && this._second.equals(obj._second)) 
                    || (this._first.equals(obj._second) && this._second.equals(obj._first)));

        return true;
    }

    evaluate(table: TruthTable): boolean{
        return table.exists(this);
    }

    static validate(input: string): boolean
    {
        if (input == null) 
            throw new Error("Input cannot be null.");

        return SentenceExpression.test(input);
    }

    static buildStrict(input: string, population: Population, functionality: Functionality): Sentence{
        if (input == null) 
            throw new Error("Input cannot be null.");
        if (population == null) 
            throw new Error("Population cannot be null.");
        if (functionality == null) 
            throw new Error("Functionality cannot be null");

        if (!this.validate(input)) 
            throw new Error("Invalid input to create a sentence.");

        let parts = input.split('[');

        if (parts.length > 1)
        {
            var inputWithoutParenthesis = parts[1].replace("]", "");
            var subparts = inputWithoutParenthesis.split(',');

            if (subparts.length > 1)
            {
                var functionNonReflexive = new Function(parts[0], Cardinality.Two);
                var functionReflexive = new Function(parts[0], Cardinality.Two, "x", "y", true);

                if (!functionality.exists(functionNonReflexive) && !functionality.exists(functionReflexive))
                    throw new Error("Function doesn't exist.");

                var func = functionality.exists(functionNonReflexive)
                    ? functionNonReflexive
                    : functionReflexive;
                
                var individual1 = new Individual(subparts[0]);
                if (!population.exists(individual1)) 
                    throw new Error("First proposed individual doesn't exist.");

                var individual2 = new Individual(subparts[1]);
                if (!population.exists(individual2)) 
                    throw new Error("Second proposed individual doesn't exist");

                return new Sentence(func, individual1, individual2);
            }
            else
            {
                var func = new Function(parts[0], Cardinality.One);
                if (!functionality.exists(func)) 
                    throw new Error("Function doesn't exist.");

                var individual1 = new Individual(subparts[0]);
                if (!population.exists(individual1)) 
                    throw new Error("First proposed individual doesn't exist.");

                return new Sentence(func, individual1);
            }
        }
        else
        {
            var func = new Function(parts[0], Cardinality.None);
            if (!functionality.exists(func)) 
                throw new Error("Function doesn't exist.");

            return new Sentence(func);
        }
    }

    static build(
        functionName: string, 
        firstIndividualName: string = null, 
        secondIndividualName: string = null, 
        reflexive: boolean = false): Sentence
    {
        if (functionName == null || functionName === "")
            throw new Error("Function name is not valid");

        return (firstIndividualName == null || firstIndividualName === "")
            ? new Sentence(new Function(functionName, Cardinality.None, "x", "y", reflexive))
            : (secondIndividualName == null || secondIndividualName === "")
                ? new Sentence(
                    new Function(functionName, Cardinality.One, "x", "y", reflexive), 
                    new Individual(firstIndividualName))
                : new Sentence(
                    new Function(functionName, Cardinality.Two, "x", "y", reflexive),
                    new Individual(firstIndividualName),
                    new Individual(secondIndividualName));
    }
}