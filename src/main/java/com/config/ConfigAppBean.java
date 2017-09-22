package com.config;

import com.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
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
        sessionFactory.setPackagesToScan("com.entity", "com.approom.tasklist.entity");
        return sessionFactory;
    }
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyConfigIn() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
