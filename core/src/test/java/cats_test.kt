package com.lantopia.catbreeder

import org.junit.Assert.*
import org.junit.Test
import kotlin.random.Random

class CatsTest {
    @Test
    fun `White cats should breed true`() {
        val rnd = Random(0)
        val program = CatBreeding(rnd)
        val parents = populationOf(Cat(Color("ffffff")), Cat(Color("ffffff")))
        val kids = program.iterate(parents)
        assertEquals(parents, kids)
    }

    @Test
    fun `Breeding program should have predictable outcomes`() {
        val rnd = Random(0)
        val program = CatBreeding(rnd)

        val parents = rnd.nextCatPopulation(2)
        val kids = program.iterate(parents)

        assertEquals(parents, kids)
    }
}
