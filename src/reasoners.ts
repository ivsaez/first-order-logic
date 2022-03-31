import { Sentence } from "./sentence";
import { Axiom } from "./axiom";
import { Mappings } from "./mappings";
import { Rules, Population, TruthTable } from "./containers";
import { IFormulable } from "./interfaces";
import { EvaluableNegateOperation } from "./operations";
import { Individual } from ".";

export function modusPonens(
    rules: Rules, 
    population: Population, 
    truthTable: TruthTable, 
    added: Sentence[] = []): ModusPonensResult{
    
    if (rules == null)
        throw new Error("Rules cannot be null.");

    if (population == null)
        throw new Error("Population cannot be null.");

    if (truthTable == null)
        throw new Error("TruthTable cannot be null.");

    if (added == null)
        throw new Error("Added cannot be null.");

    if (rules.elements.length === 0) 
        throw new Error("Rules cannot be empty.");
    
    for (let rule of rules.elements)
        if (rule.formulable.variables.length > population.elements.length)
            throw new Error("There are less individuals in population than variables inside rules.");

    let result = new ModusPonensResult();
    for (let sentence of added.filter(s => !s.evaluate(truthTable)))
    {
        result.add(sentence);
        truthTable.add(sentence);
    }

    let lastCount = -1;

    while(result.count > lastCount)
    {
        lastCount = result.count;

        for (let axiom of rules.elements)
        {
            let subresult = infere(axiom, population, truthTable);
            result.merge(subresult);
        }

        updateTruthTable(truthTable, result);
    }

    return result;
}

function infere(rule: Axiom, population: Population, truthTable: TruthTable): ModusPonensResult
{
    let result = new ModusPonensResult();

    let premise = rule.premise;

    if (population.elements.length > 0)
    {
        for (let individual of population.elements)
        {
            let mappings = new Mappings();
            mappings.addVariables(premise.variables);

            mappings.mapNext(individual);

            if (mappings.hasAllVariablesMapped)
            {
                evaluateAxiomConclusion(rule, truthTable, result, premise, mappings);
            }
            else
            {
                var otherIndividuals = getNonUsedIndividuals(mappings, population.elements);

                var subResult = subInfere(rule, mappings, otherIndividuals, truthTable);
                result.merge(subResult);
            }
        }
    }
    else
    {
        evaluateAxiomConclusion(rule, truthTable, result, premise, new Mappings());
    }
    
    return result;
}

function subInfere(
    rule: Axiom, 
    mappings: Mappings, 
    population: Individual[], 
    truthTable: TruthTable): ModusPonensResult
{
    let result = new ModusPonensResult();

    let premise = rule.premise;

    for (let individual of population)
    {
        mappings.mapNext(individual);

        if (mappings.hasAllVariablesMapped)
        {
            evaluateAxiomConclusion(rule, truthTable, result, premise, mappings);

            mappings.removeIndividual(individual);
        }
        else
        {
            var otherIndividuals = getNonUsedIndividuals(mappings, population);
            var subResult = subInfere(rule, mappings, otherIndividuals, truthTable);
            result.merge(subResult);
            mappings.removeIndividual(individual);
        }
    }

    return result;
}

function updateTruthTable(truthTable: TruthTable, result: ModusPonensResult): void
{
    result.purgeIncongruences();
    for (let sentence of result.added.filter(s => !s.evaluate(truthTable)))
        truthTable.add(sentence);
    
    for (let sentence of result.removed.filter(s => s.evaluate(truthTable)))
        truthTable.remove(sentence);
}

function evaluateAxiomConclusion(
    rule: Axiom, 
    truthTable: TruthTable, 
    result: ModusPonensResult, 
    premise: IFormulable, 
    mappings: Mappings): void
{
    var evaluable = premise.formulate(mappings);
    if (evaluable.evaluate(truthTable))
    {
        let conclusion = rule.conclusion.formulate(mappings);
        let posibleNegation = conclusion as EvaluableNegateOperation;
        if(posibleNegation.operand === undefined) // Check if the type is a Sentence or a NegatedOperation
        {
            var conclusionSentence = conclusion as Sentence;
            if (!conclusionSentence.evaluate(truthTable)) result.add(conclusionSentence);
        }
        else
        {
            var conclusionSentence = posibleNegation.operand as Sentence;
            if (conclusionSentence.evaluate(truthTable)) result.quit(conclusionSentence);
        }
    }
}

function getNonUsedIndividuals(mappings: Mappings, population: Individual[]): Individual[]{
    return population
        .filter(individual => !mappings.hasIndividual(individual));
}

export class ModusPonensResult{
    private _added: Map<string, Sentence>;
    private _removed: Map<string, Sentence>;

    constructor(){
        this._added = new Map<string, Sentence>();
        this._removed = new Map<string, Sentence>();
    }

    get added(): Sentence[]{
        return [...this._added.values()];
    }

    get removed(): Sentence[]{
        return [...this._removed.values()];
    }

    get count(): number{
        return this._added.size + this._removed.size;
    }

    get any(): boolean{
        return this.count > 0;
    }

    add(sentence: Sentence): void{
        if(sentence == null)
            throw Error("Sentence cannot be null.");
        
        this._added.set(sentence.toString(), sentence);
    }

    quit(sentence: Sentence): void{
        if(sentence == null)
            throw Error("Sentence cannot be null.");
        
        this._removed.set(sentence.toString(), sentence);
    }

    merge(result: ModusPonensResult): void{
        if(result == null)
            throw Error("Result cannot be null.");
        
        for(let added of result._added)
            this._added.set(added[0], added[1]);
        
        for(let removed of result._removed){
            this._removed.set(removed[0], removed[1]);
        }
    }

    purgeIncongruences(): void{
        for(let added of this._added){
            this._removed.delete(added[0]);
        }
    }
}