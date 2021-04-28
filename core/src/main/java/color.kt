package com.lantopia.catbreeder

import java.lang.Integer.parseUnsignedInt

data class Color(
    val red: Byte,
    val green: Byte,
    val blue: Byte
) {
    val genes = geneSequenceOf(red, green, blue)

    constructor(genome: GeneSequence) : this(genome[0], genome[1], genome[2])

    constructor(rgbString: String) : this(
        parseByte(rgbString, 16),
        parseByte(rgbString.drop(2), 16),
        parseByte(rgbString.drop(4), 16))
}

fun parseByte(str: String, radix: Int) = parseUnsignedInt(str.take(2), radix).toByte()
