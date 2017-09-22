package com.dao;

import com.entity.Role;
import org.springframework.stereotype.Repository;

@Repository
public class RoleRepositoryImpl extends EntityRepositoryCastomImpl<Role> implements CastomRoleRepository {
}
