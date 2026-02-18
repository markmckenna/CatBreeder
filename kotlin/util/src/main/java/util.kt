package com.lantopia.catbreeder

import java.lang.AssertionError

var debugging: Boolean = false

inline fun validate(message: String, condition: () -> Boolean) {
    if (debugging && !condition()) throw AssertionError(message)
}
