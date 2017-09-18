package com.controller;

import com.approom.tasklist.service.ServiceTaskArchiveTask;
import com.approom.tasklist.service.ServiceTaskSendMailForAuthor;
import com.approom.tasklist.service.TaskService;
import com.service.MailSender;
import com.service.taskScheduler.TaskScheduler;
import freemarker.template.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/appTaskList/system/taskScheduler")
public class TaskSchedulerController {
    @Autowired
    TaskService taskService;

    @Autowired
    private TaskScheduler taskExecutor;
    @Autowired
    private Configuration freemarkerConfig;
    @Autowired
    private TaskService entityService;
    @Autowired
    private MailSender appMailSender;

    @RequestMapping("/runArchiveService")
    @ResponseBody
    public Map<String, Object> runArchiveService(){
        taskExecutor.putTask(new ServiceTaskArchiveTask(taskService));
        return AjaxResponse.successResponse("Don");
    }

    @RequestMapping("/stopArchiveService")
    @ResponseBody
    public Map<String, Object> stopArchiveService(){
        taskExecutor.interruptTask("ArchiveService");
        return AjaxResponse.successResponse("Don");
    }

    @RequestMapping("/sendMail")
    @ResponseBody
    public Map<String, Object> sendMail(){
        taskExecutor.putTask(new ServiceTaskSendMailForAuthor(entityService, appMailSender, freemarkerConfig));
        return AjaxResponse.successResponse("Don");
    }
    @RequestMapping("/stopSendMail")
    @ResponseBody
    public Map<String, Object> stopSendMail(){
        taskExecutor.interruptTask("MailSendService");
        return AjaxResponse.successResponse("Don");
    }

    @RequestMapping("/interruptTaskExecutor")
    @ResponseBody
    public Map<String, Object> interruptTaskExecutor(){
        taskExecutor.interrupt();
        return AjaxResponse.successResponse("Don");
    }

}
