# Actuator Site for Spring Boot

[![Build Status](https://travis-ci.org/fonimus/actuator-site-spring-boot.svg?branch=master)](https://travis-ci.org/fonimus/actuator-site-spring-boot)
[![Maven Central](https://img.shields.io/maven-central/v/com.github.fonimus/actuator-site-spring-boot-vue.svg?label=%22maven%20vue%20starter%22)](https://search.maven.org/search?q=g:%22com.github.fonimus%22%20AND%20a:%22actuator-site-spring-boot-vue%22)
[![Maven Central](https://img.shields.io/maven-central/v/com.github.fonimus/actuator-site-spring-boot-react.svg?label=%22maven%20react%20starter%22)](https://search.maven.org/search?q=g:%22com.github.fonimus%22%20AND%20a:%22actuator-site-spring-boot-react%22)

This project contains both the web site and the spring boot auto configuration. Check the 
[vue](https://fonimus.github.io/actuator-site-spring-boot/docs/vue/#/)
and [react](https://fonimus.github.io/actuator-site-spring-boot/docs/react/#/) demos.

## Getting started

### Dependency

```xml
<!-- choose between front type: vue or react -->
<dependency>
    <groupId>com.github.fonimus</groupId>
    <artifactId>actuator-site-spring-boot-vue</artifactId>
</dependency>
<!-- or -->
<dependency>
    <groupId>com.github.fonimus</groupId>
    <artifactId>actuator-site-spring-boot-react</artifactId>
</dependency>
```

**Note:**: auto configuration `ActuatorSiteAutoConfiguration` can be deactivated by property **actuator.site.enabled=false**

## Configuration

Please check [ActuatorSiteAutoConfiguration.kt](starter/src/main/kotlin/com/github/fonimus/actuator/site/ActuatorSiteAutoConfiguration.kt) for more information.

```yaml
actuator:
  site:
    # set it to false to disable auto configuration
    enabled: true
    # path will be ${context-path}/${actuator-base-path}/site
    site-path: /site
    # if the actuator web site should be loaded form another directory, or if you want to use custom web site
    resource-path: classpath:/webjars/actuator-site/
```

## Sample

Sample with provided configuration [application.yml](./sample/src/main/resources/application.yml). 

1. Build sample application (use `react` profile to build sample with react dependency)

    ```bash
    mvn clean install [-DskipTests] [-P react]
    ```
1. Start application

    ```bash
    java -jar sample/target/actuator-site-spring-boot-sample-[version].jar
    ```  
    
1. Go to http://localhost:8080/actuator/site/ , with `user:password` authentication

## Release note

### 0.4.0

* Small updates for vue front site
* Implement react with [material ui](https://material-ui.com/)

### 0.3.0

* Use [vuetifyjs](https://vuetifyjs.com/en/) for vue front site

### 0.2.0

* Fix project without actuator dependency failure
* Fix health without details error
* Display home message if not endpoint available
* Add links to actuator endpoint

### 0.1.0

* First release
