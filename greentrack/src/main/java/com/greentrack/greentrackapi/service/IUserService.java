package com.greentrack.greentrackapi.service;

import com.greentrack.greentrackapi.entity.User;

public interface IUserService {

    User validateUser(String username, String password);
}
