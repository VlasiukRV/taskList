package com.approom.tasklist.app.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class User extends BaseEntity<Integer> {

    @JsonProperty
    @ManyToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
            name="user_roles",
            joinColumns = @JoinColumn( name="user_id"),
            inverseJoinColumns = @JoinColumn( name="role_id")
    )
    private Set<Role> role = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name="task_executor_detail",
            joinColumns = @JoinColumn( name="user_id"),
            inverseJoinColumns = @JoinColumn( name="task_id")
    )
    @JsonIgnore
    private Set<Task> tasks = new HashSet<>();

    @Column
    @JsonProperty
    private String username;
    @Column
    @JsonProperty
    private String password;
    @Column(name = "mailadress")
    @JsonProperty
    private String mailAddress;
    @Column
    @JsonProperty
    private Boolean enabled;

    public User() {
        super();
    }

    public User(String username, String password) {
        super();

        this.username = username;
        this.password = password;
    }

    public String getName() {
        return username;
    }

    public void setName(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMailAddress() {
        return mailAddress;
    }

    public void setMailAddress(String mailAddress) {
        this.mailAddress = mailAddress;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Set<Role> getRole() {
        return role;
    }
    public void setRole(Set<Role> role) {
        this.role = role;
    }

    public Set<Task> getTasks(){
        return  this.tasks;
    }
    public void setTasks(Set<Task> tasks){
        this.tasks = tasks;
    }

    public boolean addRole(Role role){
        if(!this.role.contains(role)){
            this.role.add(role);

            return true;
        }

        return false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;

        User user = (User) o;

        if (user.getId() != id) {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode() {
        return ("User"+id).hashCode();
    }
}
