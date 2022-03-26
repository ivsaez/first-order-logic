import { FormulableAndOperation } from "./operations";
import { IFormulable, IStringable, IFormulableNode } from "./interfaces";
import { FormulableImplicationOperation } from ".";

export class Axiom implements IStringable{
    private _premises: IFormulableNode[];
    private _conclusion: IFormulableNode;

    constructor(premises: IFormulableNode[], conclusion: IFormulableNode)
    {
        if(premises == null || premises.length === 0)
            throw new Error("Trhere must be almost one premise.");
        
        if(conclusion == null)
            throw new Error("Conclision cannot be null.");
        
        let premisesVariables = new Set<string>();
        for(let premise of premises)
            for(let variable of premise.variables)
                premisesVariables.add(variable);

        for(let variable of conclusion.variables)
            if(!premisesVariables.has(variable))
                throw new Error("Conclusion variables must be a subset of the premises variables.");
        
        this._premises = premises;
        this._conclusion = conclusion;
    }

    get premises(){
        return this._premises;
    }

    get conclusion(){
        return this._conclusion;
    }

    get premise(): IFormulableNode{
        if (this._premises.length === 1)
            return this._premises[0];
        
        let actualAnd: FormulableAndOperation = null;
        let lastFormulable: IFormulable = null;

        for (let i = this._premises.length - 1; i >= 0; i--)
        {
            if (lastFormulable != null)
            {
                if (actualAnd == null)
                {
                    actualAnd = new FormulableAndOperation(this._premises[i], lastFormulable);
                }
                else
                {
                    actualAnd = new FormulableAndOperation(this._premises[i], actualAnd);
                }
            }
            else
            {
                lastFormulable = this._premises[i];
            }
        }

        return actualAnd;
    }

    get formulable(): IFormulableNode{
        return new FormulableImplicationOperation(this.premise, this._conclusion);
    }

    toString(): string{
        return `${this._premises.map(premise => `(${premise.toString()})`).join(' & ')} > ${this.conclusion.toString()}`;
    }

    equals(other: Axiom): boolean{
        return this.toString() === other.toString();
    }
}