package com.lantopia.catbreeder

import kotlin.math.sqrt

/** Transform a [ByteArray] to a [DoubleArray]. */
fun ByteArray.asDoubleArray() = DoubleArray(size).also { out ->
    for (i in 0 until size) out[i] = this[i].toDouble()
}

/** The dot product of this and another [ByteArray] of equal length.
 *
 * The result is promoted to a [Long] to ensure room for the product.
 */
infix fun ByteArray.dot(other: ByteArray): Long =
    foldIndexed(0L) { i, acc, cur -> acc + cur.toShort() * other[i].toShort() }

/** Compute the sum of squares for the array. */
val ByteArray.sumOfSquares: Long get() = sumOf { it.toLong()*it }

/** Compute the cosine similarity of two arrays. */
fun cosineSimilarity(left: ByteArray, right: ByteArray) =
    (left dot right) / (sqrt(left.sumOfSquares.toDouble()) * sqrt(right.sumOfSquares.toDouble()))
