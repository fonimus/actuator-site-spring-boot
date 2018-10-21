package com.github.fonimus.actuator.site

import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 *
 * Actuator site auto configuration.
 *
 * Activated by default. Disable it with actuator.site.enabled=false
 */
@ConditionalOnClass(name = ["org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties"])
@ConditionalOnProperty(name = ["actuator.site.enabled"], havingValue = "true", matchIfMissing = true)
@ConfigurationProperties(prefix = "actuator.site")
class ActuatorSiteAutoConfiguration(private val properties: org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties) : WebMvcConfigurer {

    val log = LoggerFactory.getLogger(ActuatorSiteAutoConfiguration::class.java)

    var isEnabled = true

    var sitePath = "/site"

    var resourcePath = "classpath:/webjars/actuator-site/"

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        log.info("Mapped [{}{}] onto boot actuator site [resources-path=$resourcePath]", properties.basePath, sitePath)
        registry
                .addResourceHandler(properties.basePath + sitePath + "/**")
                .addResourceLocations(resourcePath)
    }

    override fun addViewControllers(registry: ViewControllerRegistry) {
        registry
                .addViewController(properties.basePath + sitePath + "/")
                .setViewName("forward:" + properties.basePath + sitePath + "/index.html")
    }
}
