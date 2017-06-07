package com.tasklist.app.task;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tasklist.app.BaseEntity;
import com.tasklist.app.project.Project;
import com.tasklist.app.user.User;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.*;

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
    @JsonProperty
    @OneToMany(cascade={CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
            name="task_executor",
            joinColumns = @JoinColumn( name="task_id"),
            inverseJoinColumns = @JoinColumn( name="user_id", unique = false)
    )
    private List<User> executor = new ArrayList<>();
    @JsonProperty
    @ManyToOne
    @JoinColumn
    private Project project;
    @JsonProperty
    @Column
    @Enumerated(EnumType.ORDINAL)
    protected TaskState state;

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

    public List<User> getExecutor() {
        return executor;
    }

    public void setExecutor(List<User> executor) {
        this.executor = executor;
    }

    public void addExecutor(User user){
        executor.add(user);
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public TaskState getState() {
        return state;
    }

    public void setState(TaskState state) {
        this.state = state;
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
