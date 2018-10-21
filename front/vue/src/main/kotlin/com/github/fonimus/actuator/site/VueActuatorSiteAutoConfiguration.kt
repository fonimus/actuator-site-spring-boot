package com.github.fonimus.actuator.site

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean

/**
 *
 * Vue actuator site auto configuration.
 */
@ConditionalOnBean(ActuatorSiteAutoConfiguration::class)
class VueActuatorSiteAutoConfiguration
