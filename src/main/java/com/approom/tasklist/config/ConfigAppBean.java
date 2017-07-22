package com.approom.tasklist.config;

import com.approom.tasklist.app.service.SecurityService;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;

import javax.servlet.http.HttpSessionListener;
import javax.sql.DataSource;

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

    @Autowired
    @Bean(name = "sessionFactory")
    public LocalSessionFactoryBean getSessionFactory(DataSource dataSource) {
        LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setPackagesToScan("com.approom.tasklist.app.domain");
        return sessionFactory;
    }
}
