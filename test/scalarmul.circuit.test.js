const chai = require("chai");
const path = require("path");
const {F1Field} = require("ffjavascript");
const EC = require("../src/ec.js");
const wasm_tester = require("circom_tester").wasm;

const p = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;
const q = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

function num2bits(n) {
    let s = BigInt(n);
    const r = [];
    for (let i=0; i<256; i++) {
        r[i] = s & 1n;
        s >>= 1n;
    }
    return r;
}

describe("Scalar Mul Test Test", function () {
    let circuit = [];
    let F;
    let ec;

    this.timeout(10000000);

    before( async() => {
        F = new F1Field(q);
        ec = new EC(F, F.zero, F.e(-17n));
        circuit = await wasm_tester(path.join(__dirname, "circuits", "scalarmul.test.circom"), {O:1, include: ["circuits", "node_modules/circomlib/circuits"]});
    });

    it("Check that scalarmul with scalar to 0", async () => {

        const p = ec.g;
        const s = 0n;

        const input  = {
            s: num2bits(s),
            in: p
        };

        const result = ec.scalarMul(s, p);

        const w = await circuit.calculateWitness(input, true);

        await circuit.assertOut(w, {out: result});

    });
    it("Check scalarmul with scalar to 1", async () => {

        const p = ec.g;
        const s = 1n;

        const input  = {
            s: num2bits(s),
            in: p
        };

        const result = ec.scalarMul(s, p);

        const w = await circuit.calculateWitness(input, true);

        await circuit.assertOut(w, {out: result});

    });
    it("Check scalarmul with scalar to all 1", async () => {

        const p = ec.scalarMul(1245n, ec.g);
        const s = (1n << 256n) - 1n;

        const input  = {
            s: num2bits(s),
            in: p
        };

        const result = ec.scalarMul(s, p);

        const w = await circuit.calculateWitness(input, true);

        await circuit.assertOut(w, {out: result});

    });
    it("Check scalarmul with point to 0", async () => {

        const p = ec.zero;
        const s = (1n << 256n) - 1n;

        const input  = {
            s: num2bits(s),
            in: p
        };

        const result = ec.scalarMul(s, p);

        const w = await circuit.calculateWitness(input, true);

        await circuit.assertOut(w, {out: result});

    });
    it("Check scalarmul with point and scalar to 0", async () => {

        const res1 = poseidonBN([1]);

        const input  = {
            in: num2bits(s),
            in: p
        };

        const result = ec.scalarMul(s, p);

        const w = await circuit.calculateWitness(input, true);

        await circuit.assertOut(w, {out: result});

    });
});



