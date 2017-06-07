package com.tasklist.app.service;

public interface IServiceTask{
    public String getTaskName();
    public Boolean isExecute();
    public Boolean isRun();
    public void start();
    public void stopTask();
}
