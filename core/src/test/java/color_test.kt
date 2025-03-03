package com.lantopia.catbreeder

import org.junit.Assert.*
import org.junit.Test

class ColorTest {
    @Test fun `Can parse 255`() = assertEquals((-1).toByte(), parseByte("ff", 16))
}
