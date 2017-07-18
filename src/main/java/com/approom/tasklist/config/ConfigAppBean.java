package com.approom.tasklist.config;

import com.approom.tasklist.web.security.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.servlet.http.HttpSessionListener;

/**
 * Init bean for application {@link org.springframework.context.annotation.Bean}.
 *
 * @author Roman Vlasiuk
 */
@Configuration
public class ConfigAppBean {

    @Bean
    @Autowired
    public HttpSessionListener httpSessionListener(SecurityService securityService){
        return securityService;
    }

}
