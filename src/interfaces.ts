import { TruthTable } from "./containers";

export interface IStringable{
    toString(): string;
}

export interface IEvaluable{
    evaluate(truthTable: TruthTable): boolean;
}