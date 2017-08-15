package com.approom.tasklist.app.domain.project;

import com.approom.tasklist.app.domain.BaseEntity;
import com.approom.tasklist.app.domain.task.Task;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Component
@Entity
@Table
@JsonIgnoreProperties(value = { "tasks" })

@NoArgsConstructor
public class Project extends BaseEntity<Integer> {
    @Column
    @JsonProperty
    private @Getter @Setter String name;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private @Getter @Setter Set<Task> tasks = new HashSet<>();

    public Project(String name) {
        super();

        this.name = name;
    }

    public boolean addTask(Task task){
        if (tasks.contains(task)){
            return false;
        }
        this.tasks.add(task);
        return true;
    }

    @Override
    public int hashCode() {
        return ("Project"+id).hashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;

        Project project = (Project) o;

        if (id!=project.getId()) return false;

        return true;
    }

}
