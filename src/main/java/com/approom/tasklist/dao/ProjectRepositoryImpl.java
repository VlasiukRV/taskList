package com.approom.tasklist.dao;

import com.approom.tasklist.entity.Project;
import com.dao.EntityRepositoryCastomImpl;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectRepositoryImpl extends EntityRepositoryCastomImpl<Project> implements CastomProjectRepository{
}
