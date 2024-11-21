package com.example.demo.util;

import com.example.demo.common.State;

public class StateIdConvertor {
    public static int stringToId(State state){
        switch (state) {
            case State.NY:
                return 36;
            case State.AR:
                return 5;        
            default:
                return -1;
        }
    }
}
