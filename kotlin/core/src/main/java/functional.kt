package com.lantopia.catbreeder

/** Produces an [Iterable] that repeats each argument [times] times before moving on.
 *
 * Elements are repeated sequentially to avoid having to buffer the full incoming
 * iterable, which enables this to be applied to infinite iterables. */
fun <E> Iterable<E>.repeat(times: Int) = Iterable {
    val delegate = iterator()

    iterator {
        while (delegate.hasNext()) {
            val next = delegate.next()
            repeat(times) { yield(next) }
        }
    }
}
