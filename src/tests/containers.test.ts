import { Cardinality, Function, Sentence } from "../basis";
import { Container, TruthTable } from "../containers";
import { IStringable } from "../interfaces";

class Sample implements IStringable {
    private _a: string;
    private _b: string;

    constructor(a: string, b: string){
        this._a = a;
        this._b = b;
    }

    toString(): string{
        return `${this._a}+${this._b}`;
    }
}

class ContainerExample extends Container<Sample>{}

describe("Container should", () => {
  it("create an empty container", () => {
    let container = new ContainerExample();
    expect(container.elements.length).toBe(0);
  });

  it("create a container with elements", () => {
    let container = new ContainerExample([
        new Sample("a", "b"),
        new Sample("b", "c")
    ]);

    expect(container.elements.length).toBe(2);
    expect(container.exists(new Sample("a", "b"))).toBe(true);
    expect(container.exists(new Sample("b", "c"))).toBe(true);
    expect(container.exists(new Sample("c", "d"))).toBe(false);
  });

  it("add new elements", () => {
    let container = new ContainerExample();

    container.add(new Sample("a", "b"));

    expect(container.elements.length).toBe(1);
    expect(container.exists(new Sample("a", "b"))).toBe(true);
    expect(container.exists(new Sample("b", "c"))).toBe(false);
  });

  it("remove elements", () => {
    let container = new ContainerExample([
        new Sample("a", "b"),
        new Sample("b", "c")
    ]);

    container.remove(new Sample("b", "c"));

    expect(container.elements.length).toBe(1);
    expect(container.exists(new Sample("a", "b"))).toBe(true);
    expect(container.exists(new Sample("b", "c"))).toBe(false);
  });

  it("get using string representation", () => {
    let container = new ContainerExample([
        new Sample("a", "b"),
        new Sample("b", "c")
    ]);

    let item1 = container.get("a+b");
    let item2 = container.get("b+c");

    expect(item1.toString()).toBe("a+b");
    expect(item2.toString()).toBe("b+c");
  });

  it("avoid duplicated elements", () => {
    let container = new ContainerExample([
        new Sample("a", "b"),
        new Sample("a", "b")
    ]);

    expect(container.elements.length).toBe(1);
    expect(container.exists(new Sample("a", "b"))).toBe(true);
    expect(container.exists(new Sample("b", "c"))).toBe(false);
  });

  it("throw an exception if null input", () => {
    let container = new ContainerExample();

    expect(() => container.add(null)).toThrowError();
    expect(() => container.exists(null)).toThrowError();
    expect(() => container.remove(null)).toThrowError();
    expect(() => container.get(null)).toThrowError();
  });
});

describe("TruthTable should", () => {
  it("create an empty table", () => {
    let table = TruthTable.empty;
    expect(table.elements.length).toBe(0);
  });

  it("join with another table", () => {
    let table = new TruthTable([
      Sentence.build("A", "First", "Second"),
    ]);

    let anotherTable = new TruthTable([
      Sentence.build("B", "Third", "Fourth")
    ]);

    table.join(anotherTable);

    expect(table.elements.length).toBe(2);
    expect(table.exists(Sentence.build("A", "First", "Second"))).toBe(true);
    expect(table.exists(Sentence.build("B", "Third", "Fourth"))).toBe(true);
  });

  it("add new elements fluently", () => {
    let table = TruthTable.empty
      .with(Sentence.build("A", "First", "Second"))
      .with(Sentence.build("B", "Third", "Fourth"));

      expect(table.elements.length).toBe(2);
      expect(table.exists(Sentence.build("A", "First", "Second"))).toBe(true);
      expect(table.exists(Sentence.build("B", "Third", "Fourth"))).toBe(true);
  });

  it("copy itself", () => {
    let table = TruthTable.empty
      .with(Sentence.build("A", "First", "Second"))
      .with(Sentence.build("B", "Third", "Fourth"));
    
    let anotherTable = table.copy();

    expect(anotherTable.elements.length).toBe(2);
    expect(anotherTable.exists(Sentence.build("A", "First", "Second"))).toBe(true);
    expect(anotherTable.exists(Sentence.build("B", "Third", "Fourth"))).toBe(true);
  });

  it("detect reflexive sentences as equals", () => {
    let table = TruthTable.empty
      .with(Sentence.build("A", "First", "Second", true));
    
    expect(table.exists(Sentence.build("A", "First", "Second", true))).toBe(true);
    expect(table.exists(Sentence.build("A", "Second", "First", true))).toBe(true);
  });

  it("remove sentences that have a particular function", () => {
    let table = TruthTable.empty
      .with(Sentence.build("A", "First", "Second", true))
      .with(Sentence.build("A", "Third", "Fourth", true))
      .with(Sentence.build("B", "First", "Second", true))
      .with(Sentence.build("D"))
      .with(Sentence.build("A", "Fifth", "Sixth"));

    const deletedElements = table.removeFunction(new Function("A", Cardinality.Two, "x", "y", true));
    
    expect(deletedElements).toBe(2);

    expect(table.exists(Sentence.build("D"))).toBe(true);
    expect(table.exists(Sentence.build("B", "First", "Second", true))).toBe(true);
    expect(table.exists(Sentence.build("A", "Fifth", "Sixth"))).toBe(true);

    expect(table.exists(Sentence.build("A", "First", "Second", true))).toBe(false);
    expect(table.exists(Sentence.build("A", "Third", "Fourth", true))).toBe(false);
  });
});