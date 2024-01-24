package com.sixcube.recletter.aspect;

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

   // 모든 컨트롤러 메서드에 시작, 끝 로그 적용 및 메서드 실행시간 측정
    @Around("execution(* com.sixcube.recletter.*.controller.*.*(..))")
    public Object timeLogAround(ProceedingJoinPoint joinPoint) throws Throwable{
        StopWatch stopWatch=new StopWatch();

        String controllerName=joinPoint.getSignature().getDeclaringType().getName().split("[.]")[5];
        String methodName=joinPoint.getSignature().getName();

        //메서드 시작시 로그 > "컨트롤러명.메서드명 : start"
        log.debug(controllerName+"."+methodName+" : start");
        try{
            stopWatch.start();
            return joinPoint.proceed();
        } finally {
            stopWatch.stop();
            //메서드 종료시 로그 > "컨트롤러명.메서드명 : end(걸린 시간ms)"
            log.debug(controllerName+"."+methodName+" : end("+stopWatch.getTotalTimeMillis()+"ms)");
        }


    }


}
