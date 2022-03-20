import { Individual } from "./individual";
import { Function } from "./function";
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

    get elements(){
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