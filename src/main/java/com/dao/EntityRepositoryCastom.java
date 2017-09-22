package com.dao;

import com.entity.BaseEntity;

import java.util.List;

public interface EntityRepositoryCastom<T extends BaseEntity> {
    public List<T> search(Class<T> baseEntityClass, List<SearchCriteria> params);
}
