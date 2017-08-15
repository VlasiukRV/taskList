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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;

        Role entity = (Role) o;

        if (id != entity.getId()) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return ("Role"+id).hashCode();
    }

}
