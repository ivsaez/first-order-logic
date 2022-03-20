import { Individual } from "./individual";

export class Population{
    private _items: Map<string, Individual>;

    constructor(items: Individual[] = []){
        this._items = new Map<string, Individual>();
        for(let item of items){
            this._items.set(item.toString(), item);
        }
    }

    get elements(){
        let result = [];
        for(let item of this._items.values())
            result.push(item);
        
        return result;
    }

    add(item: Individual): void{
        this.validateItem(item);
        
        this._items.set(item.toString(), item);
    }

    remove(item: Individual): boolean{
        this.validateItem(item);
        
        return this._items.delete(item.toString());
    }

    exists(item: Individual): boolean{
        this.validateItem(item);
        
        return this._items.has(item.toString());
    }

    get(itemStringRepresentation: string): Individual{
        if(itemStringRepresentation == null || itemStringRepresentation === "")
            throw new Error("Input cannot be null or empty");
        
        return this._items.get(itemStringRepresentation);
    }

    private validateItem(item: Individual): void{
        if(item == null)
            throw new Error("Input cannot be null.");
    }
}