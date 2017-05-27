package com.tasklist.app.task;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tasklist.app.BaseEntity;
import com.tasklist.app.user.User;
import com.tasklist.app.project.Project;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
@Entity
@Table
public class Task extends BaseEntity<Integer> {
    @JsonProperty
    @Column
    private Date date;
    @Column
    @JsonProperty
    private String title;
    @JsonProperty
    @ManyToOne
    @JoinColumn
    private User author;
/*    @JsonProperty
    @ManyToOne
    @JoinColumn
    private User executor;*/

    @OneToMany
    @JsonProperty
    private Set<User> executor = new HashSet<>();


    @JsonProperty
    @ManyToOne
    @JoinColumn
    private Project project;

    public Task() {
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Set<User> getExecutor() {
        return executor;
    }

    public void setExecutor(Set<User> executor) {
        this.executor = executor;
    }

    /*
    public User getExecutor() {
        return executor;
    }

    public void setExecutor(User executor) {
        this.executor = executor;
    }
*/

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Task)) return false;

        Task task = (Task) o;

        if (id!=task.getId()) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return ("Task"+id).hashCode();
    }
}
