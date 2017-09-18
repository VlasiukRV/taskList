package com.approom.tasklist.service;

import com.approom.tasklist.entity.Project;
import com.approom.tasklist.dao.ProjectRepository;
import com.service.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class ProjectService extends BaseEntityService<Project, Integer, ProjectRepository> {
    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        super(Project.class, projectRepository);
    }
}
