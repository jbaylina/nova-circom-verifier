

module.exports = function generateCircomWitnessVerifier(r1cs) {

    const out = [];
    out.push("// File generated automatically");
    out.push("");
    out.push(`var nConstraints = ${r1cs.constraints.length};`);
    out.push(`var nSignals = ${r1cs.nVars};`);
    out.push("");
    out.push("template VerifyWitnessLogic() {");

    let tmpCnt = 0;

    for (let i=0; i< r1cs.constraints.length; i++) {
        out.push(`    // constraint ${i}`);

        const expA = expressionLC(r1cs.constraints[i][0]);
        const expB = expressionLC(r1cs.constraints[i][1]);
        const expC = expressionLC(r1cs.constraints[i][2]);
        let CVar;
        if (expC) {
            CVar = `tmp[${++tmpCnt}]`;
            out.push(`    signal ${CVar} <== u * (${expC});`);
        }

        let SLeft;
        if (expA && expB) {
            SLeft = `( ${expA} )*( ${expB} )`;
        } else {
            SLeft = "0"
        }
        let SRight;
        if (CVar) {
            SRight = `${CVar} + E[${i}]`;
        } else {
            SRight = `E[${i}]`;
        }

        out.push(`    ${SLeft} === ${SRight};`);
    }

    out.push("}");
    return out.join("\n");

    function expressionLC(lc) {
        const signals = Object.keys(lc);
        let S = "";
        for (let j=0; j<signals.length; j++) {
            if (S !== "") S += " + ";
            const coef = r1cs.F.toString(lc[signals[j]]);
            S = S + `${coef} * W[${signals[j]}]`;
        }
        return S;
    }
}