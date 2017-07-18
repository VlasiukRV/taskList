package com.service.taskScheduler;

public abstract class AbstractServiceTask extends Thread implements IServiceTask{

    private String taskName = "";
    private Boolean execute = false;

    public AbstractServiceTask(){
        setExecute(false);
    }

    protected void setTaskName(String taskName){
        this.taskName = taskName;
    }

    @Override
    public String getTaskName() {
        return taskName;
    }

    protected void setExecute(Boolean execute){
        this.execute = execute;
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

    protected abstract boolean runServiceTask();

    @Override
    public void run() {
        System.out.println("" +getName()+ " start");
        do {
            if (Thread.interrupted())    //Проверка прерывания
            {
                break;
            }

            try {
                runServiceTask();
            }catch (Exception e){
                System.out.println(e.getMessage());
            }

            try {
                Thread.sleep(10000);        //Приостановка потока на 1 сек.
            } catch (InterruptedException e) {
                break;    //Завершение потока после прерывания
            }
        }
        while (true);
        execute = true;
        System.out.println("" +getName()+ " stop");
    }

}
