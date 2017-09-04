package com.approom.tasklist.app.domain.user.role;

import com.approom.tasklist.app.domain.BaseEntity;
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

@NoArgsConstructor
public class Role extends BaseEntity<Integer> {
    @Column
    @JsonProperty
    private @Getter @Setter String role;

/*
    @JsonIgnore
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinTable(
            name="user_roles",
            joinColumns = @JoinColumn( name="role_id"),
            inverseJoinColumns = @JoinColumn( name="user_id")
    )
    private Set<User> user = new HashSet<>();
*/

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
