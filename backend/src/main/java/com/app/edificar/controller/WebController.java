package com.app.edificar.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin("*")
@Controller
public class WebController {
    @GetMapping("/home")
    public String home() {
        return "forward:/index.html";
    }
}
