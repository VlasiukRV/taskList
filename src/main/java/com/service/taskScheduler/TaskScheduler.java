package com.service.taskScheduler;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class TaskScheduler extends Thread{

    private int MAX_RUNNING_TASK = 5;
    private int runningTaskCount;
    private volatile Map<String, IServiceTask> taskPool = new HashMap<>();

    public TaskScheduler(){

    }

    public Boolean putTask(IServiceTask serviceTask){
        String taskName = serviceTask.getTaskName();
        if(taskPool.containsKey(taskName)) {
            return false;
        }

        taskPool.put(taskName, serviceTask);

        runService();
        return true;
    }

    public IServiceTask getTaskByName(String taskName){
        if(taskPool.containsKey(taskName)) {
            return taskPool.get(taskName);
        }
        return null;
    }

    public Boolean removeTask(IServiceTask serviceTask){
        String taskName = serviceTask.getTaskName();
        if(taskPool.containsKey(taskName)) {
            return false;
        }

        taskPool.remove(taskName);

        return true;
    }

    public void interruptTask(String serviceTaskName){
        interruptTask(getTaskByName(serviceTaskName));
    }

    public void interruptTask(IServiceTask serviceTask){
        if(serviceTask != null){
            serviceTask.stopTask();
        }
    }

    public void runService(){
        if (!isAlive()){
            start();
        };
    }

    @Override
    public void run() {
        System.out.println("Task executor run");
        do {
            if (Thread.interrupted())    //Проверка прерывания
            {
                interruptTasks();
                break;
            }

            Set<String> tasksName = taskPool.keySet();
            for (String taskName : tasksName) {
                handleTask(taskPool.get(taskName));
            }

            try {
                Thread.sleep(5000);        //Приостановка потока на 1 сек.
            } catch (InterruptedException e) {
                break;    //Завершение потока после прерывания
            }
        }
        while (true);
        interruptTasks();
        System.out.println("Task executor stop");
    }

    private void handleTask(IServiceTask serviceTask){
        if(!serviceTask.isRun()){
            if (runningTaskCount <= MAX_RUNNING_TASK) {
                serviceTask.start();
                runningTaskCount++;
            }
        }else if (serviceTask.isExecute()){
            removeTask(serviceTask);
            runningTaskCount--;
        }
    }

    private void interruptTasks() {
        Set<String> tasksName = taskPool.keySet();
        for (String taskName : tasksName) {
            IServiceTask task = taskPool.get(taskName);
            if (task.isRun()){
                task.stopTask();
            }
        }

    }
}
