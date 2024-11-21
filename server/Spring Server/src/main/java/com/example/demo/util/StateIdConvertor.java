package com.example.demo.util;

public class StateIdConvertor {
    public static int stringToId(String state){
        switch (state) {
            case "ny":
                return 36;
            case "ar":
                return 5;        
            default:
                return -1;
        }
    }
}
