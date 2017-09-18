package com.approom.tasklist.service;

import com.approom.tasklist.dao.TaskRepository;
import com.approom.tasklist.entity.Task;
import com.service.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class TaskService extends BaseEntityService<Task, Integer, TaskRepository> {
    @Autowired
    public TaskService(TaskRepository taskRepository) {
        super(Task.class, taskRepository);
    }

    public List<Task> getAll(){
        List<Task> tasks = super.getAll();
        tasks.forEach(Task::getExecutor);
        return tasks;
    }

}
