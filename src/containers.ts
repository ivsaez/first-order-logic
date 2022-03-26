import { Individual } from "./individual";
import { Function } from "./function";
import { Sentence } from "./sentence";
import { Axiom } from "./axiom";
import { IStringable } from "./interfaces";

export abstract class Container<T extends IStringable>{
    private _items: Map<string, T>;

    constructor(items: T[] = []){
        this._items = new Map<string, T>();

        if(items != null){
            for(let item of items){
                this._items.set(item.toString(), item);
            }
        }
    }

    get elements(): T[]{
        let result = [];
        for(let item of this._items.values())
            result.push(item);
        
        return result;
    }

    add(item: T): void{
        this.validateItem(item);
        
        this._items.set(item.toString(), item);
    }

    remove(item: T): boolean{
        this.validateItem(item);
        
        return this._items.delete(item.toString());
    }

    exists(item: T): boolean{
        this.validateItem(item);
        
        return this._items.has(item.toString());
    }

    get(itemStringRepresentation: string): T{
        if(itemStringRepresentation == null || itemStringRepresentation === "")
            throw new Error("Input cannot be null or empty");
        
        return this._items.get(itemStringRepresentation);
    }

    private validateItem(item: T): void{
        if(item == null)
            throw new Error("Input cannot be null.");
    }
}

export class Population extends Container<Individual>{}
export class Functionality extends Container<Function>{}
export class Rules extends Container<Axiom>{}

export class TruthTable extends Container<Sentence>{
    static get empty(): TruthTable{
        return new TruthTable();
    }

    join(truthTable: TruthTable): boolean
    {
        let anyAdded: boolean = false;
        for (let item of truthTable.elements)
        {
            if (!this.exists(item))
            {
                anyAdded = true;
                this.add(item);
            }
        }

        return anyAdded;
    }

    with(sentence: Sentence): TruthTable
    {
        this.add(sentence);
        return this;
    }

    copy(): TruthTable
    {
        let copy = new TruthTable();
        for (var item of this.elements)
        {
            copy.add(item);
        }

        return copy;
    }
}