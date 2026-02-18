package com.lantopia.catbreeder

import com.badlogic.gdx.graphics.Texture
import com.badlogic.gdx.graphics.g2d.SpriteBatch
import com.badlogic.gdx.utils.ScreenUtils
import com.lantopia.catbreeder.util.*
import kotlin.random.Random

class Main : RenderableAdapter(
    {
        object : Renderable {
            private val batch = SpriteBatch()
            private val img = Texture("badlogic.jpg")

            override fun render() {
                ScreenUtils.clear(
                    115f / 255f,
                    81f / 255f,
                    42f / 255f,
                    1f
                )

                batch.begin()
                batch.draw(img, 3f, 0f)
                batch.end()
            }

            override fun dispose() {
                batch.dispose()
                img.dispose()
            }
        }
    })

