package com.approom.tasklist.dao;

import com.approom.tasklist.entity.Task;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends CrudRepository<Task, Integer>, CastomTaskRepository {
}
