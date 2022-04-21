import { Individual } from "./basis";

export class Mappings{
    private _mappings: { [variable: string]: Individual };

    constructor(){
        this._mappings = {};
    }

    get variables(): string[]{
        return Object.keys(this._mappings);
    }

    get hasAllVariablesMapped(): boolean{
        for(let variable of this.variables){
            if(this._mappings[variable] === null)
                return false; 
        }

        return true;
    }

    addVariable(variable: string): void
    {
        this.checkVariable(variable);

        if(variable in this._mappings) 
            throw new Error("Variable already exists");

        this._mappings[variable] = null;
    }

    addVariables(variables: string[])
    {
        if (variables == null || variables.length === 0) 
            throw new Error("Variables must contain any value");

        for (let variable of variables)
        {
            this.addVariable(variable)
        }
    }

    map(variable: string, individual: Individual): void
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        this.checkIndividual(individual);

        this._mappings[variable] = individual;
    }

    mapNext(individual: Individual): void
    {
        this.checkIndividual(individual);
        
        let included: boolean = false;
        for (let variable of this.variables)
        {
            if (this._mappings[variable] === null)
            {
                this._mappings[variable] = individual;
                included = true;
                break;
            }
        }

        if(!included)
            throw new Error("No empty mappings found");
    }

    hasVariable(variable: string): boolean
    {
        this.checkVariable(variable);

        return this.variables.includes(variable);
    }

    hasMapping(variable: string): boolean
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        return this._mappings[variable] !== null;
    }

    hasIndividual(individual: Individual): boolean
    {
        this.checkIndividual(individual);

        for(let variable of this.variables){
            if(individual.equals(this._mappings[variable]))
                return true;
        }
        
        return false;
    }

    mapping(variable: string): Individual
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        return this._mappings[variable];
    }

    removeMapping(variable: string): void
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        this._mappings[variable] = null;
    }

    removeIndividual(individual: Individual): void
    {
        this.checkIndividual(individual);
        if (!this.hasIndividual(individual)) 
            throw new Error("Individual doesn't exist")

        for (let variable of this.variables)
        {
            if (individual.equals(this._mappings[variable]))
            {
                this._mappings[variable] = null;
                break;
            }
        }
    }

    removeVariable(variable: string): void
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        delete this._mappings[variable];
    }

    copy(): Mappings{
        let copy = new Mappings();
        for(let variable of this.variables){
            copy._mappings[variable] = this._mappings[variable];
        }

        return copy;
    }

    private checkVariable(variable: string): void
    {
        if (variable == null || variable === "")
            throw new Error("Variable cannot be null nor empty");
    }

    private checkExistingVariable(variable: string): void
    {
        if (!(variable in this._mappings)) 
            throw new Error("Variable doesn't exist");
    }

    private checkIndividual(individual: Individual): void
    {
        if (individual == null)
            throw new Error("Individual cannot be null");
    }
}