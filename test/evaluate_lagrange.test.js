const chai = require("chai");
const path = require("path");
const {getCurveFromName} = require("ffjavascript");
const {calculateLagrange} = require("./helpers.js");
const wasm_tester = require("circom_tester").wasm;


describe("Evaluate Lagrange Circuit Test", function () {
    let circuit = [];
    let curve;

    this.timeout(10000000);

    before( async() => {
        curve = await getCurveFromName("bn254");
        circuit = await wasm_tester(path.join(__dirname, "circuits", "evaluate_lagrange.test.circom"), {O:1});
    });

    after( async () => {
        curve.terminate();
    })

    it("Check that lagrange is calculated properly", async () => {

        let x = curve.Fr.random();
        
        const res = (calculateLagrange(3, x, curve)).map(li => curve.Fr.toString(li));

        const w = await circuit.calculateWitness({x: curve.Fr.toString(x)}, true);
        
        await circuit.assertOut(w, {L: res });
        
    });
});



