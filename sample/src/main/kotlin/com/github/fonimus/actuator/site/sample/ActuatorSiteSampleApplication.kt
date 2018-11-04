package com.github.fonimus.actuator.site.sample

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.runApplication

@SpringBootApplication
class ActuatorSiteSampleApplication

fun main(args: Array<String>) {
    SpringApplicationBuilder(ActuatorSiteSampleApplication::class.java)
            //.profiles("profile-1", "profile-2")
            .run(*args)
    // TODO create child applications for example
}
