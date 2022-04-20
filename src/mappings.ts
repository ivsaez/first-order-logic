import { Individual } from "./basis";

interface IMapping{
    Variable: string;
    Individual: Individual;
}

export class Mappings{
    private _mappings: IMapping[];

    constructor(){
        this._mappings = [];
    }

    get variables(): string[]{
        return this._mappings.map(m => m.Variable);
    }

    get hasAllVariablesMapped(): boolean{
        for(let value of this._mappings){
            if(value.Individual === null)
                return false; 
        }

        return true;
    }

    addVariable(variable: string): void
    {
        this.checkVariable(variable);

        if(this.existVariable(variable)) 
            throw new Error("Variable already exists");

        this._mappings.push({
            Variable: variable,
            Individual: null
        });
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

        this.setIndividual(variable, individual);
    }

    mapNext(individual: Individual): void
    {
        this.checkIndividual(individual);
        
        let included: boolean = false;
        for (let item of this._mappings)
        {
            if (item.Individual === null)
            {
                item.Individual = individual;
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

        return this.existVariable(variable);
    }

    hasMapping(variable: string): boolean
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        return this.obtainMapping(variable) !== null;
    }

    hasIndividual(individual: Individual): boolean
    {
        this.checkIndividual(individual);

        for(let value of this._mappings){
            if(individual.equals(value.Individual))
                return true;
        }
        
        return false;
    }

    mapping(variable: string): Individual
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        return this.obtainMapping(variable);
    }

    removeMapping(variable: string): void
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        this.setIndividual(variable, null);
    }

    removeIndividual(individual: Individual): void
    {
        this.checkIndividual(individual);
        if (!this.hasIndividual(individual)) 
            throw new Error("Individual doesn't exist")

        for (let item of this._mappings)
        {
            if (individual.equals(item.Individual))
            {
                item.Individual = null;
                break;
            }
        }
    }

    removeVariable(variable: string): void
    {
        this.checkVariable(variable);
        this.checkExistingVariable(variable);

        this._mappings = this._mappings.filter(m => m.Variable !== variable);
    }

    copy(): Mappings{
        let copy = new Mappings();
        for(let item of this._mappings){
            copy._mappings.push({
                Variable: item.Variable,
                Individual: item.Individual
            });
        }

        return copy;
    }

    private existVariable(variable: string): boolean{
        return this._mappings.some(m => m.Variable === variable);
    }

    private checkVariable(variable: string): void
    {
        if (variable == null || variable === "")
            throw new Error("Variable cannot be null nor empty");
    }

    private checkExistingVariable(variable: string): void
    {
        if (!this.existVariable(variable)) 
            throw new Error("Variable doesn't exist");
    }

    private checkIndividual(individual: Individual): void
    {
        if (individual == null)
            throw new Error("Individual cannot be null");
    }

    private setIndividual(variable: string, individual: Individual): void{
        for(let item of this._mappings){
            if(item.Variable === variable){
                item.Individual = individual;
            }
        }
    }

    private obtainMapping(variable: string): Individual{
        for(let item of this._mappings){
            if(item.Variable === variable){
                return item.Individual;
            }
        }

        return null;
    }
}