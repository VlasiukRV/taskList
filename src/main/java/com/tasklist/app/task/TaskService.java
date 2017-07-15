package com.tasklist.app.task;

import com.tasklist.AppUtils;
import com.tasklist.app.BaseEntityService;
import com.tasklist.app.project.Project;
import com.tasklist.app.project.ProjectService;
import com.tasklist.app.user.User;
import com.tasklist.app.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TaskService extends BaseEntityService<Task, Integer> {

    @Autowired
    private UserService userService;
    @Autowired
    private ProjectService projectService;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        super(Task.class, taskRepository);
    }

    public Task saveEntity(String strJSONEntity){
        Task entity = AppUtils.getEntityByJSON(Task.class, strJSONEntity);
        if (entity == null){
            return null;
        }

        Set<User> newExecutor = new HashSet<>();
        Set<User> executor = entity.getExecutor();
        for (User user : executor) {
            int id = user.getId();

            User userDAO = userService.getEntityById(id);
            newExecutor.add(userDAO);
        }
        entity.setExecutor(newExecutor);
        Task rez = saveEntity(entity);

        Project project = entity.getProject();
        if (project.addTask(entity)){
            projectService.saveEntity(project);
        }
        return rez;
    }

}
