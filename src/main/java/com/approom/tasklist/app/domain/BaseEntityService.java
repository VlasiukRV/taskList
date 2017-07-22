package com.approom.tasklist.app.domain;

import com.approom.tasklist.AppUtils;
import org.springframework.data.repository.CrudRepository;

import java.io.Serializable;
import java.util.List;

public abstract class BaseEntityService<T extends BaseEntity<ID>, ID extends Serializable> {

    private CrudRepository<T, ID> entityRepository;

    private Class<T> baseEntityClass;

    protected BaseEntityService(Class<T> baseEntityClass, CrudRepository<T, ID> entityRepository) {
        this.baseEntityClass = baseEntityClass;
        this.entityRepository = entityRepository;
    }

    public T getEntityById(ID id){
        return entityRepository.findOne(id);
    }

    public List<T> getAll(){
        return (List<T>)entityRepository.findAll();
    }

    public boolean deleteEntity(T entity){
        entityRepository.delete(entity);
        return entityRepository.exists(entity.getId());
    }

    public boolean deleteEntity(ID id){
        try {
            entityRepository.delete(id);
        }catch (Exception ex){
            return false;
        }
        return !entityRepository.exists(id);
    }

    public T getEntityByJSON(String strJSONEntity){
        T entity = AppUtils.getEntityByJSON(this.baseEntityClass, strJSONEntity);
        if (entity == null){
            return null;
        }

        return entity;
    }

    public T saveEntity(T entity){
        return entityRepository.save(entity);
    }

    public T saveEntity(String strJSONEntity){
        T entity = getEntityByJSON(strJSONEntity);
        if (entity == null){
            return null;
        }
        return saveEntity(entity);
    }

}
