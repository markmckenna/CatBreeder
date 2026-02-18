package com.lantopia.catbreeder

import kotlin.experimental.and
import kotlin.experimental.xor
import kotlin.random.Random

typealias Gene = Byte

/** A sequence of genes comprising a serial group; possibly an entire individual's genome. */
typealias GeneSequence = ByteArray

/** An empty [GeneSequence]. Disambiguates below varargs. */
fun geneSequenceOf() = byteArrayOf()

/** A [GeneSequence] defined from a sequence of bytes (genes) */
fun geneSequenceOf(vararg values: Gene) = byteArrayOf(*values)

/** A [GeneSequence] defined as a fused sequence of smaller GeneSequences. */
fun geneSequenceOf(vararg sequences: GeneSequence): GeneSequence =
    sequences.fold(geneSequenceOf(), { acc, seq -> acc + seq })

fun Random.nextGene(): Gene = nextGenes(1)[0]
fun Random.nextGenes(size: Int): GeneSequence = nextBytes(size)

// The mechanism of breeding is more or less completely distinct from the species being bred
// (associated with the kind of genetic machinery we're using, rather). The species does retain
// control over gene expression (how the genes affect the visible and functional traits of the
// individual).
// - the mutation function should at least be parameterized with how often mutations occur.

fun randomConsistentBreed(
    randomness: Random,
    left: GeneSequence,
    right: GeneSequence
): GeneSequence {
    validate("Genes need to be the same length") { left.size == right.size }

    val count = left.size
    var out = randomness.nextBytes(count) // start with a fully random gene string

    for (i in 0 until count) {
        val l = left[i]
        val r = right[i]
        val bothOnes = l and r // 1 only where both sides are 1
        val bothZeroes = (l xor r) and bothOnes // 0 only where both sides are 0

        // TODO update random sequence to assert known values
    }

    return out
}
