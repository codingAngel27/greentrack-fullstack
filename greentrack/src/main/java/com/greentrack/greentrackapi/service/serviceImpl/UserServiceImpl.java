package com.greentrack.greentrackapi.service.serviceImpl;

import com.greentrack.greentrackapi.entity.User;
import com.greentrack.greentrackapi.repository.IUserRepository;
import com.greentrack.greentrackapi.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private IUserRepository userRepository;

    @Override
    public User validateUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            return null;
        }

        return user;
    }

}

