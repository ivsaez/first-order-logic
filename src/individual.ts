import { TextExpression } from "./expressions";

export class Individual{
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