pragma circom 2.0.5;

include "mux4.circom";
include "mux1.circom";

template Mux42() {
    signal input c[16][2];
    signal input s[4];
    signal output out[2];

    component mux = MultiMux4(2);
    for (var i=0; i<16; i++) {
        for (var j=0; j<2; j++) {
            mux.c[j][i] <== c[i][j];
        }
    }
    mux.s <== s;

    out <== mux.out;
}

template Mux22() {
    signal input c[2][2];
    signal input s;
    signal output out[2];

    component mux = MultiMux1(2);
    for (var i=0; i<2; i++) {
        for (var j=0; j<2; j++) {
            mux.c[j][i] <== c[i][j];
        }
    }
    mux.s <== s;

    out <== mux.out;
}