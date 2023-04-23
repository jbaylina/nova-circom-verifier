

module.exports.calculateLagrange = function calculateLagrange(n, x, curve) {
    const next2Power = Math.ceil(Math.log(n));

    const w = curve.Fr.w[next2Power];

    console.log(curve.Fr.toString(w));
    const Li = [];

    let xN = x;
    let wi = [curve.Fr.one];

    for(let i = 1; i < n; ++i) {
        xN = curve.Fr.mul(xN, x);
        wi[i] = curve.Fr.mul(wi[i - 1], w);
    }

    for(let i = 0; i < n; ++i) {
        const l1 = curve.Fr.div(wi[i], curve.Fr.e(n));
        const l2 = curve.Fr.div(curve.Fr.sub(xN, curve.Fr.one), curve.Fr.sub(x, wi[i]));

        Li[i] = curve.Fr.mul(l1, l2);
    }

    return Li;
}