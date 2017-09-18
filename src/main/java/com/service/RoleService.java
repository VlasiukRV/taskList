package com.service;

import com.dao.RoleRepository;
import com.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService extends BaseEntityService<Role, Integer, RoleRepository> {
    @Autowired
    public RoleService(RoleRepository roleRepository) {
        super(Role.class, roleRepository);
    }
}
