# Description
This library allows to make some first order logic calculations providing specific classes and methods.

# Base classes
There are three base classes used to create the logic expressions: Individual, Function and Sentence.

## Individual
It represents a particular element in the world, an instance.

## Function
It is a representation of a trait, relation or fact about the world. Can accept up to two variables which can be represented by individuals. It can receive each of its accepted variables mapped with an individual of the world representation and it becomes an evaluable Sentence.

## Sentence
It is a Function with its variables mapped with individuals. It can be evaluated in the world to determine if it is true or not.

# Operations
Operations can be used to make formulations with functions and calculations with sentences. All boolean operations are accepted (Negation, AND, OR, Implication and Equivalence) and can be used with Functions to create any complex formula. A formula can also receive mappings for all its variables with Individuals and then become an evaluable formula which can be true or false.

# Axioms
Axioms are specifically shaped formulas formed by a list of premises separated by AND operations that lead to a conclusion formula through an Implication operation.

# Containers
Containers host all the basic elements of the library to represent the world. There are four types: Population, Functionality, TruthTable and Rules.

## Population
It is the container for Individuals, and represents all the elements in the world that can be mapped in the variables of the existing Functions.

## Functionality
It is the container of Functions. Together with the Individuals represent all the available Sentences in the world.

## TruthTable
It is the container of Sentences. All the Sentences that can be found in the TruthTable represent what is true in the world.

## Rules
It is the container of Axioms. The combination of the axioms analysed with a proper algorithm can lead to deduce conclusions.

# Quantifiers
The library provides two quantifiers: universal and existencial. They can be used combined with a world representation to derermine if all the elements in the world fulfill a condition, or if almost one element in the world fulfills a condition.

# Reasoners
The library provides an implementation of the Modus Ponens that can be uses together with a world representation to deduce new conclusions.