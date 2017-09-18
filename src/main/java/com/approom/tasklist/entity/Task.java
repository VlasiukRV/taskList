package com.approom.tasklist.entity;

import com.entity.BaseEntity;
import com.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
@Entity
@Table

@NoArgsConstructor
public class Task extends BaseEntity<Integer> {

    @JsonProperty
    @Column
    @Temporal(TemporalType.DATE)
    private @Getter @Setter Date date;

    @JsonProperty
    @Column
    private @Getter @Setter String title;

    @JsonProperty
    @ManyToOne(cascade={CascadeType.DETACH}, fetch = FetchType.EAGER)
    private @Getter @Setter
    User author;

    @JsonProperty
    @ManyToMany(cascade={CascadeType.DETACH}, fetch = FetchType.EAGER)
    @JoinTable(
            name="task_user_detail",
            joinColumns = {@JoinColumn( name="task_id")},
            inverseJoinColumns = {@JoinColumn( name="user_id")}
    )
    private @Getter @Setter Set<User> executor = new HashSet<>();

    @JsonProperty
    @ManyToOne(cascade={CascadeType.DETACH})
    @JoinColumn
    private @Getter @Setter Project project;

    @JsonProperty
    @Column
    @Enumerated(EnumType.ORDINAL)
    protected @Getter @Setter
    TaskState state;

    @Override
    public boolean equals(Object other) {
        if (this==other) return true;
        if (id==null) return false;
        if ( !(other instanceof Task) ) return false;
        final Task that = (Task) other;
        return this.id.equals( that.getId() );
    }

    @Override
    public int hashCode() {
        return id==null ? System.identityHashCode(this) : id.hashCode();
    }
}
