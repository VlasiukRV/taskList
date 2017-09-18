package com.service;

import com.dao.UserRepository;
import com.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Transactional
@Service
public class UserService extends BaseEntityService<User, Integer, UserRepository> {
    @Autowired
    public UserService(UserRepository userRepository) {
        super(User.class, userRepository);
    }

    public User getUserByName(String name){
        return getEntityRepository().findByUsername(name);
    }
}
