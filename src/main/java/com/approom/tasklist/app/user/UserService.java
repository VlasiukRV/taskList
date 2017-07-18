package com.approom.tasklist.app.user;

import com.approom.tasklist.app.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService extends BaseEntityService<User, Integer> {
    @Autowired
    public UserService(UserRepository userRepository) {
        super(User.class, userRepository);
    }

}
