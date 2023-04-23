// Checks a relaxed R1CS constraint in a wrong field q

include "bigint_func.circom";

var F64 = 2**64-1;
var F64_2 = F64*F64;
var F64_3 = F64_2*F64;

template WrongFieldConstraint(q, nA, nB, bC, coefsA, coefsB, coefsC) {

    signal input a[nA][4];
    signal input b[nB][4];
    signal input c[nC][4];
    signal input u[4];
    signal input e[4];

    var acc[8];
    signal tmpAB[nA][nB][4][4];
    signal tmpC[nC][4];
    var maxAcc[8];
    var minAcc[8];

    for (var i=0; i<8; i++) {
        maxAcc[i] =0;
        minAcc[i] =0;
        acc[i] =0;
    }

    for (var i =0; i<nA; i++) {
        for (var j=0; j<nB; j++) {
            for (il=0; il<4; il++) {
                for (jl=0; jl<4; jl++) {
                    var cab = coefsA[i][il]*coefsB[j][jl];
                    var cabl = cab & F64;
                    var cabh = cab >> 64;
                    if (cab != 0) {
                        tmpAB[i][j][il][jl] <== a[i][il]*a[j][jl];
                        if (cabl != 0) {
                            acc[il + jl] += cabl*tmpAB[i][j][il][jl];
                            maxAcc[il + jl] += F64_2*cabl;
                        }
                        if (cabh != 0) {
                            acc[il + jl + 1] += cabh*tmpAB[i][j][il][jl];
                            maxAcc[il + jl + 1] += F64_2*cabl;
                        }
                    } else {
                        tmpAB[i][j][il][jl] <== 0;
                    }
                }
            }
        }
    }

    for (var i =0; i<nC; i++) {
        for (il=0; il<4; il++) {
            for (jl=0; jl<4; jl++) {
                var coef = coefsC[i][il];
                if (coef != 0) {
                    tmpC[i][il] <== c[i][il]*u[jl];
                    acc[il + jl] -= coef*tmpC[i][il];
                    minAcc[il + jl] += F64_2*coef;
                } else {
                    tmpC[i][il] <== 0;
                }
            }
        }
    }

    for (il=0; il<4; il++) {
        acc[il] -= e[il];
        minAcc[il] += F64;
    }

    var kMax = long_div(maxAcc, q);
    var kMin = long_div(minAcc, q);

    signal tmpQK[4][4];
    for (kl=0; kl<4; kl++) {
        for (ql=0; ql<4; ql++) {
            acc[kl + ql] -= q[ql]*k[kl];
            if (kl == 3) {
                minAcc[kl + ql] += q[ql] * kMax[3];
                maxAcc[kl + ql] += q[ql] * kMin[3];
            } else {
                minAcc[kl + ql] += q[ql] * F64;
                maxAcc[kl + ql] += q[ql] * F64;
            }
        }
    }

    signal accS[8];
    for (var i=0; i<8; i++) {
        accS[i] <== acc[i];
    }

    var kval = long_div(acc, q);
    for (var i=0; i<4; i++) {
        k[i] <-- kval[i];

        var nBits;
        if (i==3) {
            nBits = log2up(kMax[3] + kMin[3])
        } else {
            nBits = 64;
        }
        _ <== Num2Bits(nBits)(k[i] + kMin[3]);
    }

    for (i=2; i<8; i++) {
        maxAcc[i] = maxAcc[i] + (maxAcc[i-1] >> 64);
        minAcc[i] = minAcc[i] + (minAcc[i-1] >> 64);
    }

    signal carry[7];
    for (var i=0; i<7; i++) {
        if (i == 0) {
            carry[i] <== accS[i] + carry[i-1] / (2**32);
        } else {
            carry[i] <== accS[i] / (2**32);
        }
        var nBits = log2up(accMax[i] + accMin[i]);
        _ <== Num2Bits(nBits)(carry[i] + minAcc[i]);
    }

    accS[7] + carry[6] === 0;
}











