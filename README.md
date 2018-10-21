# VueBoot: Actuator Site in Vue.js for Spring Boot

[![Build Status](https://travis-ci.org/fonimus/actuator-site-spring-boot.svg?branch=master)](https://travis-ci.org/fonimus/actuator-site-spring-boot)
[![Maven Central](https://img.shields.io/maven-central/v/com.github.fonimus/actuator-site-spring-boot-parent.svg?label=%22maven%20central%22)](https://search.maven.org/search?q=g:%22com.github.fonimus%22%20AND%20a:%22actuator-site-spring-boot-starter%22)

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

Please check [ActuatorSiteAutoConfiguration.java](starter/src/main/kotlin/com/github/fonimus/vueboot/VueBootAutoConfiguration.java) for more information.

```yaml
actuator:
  site:
    # set it to false to disable auto configuration
    enabled: true
    # path will be ${context-path}/${actuator-base-path}/site
    site-path: /site
    # front type, 'vue' or 'react'
    type: vue
    # if the actuator web site should be loaded form another directory
    resource-path: classpath:/webjars/actuator-site/
```

**Note:**: In order to get site, you need to have corresponding dependency **actuator-site-spring-boot-[type]**

## Sample

Sample with provided configuration [application.yml](./sample/src/main/resources/application.yml). 

1. Build sample application

    ```bash
    mvn clean install -DskipTests
    ```
1. Start application

    ```bash
    java -jar sample/target/actuator-site-spring-boot-sample-[version].jar
    ```  
    
1. Go to http://localhost:8080/actuator/site/ , with `user:password` authentication
