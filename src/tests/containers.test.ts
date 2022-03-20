import { Container } from "../containers";
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