package com.github.fonimus.actuator.site

import org.springframework.boot.actuate.health.AbstractHealthIndicator
import org.springframework.boot.actuate.health.Health
import org.springframework.stereotype.Component
import java.lang.IllegalArgumentException

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
