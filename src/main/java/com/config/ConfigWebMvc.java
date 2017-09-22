package com.config;

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

        registry.addViewController("/").setViewName("/templates/index.html");
        registry.addViewController("/appRoom").setViewName("/templates/index.html");
        registry.addViewController("/service/team").setViewName("/templates/team.html");
        registry.addViewController("/login").setViewName("/templates/login.html");

        String appTaskListUrl = "/appTaskList";
        registry.addViewController("/taskList").setViewName("/templates/taskList.html");
        registry.addViewController(appTaskListUrl)                                 .setViewName("/templates/appRoom/taskList/taskListApp.html");
        registry.addViewController(appTaskListUrl+"/security/usersList")           .setViewName("/templates/appRoom/taskList/usersListEdit.html");
        registry.addViewController(appTaskListUrl+"/security/roleList")            .setViewName("/templates/appRoom/taskList/rolesListEdit.html");
        registry.addViewController(appTaskListUrl+"/currentPrincipalInformation")  .setViewName("/templates/appRoom/taskList/viewCurrentPrincipalInformation.html");
        registry.addViewController(appTaskListUrl+"/projectsList")                 .setViewName("/templates/appRoom/taskList/projectsListEdit.html");
        registry.addViewController(appTaskListUrl+"/tasksList")                    .setViewName("/templates/appRoom/taskList/tasksListEdit.html");

        String appCashAccounting = "/appCashAccounting";
        registry.addViewController(appCashAccounting)                              .setViewName("/templates/appRoom/appCashAccounting/cashFlowApp.html");
        registry.addViewController(appCashAccounting+"/cashFlowList")              .setViewName("/templates/appRoom/appCashAccounting/cashFlowEdit.html");
        registry.addViewController(appCashAccounting+"/cashFlowItemList")          .setViewName("/templates/appRoom/appCashAccounting/cashFlowItemEdit.html");
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
