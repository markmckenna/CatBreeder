package com.lantopia.catbreeder

import kotlin.math.pow
import kotlin.math.sqrt

/** The dot product of this and another array of equal length.
 *
 * The dot product is the total sum of the products of each pair of elements.
 */
infix fun DoubleArray.dot(other: DoubleArray) =
    foldIndexed(0.0) { i, acc, cur -> acc + cur * other[i] }

/** Compute the sum of squares for the array. */
val DoubleArray.sumOfSquares get() = sumOf { it.pow(2) }

/** Compute the cosine similarity of two arrays. */
fun cosineSimilarity(left: DoubleArray, right: DoubleArray) =
    (left dot right) / (sqrt(left.sumOfSquares) * sqrt(right.sumOfSquares))


