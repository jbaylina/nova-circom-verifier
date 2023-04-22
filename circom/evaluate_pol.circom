// Evaluates a polynomial from the Lagrangre evaluations and coeficients

template EvaluatePol(n) {
    signal input coefs[n];
    signal input L[n];
    signal output out;

    signal im[n];
    for (var i=0; i<n; i++) {
        if (i==0) {
            im[i] <== coefs[i]*L[i];
        } else {
            im[i] <== im[i-1] + coefs[i]*L[i];
        }
    }

    out <== im[n-1];
}