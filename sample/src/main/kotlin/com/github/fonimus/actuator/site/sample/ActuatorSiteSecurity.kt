package com.github.fonimus.actuator.site.sample

import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

@EnableWebSecurity
class ActuatorSiteSecurity : WebSecurityConfigurerAdapter() {
    override fun configure(http: HttpSecurity?) {
        http!!.csrf().disable()
        super.configure(http)
    }
}
