package com.tasklist.app.project;

import com.tasklist.app.BaseEntityService;
import com.tasklist.app.project.Project;
import com.tasklist.app.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService extends BaseEntityService<Project, Integer> {
    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        super(Project.class, projectRepository);
    }
}
