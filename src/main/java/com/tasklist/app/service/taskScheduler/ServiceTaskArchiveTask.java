package com.tasklist.app.service.taskScheduler;

import com.tasklist.AppUtils;
import com.tasklist.app.task.Task;
import com.tasklist.app.task.TaskService;
import com.tasklist.app.task.TaskState;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class ServiceTaskArchiveTask extends Thread implements IServiceTask {

    TaskService entityService;

    private String taskName = "";
    private Boolean execute = false;

    private String fileName = "E:\\Work\\archiveTask.yaml";


    public ServiceTaskArchiveTask(String taskName) {
        this.taskName = taskName;
        this.execute = false;
    }

    public void setEntityService(TaskService entityService){
        this.entityService = entityService;
    }

    @Override
    public String getTaskName() {
        return taskName;
    }

    @Override
    public Boolean isExecute() {
        return execute;
    }

    @Override
    public Boolean isRun() {
        return isAlive();
    }

    public void stopTask(){
        this.interrupt();
    }

    @Override
    public void run() {
        System.out.println("Archive_Task start");
        do {
            if (Thread.interrupted())    //Проверка прерывания
            {
                break;
            }

            List<Task> archiveTaskList = new ArrayList<>();
            try {
                archiveTaskList = (List<Task>) AppUtils.getObjectFromYaml(fileName);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }

            List<Task> taskList = entityService.getAll();
            for (Task task : taskList) {
                if (task.getState() == TaskState.DONE){
                    entityService.deleteEntity(task.getId());
                    Task archiveTask = AppUtils.initializeAndUnproxy(task);
                    archiveTaskList.add(archiveTask);
                    System.out.println(" - Task " +archiveTask.toString()+ " arhived");
                }
            }

            if (archiveTaskList.size() != 0){
                AppUtils.saveObjectToYaml(archiveTaskList, fileName);
            }

            try {
                Thread.sleep(10000);        //Приостановка потока на 1 сек.
            } catch (InterruptedException e) {
                break;    //Завершение потока после прерывания
            }
        }
        while (true);
        execute = true;
        System.out.println("Archive_Task stop");
    }

}
