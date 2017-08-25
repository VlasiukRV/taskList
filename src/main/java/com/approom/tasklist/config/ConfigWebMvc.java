package com.approom.tasklist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Configure web MVC component of application
 * extends {@link org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter}.
 *
 * @author Roman Vlasiuk
 */
@Configuration
public class ConfigWebMvc extends WebMvcConfigurerAdapter {

    public ConfigWebMvc() {
        super();
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

        registry.addViewController("/").setViewName("templates/index.html");
        registry.addViewController("/appRoom").setViewName("templates/index.html");
        registry.addViewController("/login").setViewName("templates/login.html");

        String taskListUrl = "/appTaskList";
        registry.addViewController("/taskList").setViewName("templates/taskList.html");
        registry.addViewController(taskListUrl).setViewName("templates/taskListApp.html");
        registry.addViewController(taskListUrl+"/security/usersList").setViewName("/templates/usersListEdit.html");
        registry.addViewController(taskListUrl+"/security/roleList").setViewName("/templates/rolesListEdit.html");
        registry.addViewController(taskListUrl+"/currentPrincipalInformation").setViewName("templates/viewCurrentPrincipalInformation.html");
        // ????? Todo
        registry.addViewController("/projectsList").setViewName("templates/projectsListEdit.html");
        registry.addViewController("/tasksList").setViewName("templates/tasksListEdit.html");

    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("")
                .addResourceLocations("/resources/")
                .setCachePeriod(3600)
                .resourceChain(true);
    }

}
