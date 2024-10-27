package com.example.demo.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message) {
        super(message); // Passes the message to the superclass constructor
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause); // Allows for a cause to be passed
    }
}