pragma circom 2.0.5;

include "mux.circom";
include "comparators.circom";

include "curve_constants.circom";


template ECAdd() {
    signal input in1[2];
    signal input in2[2];
    signal output out[2];


    signal lamda;

    lamda <-- (in1[1] - in2[1]) / (in1[0] - in2[0]);
    lamda * (in1[0] - in2[0]) === (in1[1] - in2
    [1]);

    out[0] <== lamda*lamda - in1[0] -in2[0];
    out[1] <== lamda * (in1[0] - out[0]) + in1[1];
}

template AddCanZero() {
    signal input in1[2];
    signal input in2[2];
    signal output out[2];

    signal sameX <== IsZero()(in1[0]-in2[0]);

    signal lamda;

    lamda <-- sameX ? 0 : (in1[1] - in2[1]) / (in1[0] - in2[0]);

    signal right <== (in1[1] - in2[1]) * sameX;
    lamda * (in1[0] - in2[0]) === sameX;

    signal outp[2];
    outp[0] <== lamda*lamda - in1[0] -in2[0];
    outp[1] <== lamda * (in1[0] - outp[0]) + in1[1];

    out[0] <== outp[0] * sameX;
    out[1] <== outp[1] * sameX;
}

template ECDouble() {
    signal input in[2];
    signal output out[2];

    signal lamda;
    signal x1_2;

    x1_2 <== in[0] * in[0];

    lamda <-- (3*x1_2 ) / (2*in[1]);
    lamda * (2*in[1]) === 3*x1_2 ;

    out[0] <== lamda*lamda - 2*in[0];
    out[1] <== lamda * (in[0] - out[0]) + in[1];
}


// Here I'm assuming that the point is never going to be related with the offset, so
// it always be adds in the operations and never doublings, and the result is never be zero
// in the partial calculations.
// In the substraction of the last one, the result can be 0 so that's why whe use AddCanZero

template ScalarMul() {
    signal input s[256];
    signal input in[2];
    signal output out[2];

    signal isZero <== IsZero()(in[1]);

    signal tab16[16][2];

    var offset[2], offset4[2];

//    [offset, offset4] = getOffsetPoints();
    var tmp2[2][2] = getOffsetPoints();
    offset = tmp2[0];
    offset4 = tmp2[1];


    signal b[2] <== Mux22()([in, [1, 2]], isZero);

    tab16[0] <== offset;

    for (var i=1; i<16; i++) {
        tab16[i] <== ECAdd()(tab16[i-1], b);
    }

    signal im[64][2];
    var p = 0;
    im[p] <== Mux42()(tab16, [s[252], s[253], s[254], s[255]]);
    p++;

    for (var i=248; i>=0; i -= 4) {
        im[p] <== ECAdd()(
            Mux42()(tab16, [s[i], s[i+1], s[i+2], s[i+3]]),
            ECDouble()(
                ECDouble()(
                    ECDouble()(
                        ECDouble()(
                            im[p-1]
                        )
                    )
                )
            )
        );
        p++;
    }

    signal tmp1[2];
    tmp1 <== AddCanZero()(im[63], offset4);

    out <== Mux22()([tmp1, [0, 0]], isZero);

//  out <== Mux42()([AddCanZero()(im[63], offset4), [0, 0]], isZero);
}