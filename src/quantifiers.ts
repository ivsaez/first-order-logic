import { IFormulable } from "./interfaces";
import { Population, TruthTable } from "./containers";
import { Mappings } from "./mappings";
import { Individual } from "./individual";

export function existencialQuantifier(
    premise: IFormulable, 
    formulable: IFormulable, 
    population: Population, 
    truthTable: TruthTable): boolean {
    
    checkInputs(premise, formulable, population, truthTable);
    
    let mappingsList = getPremiseValidMappings(premise, population, truthTable);
    if(mappingsList.length === 0)
        return false;

    for (let mapping of mappingsList)
    {
        var evaluable = formulable.formulate(mapping);
        if (evaluable.evaluate(truthTable)) 
            return true;
    }

    return false;
}

export function universalQuantifier(
    premise: IFormulable, 
    formulable: IFormulable, 
    population: Population, 
    truthTable: TruthTable): boolean {
    
    checkInputs(premise, formulable, population, truthTable);

    let mappingsList = getPremiseValidMappings(premise, population, truthTable);
    if(mappingsList.length === 0)
        return false;
    
    for (let mapping of mappingsList)
    {
        var evaluable = formulable.formulate(mapping);
        if (!evaluable.evaluate(truthTable)) 
            return false;
    }

    return true;
}

function checkInputs(
    premise: IFormulable, 
    formulable: IFormulable, 
    population: Population, 
    truthTable: TruthTable): void
{
    if (premise == null)
        throw new Error("Premise cannot be null.");

    if (formulable == null)
        throw new Error("Formulable cannot be null.");

    if (population == null)
        throw new Error("Population cannot be null.");

    if (truthTable == null)
        throw new Error("Truth table cannot be null.");

    var premiseVariables = premise.variables;
    var formulableVariables = formulable.variables;

    if(premiseVariables.length === 0 || formulableVariables.length === 0) 
        throw new Error("Formulations without variables cannot be quantified.");

    if(premiseVariables.length > population.elements.length) 
        throw new Error("There is not enough population to fill all variables.");
}

function getPremiseValidMappings(
    premise: IFormulable, 
    population: Population, 
    truthTable: TruthTable): Mappings[]
{
    let result: Mappings[] = [];
    
    for (let individual of population.elements)
    {
        let mappings = new Mappings();
        mappings.addVariables(premise.variables);

        mappings.mapNext(individual);

        if (mappings.hasAllVariablesMapped)
        {
            var evaluable = premise.formulate(mappings);
            if (evaluable.evaluate(truthTable))
            {
                result.push(mappings.copy());
            }
        }
        else
        {
            var otherIndividuals = getNonUsedIndividuals(mappings, population.elements);

            var subMappings = getPremiseValidSubMappings(premise, mappings, otherIndividuals, truthTable);
            result.push(...subMappings);
        }
    }

    return result;
}

function getNonUsedIndividuals(mappings: Mappings, population: Individual[]): Individual[]
{
    return population
        .filter(individual => !mappings.hasIndividual(individual));
}

function getPremiseValidSubMappings(
    premise: IFormulable, 
    mappings: Mappings, 
    population: Individual[], 
    truthTable: TruthTable): Mappings[]
{
    let result: Mappings[] = [];

    for (let individual of population)
    {
        mappings.mapNext(individual);

        if (mappings.hasAllVariablesMapped)
        {
            var evaluable = premise.formulate(mappings);

            if (evaluable.evaluate(truthTable))
            {
                result.push(mappings.copy());
            }

            mappings.removeIndividual(individual);
        }
        else
        {
            var otherIndividuals = getNonUsedIndividuals(mappings, population);
            var subMappings = getPremiseValidSubMappings(premise, mappings, otherIndividuals, truthTable);
            result.push(...subMappings);
            mappings.removeIndividual(individual);
        }
    }

    return result;
}