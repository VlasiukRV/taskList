package com.approom.tasklist.proba;

import com.service.taskScheduler.IServiceTask;

public class TaskProba extends Thread implements IServiceTask {
    private String taskName = "";
    private Boolean execute = false;

    public  TaskProba (String taskName){
        this.taskName = taskName;
        this.execute = false;
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
        interrupt();
    }

    @Override
    public void run() {
        System.out.println(""+taskName+" start");
        int count = 0;
        do {
            if (Thread.interrupted())    //Проверка прерывания
            {
                break;
            }

            System.out.println("  -"+taskName+count);
            count++;

            try {
                Thread.sleep(1000);        //Приостановка потока на 1 сек.
            } catch (InterruptedException e) {
                break;    //Завершение потока после прерывания
            }
        }
        while (true);
        execute = true;
        System.out.println(""+taskName+" stop");
    }

}
