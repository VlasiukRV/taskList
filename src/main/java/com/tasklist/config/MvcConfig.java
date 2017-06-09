package com.tasklist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {

/*
    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/view/");
        resolver.setSuffix("");
        return resolver;
    }
*/

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("templates/index.html");
        registry.addViewController("/login").setViewName("templates/login.html");

        registry.addViewController("/projectsList").setViewName("templates/projectsListEdit.html");
        registry.addViewController("/usersList").setViewName("templates/usersListEdit.html");
        registry.addViewController("/tasksList").setViewName("templates/tasksListEdit.html");
    }
}
