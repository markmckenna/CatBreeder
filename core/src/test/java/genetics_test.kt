package com.lantopia.catbreeder

import org.junit.Test

import org.junit.Assert.*
import kotlin.random.Random

class GeneticsTest {
    @Test fun `empty gene sequence is interpreted correctly`()
        = assertEquals(geneSequenceOf().size, 0)

    @Test fun `single gene works`() {
        val randomNumberGenerator = Random(0)
        val expectedGene: Gene = randomNumberGenerator.nextGene()
        val geneSequence: GeneSequence = geneSequenceOf(expectedGene)
        val firstGene: Gene = geneSequence[0]
        assertEquals(firstGene, expectedGene)
    }
}
