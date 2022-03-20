import { Cardinality, Function } from "../function";

describe("Function should", () => {
  it("throw an exception if null name", () => {
    expect(() => new Function(null, Cardinality.None)).toThrowError();
  });

  it("throw an exception if empty name", () => {
    expect(() => new Function("", Cardinality.None)).toThrowError();
  });

  it("throw an exception if incorrect name", () => {
    expect(() => new Function("!·$%&/()=1235", Cardinality.None)).toThrowError();
  });

  it("throw an exception if null first variable", () => {
    expect(() => new Function("F", Cardinality.None, null)).toThrowError();
  });

  it("throw an exception if null second variable", () => {
    expect(() => new Function("F", Cardinality.None, "x", null)).toThrowError();
  });

  it("throw an exception if incorrect first variable", () => {
    expect(() => new Function("F", Cardinality.None, "aa")).toThrowError();
    expect(() => new Function("F", Cardinality.None, "A")).toThrowError();
  });

  it("throw an exception if incorrect second variable", () => {
    expect(() => new Function("F", Cardinality.None, "x", "bb")).toThrowError();
    expect(() => new Function("F", Cardinality.None, "x", "B")).toThrowError();
  });

  it("throw equal variables", () => {
    expect(() => new Function("F", Cardinality.None, "x", "x")).toThrowError();
  });

  it("create a new function", () => {
    let func = new Function("F", Cardinality.None);

    expect(func.name).toBe("F");
    expect(func.cardinality).toBe(Cardinality.None);
    expect(func.firstVariable).toBe("x");
    expect(func.secondVariable).toBe("y");
    expect(func.isReflexive).toBe(false);
    expect(func.variables.length).toBe(0);
  });

  it("create a new reflexive function with specific variables", () => {
    let func = new Function("F", Cardinality.Two, "a", "b", true);

    expect(func.name).toBe("F");
    expect(func.cardinality).toBe(Cardinality.Two);
    expect(func.firstVariable).toBe("a");
    expect(func.secondVariable).toBe("b");
    expect(func.isReflexive).toBe(true);
    expect(func.variables.length).toBe(2);
    expect(func.variables[0]).toBe("a");
    expect(func.variables[1]).toBe("b");
  });

  it("correct reflexivity with cardinality", () => {
    let func = new Function("F", Cardinality.One, "a", "b", true);

    expect(func.name).toBe("F");
    expect(func.cardinality).toBe(Cardinality.One);
    expect(func.firstVariable).toBe("a");
    expect(func.secondVariable).toBe("b");
    expect(func.isReflexive).toBe(false);
    expect(func.variables.length).toBe(1);
    expect(func.variables[0]).toBe("a");
  });

  it("represent string function", () => {
    let none = new Function("F", Cardinality.None);
    expect(none.toString()).toBe("F");
    
    let one = new Function("One", Cardinality.One);
    expect(one.toString()).toBe("One[x]");

    let anotherOne = new Function("AnotherOne", Cardinality.One, "a");
    expect(anotherOne.toString()).toBe("AnotherOne[a]");

    let two = new Function("Two", Cardinality.Two);
    expect(two.toString()).toBe("Two[x,y]");

    let anotherTwo = new Function("AnotherTwo", Cardinality.Two, "a", "b");
    expect(anotherTwo.toString()).toBe("AnotherTwo[a,b]");
  });

  it("calculate equality", () => {
    let a = new Function("A", Cardinality.None);
    expect(a.equals(null)).toBe(false);

    let a2 = new Function("A", Cardinality.None);
    expect(a.equals(a2)).toBe(true);

    let b = new Function("B", Cardinality.One);
    let b2 = new Function("B", Cardinality.One, "a");
    expect(a.equals(b)).toBe(false);
    expect(b.equals(b2)).toBe(true);

    let c = new Function("C", Cardinality.Two);
    let c2 = new Function("C", Cardinality.Two, "a", "b");
    let c3 = new Function("C", Cardinality.One, "a");
    expect(c.equals(c2)).toBe(true);
    expect(c.equals(c3)).toBe(false);

    let d = new Function("D", Cardinality.Two, "x", "y", true);
    let d2 = new Function("D", Cardinality.Two, "a", "b", false);
    expect(d.equals(d2)).toBe(false);
  });

  it("throw an exception if building with null input", () => {
    expect(() => Function.build(null)).toThrowError();
  });

  it("throw an exception if building with empty input", () => {
    expect(() => Function.build("")).toThrowError();
  });

  it("build a cardinality none function", () => {
    let func = Function.build("F");

    expect(func.name).toBe("F");
    expect(func.cardinality).toBe(Cardinality.None);
    expect(func.firstVariable).toBe("x");
    expect(func.secondVariable).toBe("y");
    expect(func.isReflexive).toBe(false);
    expect(func.variables.length).toBe(0);
  });

  it("build a cardinality one function", () => {
    let func = Function.build("F[x]");

    expect(func.name).toBe("F");
    expect(func.cardinality).toBe(Cardinality.One);
    expect(func.firstVariable).toBe("x");
    expect(func.secondVariable).toBe("y");
    expect(func.isReflexive).toBe(false);
    expect(func.variables.length).toBe(1);
    expect(func.variables[0]).toBe("x");
  });

  it("build a cardinality two function", () => {
    let func = Function.build("F[a,b]");

    expect(func.name).toBe("F");
    expect(func.cardinality).toBe(Cardinality.Two);
    expect(func.firstVariable).toBe("a");
    expect(func.secondVariable).toBe("b");
    expect(func.isReflexive).toBe(false);
    expect(func.variables.length).toBe(2);
    expect(func.variables[0]).toBe("a");
    expect(func.variables[1]).toBe("b");
  });

  it("build a reflexive cardinality two function", () => {
    let func = Function.build("~F[n,m]");

    expect(func.name).toBe("F");
    expect(func.cardinality).toBe(Cardinality.Two);
    expect(func.firstVariable).toBe("n");
    expect(func.secondVariable).toBe("m");
    expect(func.isReflexive).toBe(true);
    expect(func.variables.length).toBe(2);
    expect(func.variables[0]).toBe("n");
    expect(func.variables[1]).toBe("m");
  });

  it("validate a function", () => {
    expect(Function.validate("[Any]")).toBe(false);
    expect(Function.validate("[Any]Any")).toBe(false);
    expect(Function.validate("Any[]")).toBe(false);
    expect(Function.validate("[asdfgklhn()&/|@#~%$")).toBe(false);
    expect(Function.validate("Any[Any]")).toBe(false);

    expect(Function.validate("Any")).toBe(true);
    expect(Function.validate("Any[x]")).toBe(true);
    expect(Function.validate("Any[y]")).toBe(true);
    expect(Function.validate("Any[x,y]")).toBe(true);
    expect(Function.validate("Any[y,x]")).toBe(true);
    expect(Function.validate("Any[a,b]")).toBe(true);
    expect(Function.validate("~Any")).toBe(true);
    expect(Function.validate("~Any[a]")).toBe(true);
    expect(Function.validate("~Any[a,b]")).toBe(true);
  });
});