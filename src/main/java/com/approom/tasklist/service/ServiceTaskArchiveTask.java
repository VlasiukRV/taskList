package com.approom.tasklist.service;

import com.AppUtils;
import com.service.taskScheduler.AbstractServiceTask;
import com.approom.tasklist.entity.Task;
import com.approom.tasklist.entity.TaskState;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class ServiceTaskArchiveTask extends AbstractServiceTask {

    TaskService entityService;

    private String fileName = "E:\\Work\\archiveTask.yaml";

    public ServiceTaskArchiveTask(TaskService entityService) {
        super();
        setTaskName("ArchiveService");
    }

    @Override
    protected boolean runServiceTask() {
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
