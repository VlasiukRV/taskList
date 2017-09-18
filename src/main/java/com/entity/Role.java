package com.entity;

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
public class Role extends BaseEntity<Integer> {
    @JsonProperty
    @Column
    private @Getter @Setter String role;

    @JsonProperty
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(
            name="role_user_detail",
            joinColumns = @JoinColumn( name="role_id"),
            inverseJoinColumns = @JoinColumn( name="user_id")
    )
    private Set<User> users = new HashSet<>();

    public boolean addUser(User user){
        if(!this.users.contains(user)){
            this.users.add(user);

            return true;
        }

        return false;
    }

    @Override
    public boolean equals(Object other) {
        if (this==other) return true;
        if (id==null) return false;
        if ( !(other instanceof Role) ) return false;
        final Role that = (Role) other;
        return this.id.equals( that.getId() );
    }

    @Override
    public int hashCode() {
        return id==null ? System.identityHashCode(this) : id.hashCode();
    }

}
