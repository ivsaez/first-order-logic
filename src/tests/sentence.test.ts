import { Individual } from "../individual";
import { Cardinality, Function } from "../function";
import { Sentence } from "../sentence";
import { Functionality, Population, TruthTable } from "../containers";

describe("Sentence should", () => {
  it("create a new sentence", () => {
    let sentence = new Sentence(
        new Function("A", Cardinality.None)
    );

    expect(sentence.function.equals(new Function("A", Cardinality.None))).toBe(true);
    expect(sentence.first).toBe(null);
    expect(sentence.second).toBe(null);

    let sentenceOne = new Sentence(
        new Function("B", Cardinality.One),
        new Individual("First")
    );

    expect(sentenceOne.function.equals(new Function("B", Cardinality.One))).toBe(true);
    expect(sentenceOne.first.equals(new Individual("First"))).toBe(true);
    expect(sentenceOne.second).toBe(null);

    let sentenceTwo = new Sentence(
        new Function("C", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    );

    expect(sentenceTwo.function.equals(new Function("C", Cardinality.Two))).toBe(true);
    expect(sentenceTwo.first.equals(new Individual("First"))).toBe(true);
    expect(sentenceTwo.second.equals(new Individual("Second"))).toBe(true);
  });

  it("throw an exception if wrong input", () => {
    expect(() => new Sentence(null)).toThrowError();
    expect(() => new Sentence(new Function("A", Cardinality.One))).toThrowError();
    expect(() => new Sentence(new Function("B", Cardinality.None), new Individual("First"))).toThrowError();
    expect(() => new Sentence(new Function("C", Cardinality.Two), new Individual("First"))).toThrowError();
    expect(() => new Sentence(
        new Function("D", Cardinality.Two), 
        new Individual("First"),
        new Individual("First"))).toThrowError();
  });

  it("be represented as string", () => {
    let sentence = new Sentence(
        new Function("A", Cardinality.None)
    );

    expect(sentence.toString()).toBe("A");

    let sentenceOne = new Sentence(
        new Function("B", Cardinality.One),
        new Individual("First")
    );

    expect(sentenceOne.toString()).toBe("B[First]");

    let sentenceTwo = new Sentence(
        new Function("C", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    );

    expect(sentenceTwo.toString()).toBe("C[First,Second]");
  });

  it("calculate equality", () => {
    let sentence = new Sentence(
        new Function("A", Cardinality.None)
    );

    expect(sentence.equals(null)).toBe(false);
    expect(sentence.equals(new Sentence(
        new Function("A", Cardinality.None)
    ))).toBe(true);

    let sentenceOne = new Sentence(
        new Function("B", Cardinality.One),
        new Individual("First")
    );

    expect(sentenceOne.equals(new Sentence(
        new Function("B", Cardinality.One),
        new Individual("First")
    ))).toBe(true);
    expect(sentenceOne.equals(new Sentence(
        new Function("C", Cardinality.One),
        new Individual("First")
    ))).toBe(false);
    expect(sentenceOne.equals(new Sentence(
        new Function("B", Cardinality.One),
        new Individual("Other")
    ))).toBe(false);

    let sentenceTwo = new Sentence(
        new Function("C", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    );

    expect(sentenceTwo.equals(new Sentence(
        new Function("C", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    ))).toBe(true);
    expect(sentenceTwo.equals(new Sentence(
        new Function("D", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    ))).toBe(false);
    expect(sentenceTwo.equals(new Sentence(
        new Function("C", Cardinality.Two),
        new Individual("Other"),
        new Individual("Second")
    ))).toBe(false);
    expect(sentenceTwo.equals(new Sentence(
        new Function("C", Cardinality.Two),
        new Individual("First"),
        new Individual("Other")
    ))).toBe(false);

    expect(sentence.equals(sentenceOne)).toBe(false);
    expect(sentence.equals(sentenceTwo)).toBe(false);
    expect(sentenceTwo.equals(sentenceOne)).toBe(false);
  });

  it("perform a strict build", () => {
    let population = new Population([
        new Individual("First"),
        new Individual("Second")
    ]);

    let functionality = new Functionality([
        new Function("A", Cardinality.Two)
    ]);

    expect(() => Sentence.buildStrict(null, population, functionality)).toThrowError();
    expect(() => Sentence.buildStrict("", population, functionality)).toThrowError();
    expect(() => Sentence.buildStrict("A", null, functionality)).toThrowError();
    expect(() => Sentence.buildStrict("A", population, null)).toThrowError();
    
    expect(() => Sentence.buildStrict("A[]", population, functionality)).toThrowError();
    expect(() => Sentence.buildStrict("B", population, functionality)).toThrowError();
    expect(() => Sentence.buildStrict("A[First]", population, functionality)).toThrowError();
    expect(() => Sentence.buildStrict("A[First,Other]", population, functionality)).toThrowError();
    expect(() => Sentence.buildStrict("A[Other,Second]", population, functionality)).toThrowError();

    let sentence = Sentence.buildStrict("A[First,Second]", population, functionality);

    expect(sentence.equals(new Sentence(
        new Function("A", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    ))).toBe(true);
  });

  it("perform a loose build", () => {
    expect(() => Sentence.build(null)).toThrowError();
    expect(() => Sentence.build("")).toThrowError();
    
    expect(() => Sentence.build("A[]")).toThrowError();
    expect(() => Sentence.build("$%&/")).toThrowError();
    expect(() => Sentence.build("[]A")).toThrowError();
    expect(() => Sentence.build("[]")).toThrowError();
    expect(() => Sentence.build("[Other,Second]")).toThrowError();
    expect(() => Sentence.build("A[First]")).toThrowError();
    expect(() => Sentence.build("A[First,Second]")).toThrowError();

    let sentence = Sentence.build("A");

    expect(sentence.equals(new Sentence(
        new Function("A", Cardinality.None)
    ))).toBe(true);

    let sentenceOne = Sentence.build("A", "First");

    expect(sentenceOne.equals(new Sentence(
        new Function("A", Cardinality.One),
        new Individual("First")
    ))).toBe(true);

    let sentenceTwo = Sentence.build("A", "First", "Second");

    expect(sentenceTwo.equals(new Sentence(
        new Function("A", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    ))).toBe(true);

    let sentenceReflexive = Sentence.build("A", "First", "Second", true);

    expect(sentenceReflexive.equals(new Sentence(
        new Function("A", Cardinality.Two, "x", "y", true),
        new Individual("First"),
        new Individual("Second")
    ))).toBe(true);
  });

  it("validate an input", () => {
    expect(() => Sentence.validate(null)).toThrowError();
    
    expect(Sentence.validate("·$&$%43576")).toBe(false);
    expect(Sentence.validate("Sentence[·$&$%43576]")).toBe(false);
    expect(Sentence.validate("Sentence[·$&$%43576,B]")).toBe(false);
    expect(Sentence.validate("Sentence[A,·$&$%43576]")).toBe(false);
    expect(Sentence.validate("·$&$%43576[A,B]")).toBe(false);
    expect(Sentence.validate("[A,B]")).toBe(false);
    expect(Sentence.validate("Sentence[,B]")).toBe(false);
    expect(Sentence.validate("Sentence[A,]")).toBe(false);
    expect(Sentence.validate("[A,B]Sentence")).toBe(false);
    expect(Sentence.validate("Sentence Tal[A,B]")).toBe(false);
    expect(Sentence.validate("Sentence[A ,B]")).toBe(false);
    expect(Sentence.validate("Sentence[A,B ]")).toBe(false);
    expect(Sentence.validate("Sentence[A,B]")).toBe(true);
  });

  it("be evaluable", () => {
    let sentence = new Sentence(
        new Function("A", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    );

    let anotherSentence = new Sentence(
        new Function("B", Cardinality.Two),
        new Individual("First"),
        new Individual("Second")
    );
    
    let table = new TruthTable([
        Sentence.build("A", "First", "Second")
    ]);

    expect(sentence.evaluate(table)).toBe(true);
    expect(anotherSentence.evaluate(table)).toBe(false);
  });
});