package com.tasklist.app.task;

import com.tasklist.app.BaseEntityService;
import com.tasklist.app.task.Task;
import com.tasklist.app.task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskService extends BaseEntityService<Task, Integer> {
    @Autowired
    public TaskService(TaskRepository taskRepository) {
        super(Task.class, taskRepository);
    }
}
