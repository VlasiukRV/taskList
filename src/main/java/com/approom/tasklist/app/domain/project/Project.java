package com.approom.tasklist.app.domain.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.approom.tasklist.app.domain.BaseEntity;
import com.approom.tasklist.app.domain.task.Task;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Component
@Entity
@Table
@JsonIgnoreProperties(value = { "tasks" })
public class Project extends BaseEntity<Integer> {
    @Column
    @JsonProperty
    private String name;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Task> tasks = new HashSet<>();

    public Project() {
        super();
    }

    public Project(String name) {
        super();

        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Task> getTasks(){
        return this.tasks;
    }

    public void setTasks(Set<Task> tasks){
        this.tasks = tasks;
    }

    public boolean addTask(Task task){
        if (tasks.contains(task)){
            return false;
        }
        this.tasks.add(task);
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;

        Project project = (Project) o;

        if (id!=project.getId()) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return ("Project"+id).hashCode();
    }
}
