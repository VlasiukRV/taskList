package com.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@MappedSuperclass

@NoArgsConstructor
public abstract class BaseEntity<ID> implements Serializable {

    @JsonProperty
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    protected @Getter @Setter ID id;

    @JsonProperty
    @Lob
    protected @Getter @Setter String description;

}
