package com.lantopia.catbreeder

import kotlin.random.Random

data class Cat(
    val furColor: Color
) : Animal(
    geneSequenceOf(furColor.genes)
) {
    constructor(genome: GeneSequence) : this(Color(genome.sliceArray(0 until 3)))
}

fun Random.cat() = Cat(nextGenes(3))

/** An example way to breed cats to arrive at a goal. */
class CatBreeding(private val rnd: Random) : BreedingProcess<Cat> {
    /** The colour of sand */
    val sandColor = Color("c2b280")

    /** Prefer cats whose fur colour is similar to the sand colour defined above. */
    override fun evaluate(individual: Cat) =
        cosineSimilarity(sandColor.genes, individual.furColor.genes)

    /** Take the best five cats (if we have that many) and breed them down the line: 1 to 2, 2 to 3, 3 to 4, 4 to 5. */
    override fun selectBreedingPairsFrom(population: Map<Cat, FitnessValue>): Iterable<Pair<Cat, Cat>> =
        population.asIterable()
            .sortedBy { -1 * it.value }
            .take(5)
            .shuffled()
            .zipWithNext { a, b -> Pair(a.key, b.key) }
            .repeat(5)

    override fun breed(left: GeneSequence, right: GeneSequence) = randomConsistentBreed(
        rnd,
        left,
        right
    )

    override fun mutate(genome: GeneSequence): GeneSequence =
        genome // TODO: mutate by random bit swap

    /** Produce a new virtual cat from a given genetic sequence */
    override fun grow(genome: GeneSequence) = Cat(genome)
}
