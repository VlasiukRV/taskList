package com.tasklist.web;

import com.tasklist.app.service.IServiceTask;
import com.tasklist.app.service.TaskExecutor;
import com.tasklist.app.task.TaskArchiveService;
import com.tasklist.app.task.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/system")
public class SystemController {

    @Autowired
    IAuthenticationFacade authenticationFacade;
    @Autowired
    TaskService taskService;

    @Autowired
    private TaskExecutor taskExecutor;

    @RequestMapping("/principal")
    @ResponseBody
    public Principal user(Principal user) {
        return user;
    }

    @RequestMapping("/getCurrentAuthentication")
    @ResponseBody
    public Map<String, Object> currentAuthentication(HttpServletRequest request, Principal user) {
        Map<String, String> currentAuthentication = new HashMap<>();
        currentAuthentication.put("userName", authenticationFacade.getAuthentication().getName());
        return AjaxResponse.successResponse(currentAuthentication);
    }

    @RequestMapping("/task/runArchiveService")
    @ResponseBody
    public Map<String, Object> runArchiveService(){
        taskExecutor.start();

        TaskArchiveService archiveService = new TaskArchiveService("ArchiveService");
        archiveService.setEntityService(taskService);
        taskExecutor.putTask(archiveService);
        return AjaxResponse.successResponse("Don");
    }

    @RequestMapping("/task/stopArchiveService")
    @ResponseBody
    public Map<String, Object> stopArchiveService(){
        IServiceTask archiveService = taskExecutor.getTaskByName("ArchiveService");
        if(archiveService != null){
            archiveService.stopTask();
        }
        return AjaxResponse.successResponse("Don");
    }

    @RequestMapping("/task/interruptTaskExecutor")
    @ResponseBody
    public Map<String, Object> interruptTaskExecutor(){
        taskExecutor.interrupt();
        return AjaxResponse.successResponse("Don");
    }


}
