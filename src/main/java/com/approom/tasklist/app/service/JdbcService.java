package com.approom.tasklist.app.service;

import com.approom.tasklist.app.domain.project.Project;
import com.approom.tasklist.app.domain.project.ProjectService;
import com.approom.tasklist.app.domain.task.TaskService;
import com.approom.tasklist.app.domain.user.Role;
import com.approom.tasklist.app.domain.user.RoleService;
import com.approom.tasklist.app.domain.user.User;
import com.approom.tasklist.app.domain.user.UserService;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.HashSet;


@Service
public class JdbcService {
    @Autowired
    private JdbcTemplate jdbc;
    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    UserService userService;
    @Autowired
    RoleService roleService;
    @Autowired
    ProjectService projectService;
    @Autowired
    TaskService taskService;

    public JdbcService(){

    }

    public DataSource getDataSource() {
        return jdbc.getDataSource();
    }

    public Session getORMSession(){
        return sessionFactory.getCurrentSession();
    }

    public Boolean dropDataBase() {
        jdbc.execute("drop taskList");
        return true;
    }

    public Boolean initDataBase() {
/*
        jdbc.execute("insert into user(name, description)values('admin','admin')");
*/

        Role roleAdmin = new Role();
        roleAdmin.setRole("ROLE_ADMIN");
        roleService.saveEntity(roleAdmin);
        Role roleUser = new Role();
        roleUser.setRole("ROLE_USER");
        roleService.saveEntity(roleUser);

        User userAdmin = new User();
        userAdmin.setName("admin");
        userAdmin.setPassword("password");
        userAdmin.setMailAddress("vlasiukrv@gmail.com");
        userAdmin.addRole(roleAdmin);
        userAdmin.addRole(roleUser);
        userService.saveEntity(userAdmin);
        User userUser = new User();
        userUser.setName("user");
        userUser.setPassword("user");
        userUser.setMailAddress("alyona.lisitsyna@gmail.com ");
        userUser.addRole(roleUser);
        userService.saveEntity(userUser);

        User entity = userService.getEntityById(1);
        HashSet<User> users = new HashSet<>();
        users.add(userAdmin);
        users.add(userUser);

        Project project1 = new Project();
        project1.setName("Family");
        projectService.saveEntity(project1);

       /* User u = userService.getUserByName("admin");*/
        return true;
    }

}
