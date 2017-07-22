package com.approom.tasklist.app.domain.project;

import com.approom.tasklist.app.domain.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService extends BaseEntityService<Project, Integer> {
    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        super(Project.class, projectRepository);
    }
}
