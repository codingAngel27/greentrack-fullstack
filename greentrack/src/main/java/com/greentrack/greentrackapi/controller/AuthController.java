package com.greentrack.greentrackapi.controller;

import com.greentrack.greentrackapi.dto.LoginDto;
import com.greentrack.greentrackapi.dto.UserResponseDto;
import com.greentrack.greentrackapi.entity.User;
import com.greentrack.greentrackapi.service.serviceImpl.UserServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@Api(tags = "Login", description = "Login básico con validación de datos")
public class AuthController {

    @Autowired
    private UserServiceImpl userService;
    @ApiOperation(value = "Iniciar sesión con username y password")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        User user = userService.validateUser(loginDto.getUsername(), loginDto.getPassword());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario o contraseña incorrectos"));
        }
        UserResponseDto response = new UserResponseDto();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        return ResponseEntity.ok(response);
    }
}
