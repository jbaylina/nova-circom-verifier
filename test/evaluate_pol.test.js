const chai = require("chai");
const path = require("path");
const {getCurveFromName, BigBuffer} = require("ffjavascript");
const { Polynomial } = require("../polynomial");
const { calculateLagrange } = require("./helpers");
const wasm_tester = require("circom_tester").wasm;


describe("Evaluate pol Circuit Test", function () {
    let circuit = [];
    let curve;

    this.timeout(10000000);

    before( async() => {
        curve = await getCurveFromName("bn254");
        circuit = await wasm_tester(path.join(__dirname, "circuits", "evaluate_pol.test.circom"), {O:1});
    });

    after( async () => {
        curve.terminate();
    })

    it("Check that evaluate polynomial works properly", async () => {

        let n = 4;

        //let x = curve.Fr.random();
        let x = curve.Fr.one;

        let buffer = new BigBuffer(curve.Fr.n8 * n);
        for(let i = 0; i < n; ++i) {
            buffer.set(curve.Fr.e(i + 1), i*curve.Fr.n8);
        }
        
        // TODO 

        const input  = {};

        const evaluation = "";

        const w = await circuit.calculateWitness(input, true);
        
        await circuit.assertOut(w, {out: evaluation});
        
    });
});



