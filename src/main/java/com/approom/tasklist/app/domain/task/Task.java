package com.approom.tasklist.app.domain.task;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.approom.tasklist.app.domain.BaseEntity;
import com.approom.tasklist.app.domain.project.Project;
import com.approom.tasklist.app.domain.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.*;

@Component
@Entity
@Table

@NoArgsConstructor
public class Task extends BaseEntity<Integer> {

    @JsonProperty
    @Column
    private @Getter @Setter Date date;

    @Column
    @JsonProperty
    private @Getter @Setter String title;

    @JsonProperty
    @ManyToOne(cascade={CascadeType.PERSIST})
    @JoinColumn
    private @Getter @Setter User author;

    @JsonProperty
    @ManyToMany(cascade={CascadeType.ALL, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
            name="task_executor_detail",
            joinColumns = @JoinColumn( name="task_id"),
            inverseJoinColumns = @JoinColumn( name="user_id")
    )
    private @Getter @Setter Set<User> executor = new HashSet<>();

    @JsonProperty
    @ManyToOne(cascade={CascadeType.ALL})
    @JoinColumn
    private @Getter @Setter Project project;

    @JsonProperty
    @Column
    @Enumerated(EnumType.ORDINAL)
    protected @Getter @Setter TaskState state;

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
