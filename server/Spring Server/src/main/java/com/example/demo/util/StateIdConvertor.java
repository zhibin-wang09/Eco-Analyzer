package com.example.demo.util;

import com.example.demo.common.State;

public class StateIdConvertor {
    public static int stringToId(State state) {
        switch (state) {
            case State.NEWYORK:
                return 36;
            case State.ARKANSAS:
                return 5;
            default:
                return -1;
        }
    }
}
