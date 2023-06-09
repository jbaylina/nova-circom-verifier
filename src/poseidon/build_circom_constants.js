const fs = require("fs");

const primeBN = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000n;
const primeGK = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd46n;

const {utils} = require("ffjavascript");
const unstringifyBigInts =utils.unstringifyBigInts;

let consts = unstringifyBigInts(require("./poseidon_constants_opt.js"));

function print(out, tab, s) {
    out.push(" ".repeat(tab)+s);
}

function printArr(out, tab, arr) {
    print(out, tab,`[`);
    for (let i=0; i<arr.length; i++) {
        print(out, tab + 4, `0x${arr[i].toString(16).padStart(64, "0")}${(i === arr.length-1) ? "" : ","}`);
    }
    print(out, tab, `]`);
}

function printArr2(out, tab, arr) {
    print(out, tab,`[`);
    for (let i=0; i<arr.length; i++) {
        printArr(out, tab+4, arr[i]);
        if (i<arr.length-1) print(out, tab+4, ',');
    }
    print(out, tab, `]`);
}


function buildC(out, consts) {
    print(out, 0, `function POSEIDON_C(t) {`);
    print(out, 4, `if (-1 == 0x${primeBN.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr(out, 16, consts.bn.C[t-2]);
        print(out, 12, `;`);
        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [0];`);
    print(out, 8, `}`);


    print(out, 4, `} else if (-1 == 0x${primeGK.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr(out, 16, consts.gk.C[t-2]);
        print(out, 12, `;`);
        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [0];`);
    print(out, 8, `}`);


    print(out, 4, `} else {`);
    print(out, 8, `assert(0);`);
    print(out, 8, `return [0];`);
    print(out, 4, `}`);
    print(out, 0, `}`);
}


function buildS(out, consts) {
    print(out, 0, `function POSEIDON_S(t) {`);
    print(out, 4, `if (-1 == 0x${primeBN.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr(out, 16, consts.bn.S[t-2]);
        print(out, 12, `;`);

        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [0];`);
    print(out, 8, `}`);


    print(out, 4, `} else if (-1 == 0x${primeGK.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr(out, 16, consts.gk.S[t-2]);
        print(out, 12, `;`);
        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [0];`);
    print(out, 8, `}`);

    print(out, 4, `} else {`);
    print(out, 8, `assert(0);`);
    print(out, 8, `return [0];`);
    print(out, 4, `}`);
    print(out, 0, `}`);
}


function buildM(out, consts) {
    print(out, 0, `function POSEIDON_M(t) {`);
    print(out, 4, `if (-1 == 0x${primeBN.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr2(out, 16, consts.bn.M[t-2]);
        print(out, 12, `;`);
        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [[0]];`);
    print(out, 8, `}`);


    print(out, 4, `} else if (-1 == 0x${primeGK.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr2(out, 16, consts.gk.M[t-2]);
        print(out, 12, `;`);
        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [[0]];`);
    print(out, 8, `}`);

    print(out, 4, `} else {`);
    print(out, 8, `assert(0);`);
    print(out, 8, `return [[0]];`);
    print(out, 4, `}`);
    print(out, 0, `}`);
}


function buildP(out, consts) {
    print(out, 0, `function POSEIDON_P(t) {`);
    print(out, 4, `if (-1 == 0x${primeBN.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr2(out, 16, consts.bn.P[t-2]);
        print(out, 12, `;`);
        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [[0]];`);
    print(out, 8, `}`);


    print(out, 4, `} else if (-1 == 0x${primeGK.toString(16)}) {`);

    for (let t=2; t<17; t++) {
        print(out, 8, `if (t == ${t}) {`);
        print(out, 12, `return`);
        printArr2(out, 16, consts.gk.P[t-2]);
        print(out, 12, `;`);
        print(out, 8, `}`);
    }
    print(out, 8, `else {`);
    print(out, 12, `assert(0);`);
    print(out, 12, `return [[0]];`);
    print(out, 8, `}`);

    print(out, 4, `} else {`);
    print(out, 8, `assert(0);`);
    print(out, 8, `return [[0]];`);
    print(out, 4, `}`);
    print(out, 0, `}`);
}

async function run() {
    const out = [];

    print(out, 0, `// Parameters are generated by a reference script https://extgit.iaik.tugraz.at/krypto/hadeshash/-/blob/master/code/generate_parameters_grain.sage`);
    print(out, 0, `// Used like so: sage generate_parameters_grain.sage 1 0 254 2 8 56 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001`);
    print(out, 0, ``);
    print(out, 0, `pragma circom 2.0.0;`);

    buildC(out, consts);
    buildM(out, consts);
    buildS(out, consts);
    buildP(out, consts);

    await fs.promises.writeFile("./circuits/poseidon_constants.circom", out.join("\n"));
}

run().then(()=> {
    console.log("Files generated correctly!")
    process.exit(0);
}, (err) => {
    console.log(err.message);
    console.log(err.stack);
    process.exit(1);
});