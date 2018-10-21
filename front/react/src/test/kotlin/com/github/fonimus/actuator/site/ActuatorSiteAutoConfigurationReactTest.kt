package com.github.fonimus.actuator.site

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.actuate.autoconfigure.condition.ConditionsReportEndpoint
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.web.util.UriComponentsBuilder
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import java.util.*


@RunWith(SpringRunner::class)
@SpringBootApplication
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = [ActuatorSiteAutoConfigurationReactTest::class],
        properties = ["actuator.site.type=react"])
class ActuatorSiteAutoConfigurationReactTest {

    @Autowired
    lateinit var conditionsReportEndpoint: ConditionsReportEndpoint

    val restTemplate = TestRestTemplate()

    @LocalServerPort
    var port: Int = 0

    @Test
    fun contextLoads() {
        val conditions = conditionsReportEndpoint.applicationConditionEvaluation()
        assertEquals(1, conditions.contexts.size)
        assertTrue(conditions.contexts.iterator().next().value.positiveMatches.containsKey(ActuatorSiteAutoConfiguration::class.java.simpleName))

        val headers = HttpHeaders()
        val auth = "user:password"
        val encodedAuth = Base64.getEncoder().encodeToString(auth.toByteArray())
        val authHeader = "Basic $encodedAuth"
        headers.set(HttpHeaders.AUTHORIZATION, authHeader)
        val response = restTemplate.exchange(UriComponentsBuilder.fromUriString("http://localhost").port(port)
                .path("/actuator/site/").build().toUri(), HttpMethod.GET, HttpEntity(null, headers), String::class.java)
        assertEquals(200, response.statusCodeValue)
        assertThat(response.body).contains("[ React Boot ]")
    }

}
