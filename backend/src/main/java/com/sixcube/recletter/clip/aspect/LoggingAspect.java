package com.sixcube.recletter.clip.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.sixcube.recletter.*.controller.*.*(..))")
    public Object timeLogAround(ProceedingJoinPoint joinPoint) throws Throwable{
        StopWatch stopWatch=new StopWatch();

        String controllerName=joinPoint.getSignature().getDeclaringType().getName().split("[.]")[5];
        String methodName=joinPoint.getSignature().getName();
        log.debug(controllerName+"."+methodName+" : start");
        try{
            stopWatch.start();
            return joinPoint.proceed();
        } finally {
            stopWatch.stop();

            log.debug(controllerName+"."+methodName+" : end");
            log.debug("It took "+stopWatch.getTotalTimeMillis()+"ms");
        }


    }


}
