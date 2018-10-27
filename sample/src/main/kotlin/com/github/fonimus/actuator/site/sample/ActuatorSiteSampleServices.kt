package com.github.fonimus.actuator.site.sample

import org.springframework.boot.actuate.health.AbstractHealthIndicator
import org.springframework.boot.actuate.health.Health
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import org.springframework.web.bind.annotation.RestController
import java.lang.IllegalArgumentException

@RestController
@RequestMapping("/api")
class RestController {
    @GetMapping
    fun get() {

    }
    @PutMapping
    fun put() {

    }

    @DeleteMapping
    fun delete() {

    }

    @PatchMapping
    fun patch() {

    }

    @RequestMapping(method = [RequestMethod.TRACE])
    fun trace() {

    }

    @RequestMapping(method = [RequestMethod.HEAD])
    fun head() {

    }

    @RequestMapping(method = [RequestMethod.OPTIONS])
    fun options() {

    }
}

@Component
class HealthyService : AbstractHealthIndicator() {

    override fun doHealthCheck(builder: Health.Builder?) {
        builder!!.up().withDetail("test", "value")
    }

}

@Component
class UnhealthyService : AbstractHealthIndicator() {

    override fun doHealthCheck(builder: Health.Builder?) {
        builder!!.down(IllegalArgumentException("test"))
    }

}

@Component
@Scope(value = "prototype")
class SamplePrototype

@Component
@Scope(value = "prototype")
class OtherSamplePrototype
