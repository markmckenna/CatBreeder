package com.lantopia.catbreeder.util

import com.badlogic.gdx.ApplicationAdapter

open class RenderableAdapter(
    private val factory: () -> Renderable
) : ApplicationAdapter() {
    private var instance: Renderable? = null

    override fun create() {
        instance = factory()
    }

    override fun render() {
        instance?.render()
    }

    override fun dispose() {
        instance?.dispose()
        instance = null
    }
}

interface Renderable {
    fun render()
    fun dispose()
}
