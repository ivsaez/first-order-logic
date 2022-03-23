import { TruthTable } from "./containers";
import { Mappings } from "./mappings";

export interface IStringable{
    toString(): string;
}

export interface IEvaluable{
    evaluate(truthTable: TruthTable): boolean;
}

export interface IFormulable{
    get variables(): string[];

    formulate(mappings: Mappings): IEvaluable;
}