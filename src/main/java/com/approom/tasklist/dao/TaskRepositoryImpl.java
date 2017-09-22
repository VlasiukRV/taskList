package com.approom.tasklist.dao;

import com.approom.tasklist.entity.Task;
import com.dao.EntityRepositoryCastomImpl;
import org.springframework.stereotype.Repository;

@Repository
public class TaskRepositoryImpl extends EntityRepositoryCastomImpl<Task> implements CastomTaskRepository{
}
