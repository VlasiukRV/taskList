package com.approom.tasklist.app.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@MappedSuperclass

@NoArgsConstructor
public abstract class BaseEntity<ID> implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    @JsonProperty
    protected @Getter @Setter ID id;
    @Column
    @JsonProperty
    protected @Getter @Setter String description;

}
