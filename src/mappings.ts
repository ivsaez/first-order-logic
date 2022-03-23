import { Individual } from "./individual";

export class Mappings{
    private _mappings: Map<string, Individual>;

    constructor(){
        this._mappings = new Map<string, Individual>();
    }

    get variables(): string[]{
        return [...this._mappings.keys()];
    }

    get hasAllVariablesMapped(): boolean{
        for(let value of this._mappings.values()){
            if(value == null)
                return false; 
        }

        return true;
    }

    addVariable(variable: string): void
    {
        this.checkVariable(variable);

        if(this._mappings.has(variable)) 
            throw new Error("Variable already exists");

        this._mappings.set(variable, null);
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

        this._mappings.set(variable, individual);
    }

    mapNext(individual: Individual): void
    {
        this.checkIndividual(individual);
        
        let included: boolean = false;
        for (let item of this._mappings.keys())
        {
            if (this._mappings.get(item) == null)
            {
                this._mappings.set(item, individual);
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

        return this._mappings.has(variable);
    }

    hasMapping(variable: string): boolean
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        return this._mappings.get(variable) !== null;
    }

    hasIndividual(individual: Individual): boolean
    {
        this.checkIndividual(individual);

        for(let value of this._mappings){
            if(individual.equals(value[1]))
                return true;
        }
        
        return false;
    }

    mapping(variable: string): Individual
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        return this._mappings.get(variable);
    }

    removeMapping(variable: string): void
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        this._mappings.set(variable, null);
    }

    removeIndividual(individual: Individual): void
    {
        this.checkIndividual(individual);
        if (!this.hasIndividual(individual)) 
            throw new Error("Individual doesn't exist")

        for (let item of this._mappings)
        {
            if (item[1].equals(individual))
            {
                this._mappings.set(item[0], null);
                break;
            }
        }
    }

    removeVariable(variable: string): void
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        this._mappings.delete(variable);
    }

    copy(): Mappings{
        let copy = new Mappings();
        for(let entry of this._mappings.entries()){
            copy._mappings.set(entry[0], entry[1]);
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
        if (!this._mappings.has(variable)) 
            throw new Error("Variable doesn't exist");
    }

    private checkIndividual(individual: Individual): void
    {
        if (individual == null)
            throw new Error("Individual cannot be null");
    }
}