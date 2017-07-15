package com.tasklist.web.controller;

import com.tasklist.app.service.taskScheduler.IServiceTask;
import com.tasklist.app.service.taskScheduler.ServiceTaskArchiveTask;
import com.tasklist.app.service.taskScheduler.TaskScheduler;
import com.tasklist.app.task.TaskService;
import com.tasklist.web.AjaxResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/system/taskScheduler")
public class TaskSchedulerController {
    @Autowired
    TaskService taskService;

    @Autowired
    private TaskScheduler taskExecutor;

    @RequestMapping("/runArchiveService")
    @ResponseBody
    public Map<String, Object> runArchiveService(){
        taskExecutor.start();

        ServiceTaskArchiveTask archiveService = new ServiceTaskArchiveTask("ArchiveService");
        archiveService.setEntityService(taskService);
        taskExecutor.putTask(archiveService);
        return AjaxResponse.successResponse("Don");
    }

    @RequestMapping("/stopArchiveService")
    @ResponseBody
    public Map<String, Object> stopArchiveService(){
        IServiceTask archiveService = taskExecutor.getTaskByName("ArchiveService");
        if(archiveService != null){
            archiveService.stopTask();
        }
        return AjaxResponse.successResponse("Don");
    }

    @RequestMapping("/interruptTaskExecutor")
    @ResponseBody
    public Map<String, Object> interruptTaskExecutor(){
        taskExecutor.interrupt();
        return AjaxResponse.successResponse("Don");
    }

}
