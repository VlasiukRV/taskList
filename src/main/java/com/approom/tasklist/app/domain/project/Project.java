package com.approom.tasklist.app.domain.project;

import com.approom.tasklist.app.domain.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Component
@Entity
@Table
@JsonIgnoreProperties(value = { "tasks" })

@NoArgsConstructor
public class Project extends BaseEntity<Integer> {

    @Column
    @JsonProperty
    private @Getter @Setter String name;

/*
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private @Getter @Setter Set<Task> tasks = new HashSet<>();
*/

    public Project(String name) {
        super();

        this.name = name;
    }

/*
    public boolean addTask(Task task){
        if (tasks.contains(task)){
            return false;
        }
        this.tasks.add(task);
        return true;
    }
*/

    @Override
    public boolean equals(Object other) {
        if (this==other) return true;
        if (id==null) return false;
        if ( !(other instanceof Project) ) return false;
        final Project that = (Project) other;
        return this.id.equals( that.getId() );
    }

    @Override
    public int hashCode() {
        return id==null ? System.identityHashCode(this) : id.hashCode();
    }

}
