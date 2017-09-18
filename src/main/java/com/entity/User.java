package com.entity;

import com.approom.tasklist.entity.Task;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name="user")

@NoArgsConstructor
public class User extends BaseEntity<Integer> {

    @JsonIgnore
    @ManyToMany(mappedBy="users")
    private @Getter @Setter Set<Role> role = new HashSet<>();


    @JsonIgnore
    @ManyToMany(mappedBy="executor")
    private Set<Task> tasks = new HashSet<>();

    @Column
    @JsonProperty
    private @Getter @Setter String username;
    @Column
    @JsonProperty
    private @Getter @Setter String password;
    @Column(name = "mailadress")
    @JsonProperty
    private @Getter @Setter String mailAddress;
    @Column
    @JsonProperty
    private @Getter @Setter Boolean enabled;

    public User(String username, String password) {
        super();

        this.username = username;
        this.password = password;
    }

    @Override
    public boolean equals(Object other) {
        if (this==other) return true;
        if (id==null) return false;
        if ( !(other instanceof User) ) return false;
        final User that = (User) other;
        return this.id.equals( that.getId() );
    }

    @Override
    public int hashCode() {
        return id==null ? System.identityHashCode(this) : id.hashCode();
    }
}
