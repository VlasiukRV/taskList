package com.approom.cashaccounting.dao;

import com.approom.cashaccounting.entity.CashFlow;
import com.dao.EntityRepositoryCastomImpl;
import org.springframework.stereotype.Repository;

@Repository
public class CashFlowRepositoryImpl extends EntityRepositoryCastomImpl<CashFlow> implements CastomCashFlowRepository{
}
