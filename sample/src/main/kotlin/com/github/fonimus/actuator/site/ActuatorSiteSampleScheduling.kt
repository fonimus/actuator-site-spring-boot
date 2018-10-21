package com.github.fonimus.actuator.site

import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
@EnableScheduling
class ActuatorSiteSampleScheduling {

    @Scheduled(cron = "0/10 * * * * *")
    fun cron10seconds() {

    }

    @Scheduled(cron = "0/30 * * * * *")
    fun cron30seconds() {

    }

    @Scheduled(fixedDelay = 5000)
    fun fixedDelay5seconds() {

    }

    @Scheduled(fixedRate = 3000)
    fun fixedRate3seconds() {

    }
}
