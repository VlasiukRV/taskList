package com.dao;

import lombok.*;

@RequiredArgsConstructor
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class SearchCriteria {
    private @Getter @Setter String key;
    private @Getter @Setter String operation;
    private @Getter @Setter Object value;

}
