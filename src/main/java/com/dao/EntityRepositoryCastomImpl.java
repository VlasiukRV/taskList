package com.dao;

import com.entity.BaseEntity;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;

public class EntityRepositoryCastomImpl<T extends BaseEntity> implements EntityRepositoryCastom<T> {
    @PersistenceContext
    private EntityManager entityManager;

    public EntityRepositoryCastomImpl() {
    }

    @Override
    public List<T> search(Class<T> baseEntityClass, List<SearchCriteria> params) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = builder.createQuery(baseEntityClass);
        Root<T> r = query.from(baseEntityClass);

        Predicate predicate = builder.conjunction();

        for (SearchCriteria param : params) {
            predicate = addPredicateByParam(builder, r, predicate, param);
        }
        query.where(predicate);

        return entityManager.createQuery(query).getResultList();
    }

    private Predicate addPredicateByParam(CriteriaBuilder builder, Root<T> r, Predicate predicate, SearchCriteria param){
        if (param.getOperation().equalsIgnoreCase(">")) {
            predicate = builder.and(predicate,
                    builder.greaterThan(r.get(param.getKey()),
                            Integer.parseInt(param.getValue().toString())));
        } else if(param.getOperation().equalsIgnoreCase(">=")){
            predicate = builder.and(predicate,
                    builder.greaterThanOrEqualTo(r.get(param.getKey()),
                            Integer.parseInt(param.getValue().toString())));
        } else if(param.getOperation().equalsIgnoreCase("<")){
            predicate = builder.and(predicate,
                    builder.lessThan(r.get(param.getKey()),
                            Integer.parseInt(param.getValue().toString())));
        } else if(param.getOperation().equalsIgnoreCase("<=")){
            predicate = builder.and(predicate,
                    builder.lessThanOrEqualTo(r.get(param.getKey()),
                            Integer.parseInt(param.getValue().toString())));
        } else if(param.getOperation().equalsIgnoreCase("=")){
            predicate = builder.and(predicate,
                    builder.equal(r.get(param.getKey()),
                            Integer.parseInt(param.getValue().toString())));
        } else if (param.getOperation().equalsIgnoreCase(":")) {
            if (r.get(param.getKey()).getJavaType() == String.class) {
                predicate = builder.and(predicate,
                        builder.like(r.get(param.getKey()),
                                "%" + param.getValue() + "%"));
            } else {
                predicate = builder.and(predicate,
                        builder.equal(r.get(param.getKey()), param.getValue()));
            }
        }

        return predicate;
    }

}
