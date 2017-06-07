package com.tasklist.app.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tasklist.app.BaseEntity;
import org.springframework.stereotype.Component;

import javax.persistence.*;

@Component
@Entity
@Table
public class User extends BaseEntity<Integer> {
    @Column
    @JsonProperty
    private String name;
    @Column
    @JsonProperty
    private String password;

    public User() {
        super();
    }

    public User(String name, String password) {
        super();

        this.name = name;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
