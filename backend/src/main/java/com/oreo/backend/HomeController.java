package com.oreo.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Oreo Botanicals backend is running!";
    }
}
