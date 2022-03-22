import { Functionality, Population } from "./containers";
import { Cardinality, Function } from "./function";
import { Individual } from "./individual";
import { IStringable } from "./interfaces";
import { SentenceExpression } from "./expressions";

export class Sentence implements IStringable{
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
                return `${this._function.name}[${this._first.toString()},${this._second.toString()}]`;

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