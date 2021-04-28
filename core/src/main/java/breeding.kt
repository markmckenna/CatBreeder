package com.lantopia.catbreeder

/** Measurement of how good an individual is for a given environment */
typealias FitnessValue = Double
typealias Population<T> = List<T>

/** The kind of thing we're breeding */
abstract class Animal(
    val genome: GeneSequence
)

/** The process used to do the breeding */
interface BreedingProcess<T : Animal> {
    /** Measures how fit a particular individual is for a given environment */
    fun evaluate(individual: T): FitnessValue

    /** Selects which individuals will be bred for the next round */
    fun selectBreedingPairsFrom(population: Map<T, FitnessValue>): Iterable<Pair<T, T>>

    /** Breeds two individuals together to yield a third individual */
    fun breed(left: GeneSequence, right: GeneSequence): GeneSequence

    /** Randomly modifies a genome (or not) */
    fun mutate(genome: GeneSequence): GeneSequence

    fun grow(genome: GeneSequence): T
}

/** Steps forward one iteration to produce a new set of individuals through artificial selection process */
fun <T : Animal> BreedingProcess<T>.iterate(population: Population<T>): Population<T> =
    population.associateWith { evaluate(it) }
        .let { selectBreedingPairsFrom(it) }
        .map { (first, second) -> breed(first.genome, second.genome) }
        .map { mutate(it) }
        .map { grow(it) }

/** Uses a [BreedingProcess] to produce a new generation from an older generation. */
fun <T : Animal> Population<T>.breedWith(process: BreedingProcess<T>) = process.iterate(this)
