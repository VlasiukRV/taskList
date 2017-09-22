package com.approom.cashaccounting.dao;

import com.approom.cashaccounting.entity.CashFlowItem;
import com.dao.EntityRepositoryCastomImpl;
import org.springframework.stereotype.Repository;

@Repository
public class CashFlowItemRepositoryImpl extends EntityRepositoryCastomImpl<CashFlowItem> implements CastomCashFlowItemRepository{
}
