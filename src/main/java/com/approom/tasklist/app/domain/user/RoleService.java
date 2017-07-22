package com.approom.tasklist.app.domain.user;

import com.approom.tasklist.app.domain.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService extends BaseEntityService<Role, Integer> {
    @Autowired
    public RoleService(RoleRepository roleRepository) {
        super(Role.class, roleRepository);
    }

}
