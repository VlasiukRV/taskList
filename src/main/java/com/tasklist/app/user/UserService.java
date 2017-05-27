package com.tasklist.app.user;

import com.tasklist.app.BaseEntityService;
import com.tasklist.app.user.User;
import com.tasklist.app.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService extends BaseEntityService<User, Integer> {
    @Autowired
    public UserService(UserRepository userRepository) {
        super(User.class, userRepository);
    }

}
