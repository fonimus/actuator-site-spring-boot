package com.github.fonimus.actuator.site

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean

/**
 *
 * React actuator site auto configuration.
 */
@ConditionalOnBean(ActuatorSiteAutoConfiguration::class)
class ReactActuatorSiteAutoConfiguration
