package com.approom.tasklist.app.domain.user;

import com.approom.tasklist.app.domain.BaseEntityService;
import com.approom.tasklist.app.service.JdbcService;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class UserService extends BaseEntityService<User, Integer> {

    @Autowired
    private JdbcService jdbcService;

    @Autowired
    public UserService(UserRepository userRepository) {
        super(User.class, userRepository);
    }

    @Transactional
    public User getUserByName(String name){
        String hql = "from User where username= :userAdmin";
        Query query = jdbcService.getORMSession().createQuery(hql).setParameter("userAdmin", name);

        @SuppressWarnings("unchecked")
        List<User> listUser = (List<User>) query.list();

        if (listUser != null && !listUser.isEmpty()) {
            return listUser.get(0);
        }

        return null;
    }

}
