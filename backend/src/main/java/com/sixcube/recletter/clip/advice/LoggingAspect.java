package com.sixcube.recletter.clip.advice;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

//    @Before("execution(* com.sixcube.recletter.clip.controller.*.*(..))")
//    public void logBefore(JoinPoint joinPoint){
//        log.info("Advice Before: "+joinPoint.getSignature().getName());
//    }

//    @After("execution(* com.sixcube.recletter.clip.controller.*.*(..))")
//    public void logAfter(JoinPoint joinPoint){
//        log.info("Advice After: "+joinPoint.getSignature().getName());
//    }

    @Around("execution(* com.sixcube.recletter.clip.controller.*.*(..))")
    public Object timeLogAround(ProceedingJoinPoint joinPoint) throws Throwable{
        StopWatch stopWatch=new StopWatch();
        log.info("Around before: "+joinPoint.getSignature().getName());
        try{
            stopWatch.start();
            Object result=joinPoint.proceed();
            return result;
        } finally {
            stopWatch.stop();
            log.info(stopWatch.getTotalTimeMillis()+"ms");
            log.info("Around After: "+joinPoint.getSignature().getName());
        }


    }


}
