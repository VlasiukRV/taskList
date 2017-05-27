package com.tasklist.app.project;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tasklist.app.BaseEntity;
import org.springframework.stereotype.Component;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Component
@Entity
@Table
public class Project extends BaseEntity<Integer> {
    @Column
    @JsonProperty
    private String name;

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
