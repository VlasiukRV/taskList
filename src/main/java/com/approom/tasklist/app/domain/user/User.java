package com.approom.tasklist.app.domain.user;

import com.approom.tasklist.app.domain.BaseEntity;
import com.approom.tasklist.app.domain.user.role.Role;
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

@NoArgsConstructor
public class User extends BaseEntity<Integer> {

    @JsonProperty
    @ManyToMany(cascade={CascadeType.REMOVE}, fetch = FetchType.EAGER)
    @JoinTable(
            name="user_roles",
            joinColumns = @JoinColumn( name="user_id"),
            inverseJoinColumns = @JoinColumn( name="role_id")
    )
    private @Getter @Setter Set<Role> role = new HashSet<>();

/*
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name="task_executor_detail",
            joinColumns = @JoinColumn( name="user_id"),
            inverseJoinColumns = @JoinColumn( name="task_id")
    )
    @JsonIgnore
    private Set<Task> tasks = new HashSet<>();
*/

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

    public boolean addRole(Role role){
        if(!this.role.contains(role)){
            this.role.add(role);

            return true;
        }

        return false;
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
