import { TextExpression, VariableExpression, FunctionExpression } from "./expressions";

export class Function{
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

        if (firstVariable === secondVariable) 
            throw new Error("Variables must be different");

        this._name = name;
        this._cardinality = cardinality;
        this._firstVariable = firstVariable;
        this._secondVariable = secondVariable;

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