package com.tasklist.app.service;

import com.tasklist.app.project.Project;
import com.tasklist.app.project.ProjectService;
import com.tasklist.app.task.Task;
import com.tasklist.app.task.TaskService;
import com.tasklist.app.task.TaskState;
import com.tasklist.app.user.User;
import com.tasklist.app.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JdbcService {
    @Autowired
    JdbcTemplate jdbc;
    @Autowired
    TaskService taskService;
    @Autowired
    UserService userService;
    @Autowired
    ProjectService projectService;

    public Boolean dropDataBase(){
        jdbc.execute("drop taskList");
        return true;
    }


    public Boolean initDataBase(){

        jdbc.execute("ALTER TABLE `tasklist`.`task_executor`\n" +
                "        DROP INDEX `UK_154ooxukgfak1l048la9xe8ri` ,\n" +
                "        ADD INDEX `UK_154ooxukgfak1l048la9xe8ri` (`user_id` ASC);");



/*
        jdbc.execute("insert into user(name, description)values('Roma','dad')");
        jdbc.execute("insert into user(name, description)values('Alyona','mamy')");
        jdbc.execute("insert into user(name, description)values('Peter','son')");

        jdbc.execute("insert into project(name)values('family')");
        jdbc.execute("insert into project(name)values('work')");
*/

        Project project = new Project();
        project.setName("family");
        projectService.saveEntity(project);

        User user = new User();
        user.setName("Roma");
        user.setDescription("dady");
        userService.saveEntity(user);

        Task task = new Task();
        task.setDate(new Date());
        task.setDescription("wefqwefqwefwf");
        task.setProject(project);
        task.setAuthor(user);
        task.addExecutor(user);
        task.setState(TaskState.TODO);
        taskService.saveEntity(task);

        return true;
    }

}
