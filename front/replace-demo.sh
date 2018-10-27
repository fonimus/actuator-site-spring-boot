#!/bin/bash

rm -Rf demo/actuator/*

curl -u user:password "http://localhost:8080/actuator" -o demo/actuator/actuator
curl -u user:password "http://localhost:8080/actuator/auditevents" -o demo/actuator/auditevents
curl -u user:password "http://localhost:8080/actuator/beans" -o demo/actuator/beans
curl -u user:password "http://localhost:8080/actuator/conditions" -o demo/actuator/conditions
curl -u user:password "http://localhost:8080/actuator/configprops" -o demo/actuator/configprops
curl -u user:password "http://localhost:8080/actuator/env" -o demo/actuator/env
curl -u user:password "http://localhost:8080/actuator/health" -o demo/actuator/health
curl -u user:password "http://localhost:8080/actuator/httptrace" -o demo/actuator/httptrace
curl -u user:password "http://localhost:8080/actuator/info" -o demo/actuator/info
# curl -u user:password "http://localhost:8080/actuator/loggers" -o demo/actuator/loggers
curl -u user:password "http://localhost:8080/actuator/mappings" -o demo/actuator/mappings
curl -u user:password "http://localhost:8080/actuator/metrics" -o demo/actuator/metrics
curl -u user:password "http://localhost:8080/actuator/scheduledtasks" -o demo/actuator/scheduledtasks
curl -u user:password "http://localhost:8080/actuator/threaddump" -o demo/actuator/threaddump
