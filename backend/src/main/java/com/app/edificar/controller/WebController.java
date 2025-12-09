package com.app.edificar.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
public class WebController {
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }
}
