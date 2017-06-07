package com.tasklist.app.task;

import com.tasklist.Utils;
import com.tasklist.app.BaseEntityService;
import com.tasklist.app.user.User;
import com.tasklist.app.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService extends BaseEntityService<Task, Integer> {

    @Autowired
    private UserService userService;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        super(Task.class, taskRepository);
    }

    public Task saveEntity(String strJSONEntity){
        Task entity = Utils.getEntityByJSON(Task.class, strJSONEntity);
        if (entity == null){
            return null;
        }
        List<User> newExecutor = new ArrayList<>();
        List<User> executor = entity.getExecutor();
        for (User user : executor) {
            int id = user.getId();

            User userDAO = userService.getEntityById(id);
            newExecutor.add(userDAO);
        }

        entity.setExecutor(newExecutor);
        return saveEntity(entity);
    }

}
