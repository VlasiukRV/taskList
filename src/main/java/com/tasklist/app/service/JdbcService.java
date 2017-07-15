package com.tasklist.app.service;

import com.tasklist.app.user.Role;
import com.tasklist.app.user.RoleService;
import com.tasklist.app.user.User;
import com.tasklist.app.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.List;


@Service
public class JdbcService {
    @Autowired
    JdbcTemplate jdbc;
    @Autowired
    public DataSource dataSource;

    @Autowired
    UserService userService;
    @Autowired
    RoleService roleService;

    public DataSource getDataSource() {
        return dataSource;
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
        userAdmin.addRole(roleAdmin);
        userAdmin.addRole(roleUser);
        userService.saveEntity(userAdmin);
        User userUser = new User();
        userUser.setName("user");
        userUser.setPassword("user");
        userUser.addRole(roleUser);
        userService.saveEntity(userUser);

        User entity = userService.getEntityById(1);
        List<User> users = userService.getAll();

        return true;
    }

}
