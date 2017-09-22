package com.approom.tasklist.service;

import com.AppUtils;
import com.service.taskScheduler.AbstractServiceTask;
import com.approom.tasklist.entity.Task;
import com.approom.tasklist.entity.TaskState;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ServiceTaskArchiveTask extends AbstractServiceTask {

    TaskService entityService;

    // ToDo
    @Value("${mailSenderService.link_app}")
    static private String fileName= "D:\\archiveTask.yaml";

    public ServiceTaskArchiveTask(){

    }

    public ServiceTaskArchiveTask(TaskService entityService) {
        super();
        setTaskName("ArchiveService");
    }

    @Override
    protected boolean runServiceTask() {

        File file = new File(fileName);
        if (!file.exists() && !file.canRead() && !file.isFile()){
            try {
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        List<Task> archiveTaskList = new ArrayList<>();
        try {
            archiveTaskList = (List<Task>) AppUtils.getObjectFromYaml(fileName);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        List<Task> taskList = entityService.getAll();
        for (Task task : taskList) {
            if (task.getState() == TaskState.DONE) {
                entityService.deleteEntity(task.getId());
                Task archiveTask = AppUtils.initializeAndUnproxy(task);
                archiveTaskList.add(archiveTask);
                System.out.println(" - Task " + archiveTask.toString() + " arhived");
            }
        }

        if (archiveTaskList.size() != 0) {
            AppUtils.saveObjectToYaml(archiveTaskList, fileName);
        }

        return true;
    };

}
