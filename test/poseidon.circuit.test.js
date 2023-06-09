const chai = require("chai");
const path = require("path");
const buildPoseidon = require("../src/poseidon/poseidon.js");
const wasm_tester = require("circom_tester").wasm;


describe("Poseidon circuit Test", function () {
    let circuitBN1;
    let circuitGK1;
    let circuitBN11;
    let circuitGK11;
    let poseidonBN;
    let poseidonGK;

    let F;
    let ec;

    this.timeout(10000000);

    before( async() => {
        poseidonBN = await buildPoseidon("bn");
        poseidonGK = await buildPoseidon("gk");
        circuitBN1 = await wasm_tester(path.join(__dirname, "circuits", "poseidon_1.circom"), {O:1});
        circuitGK1 = await wasm_tester(path.join(__dirname, "circuits", "poseidon_1.circom"), {O:1, prime: "grumpkin"});
        circuitBN11 = await wasm_tester(path.join(__dirname, "circuits", "poseidon_11.circom"), {O:1});
        circuitGK11 = await wasm_tester(path.join(__dirname, "circuits", "poseidon_11.circom"), {O:1, prime: "grumpkin"});
    });

    it("Check that poseidon matches t=2 BN", async () => {

        const input  = {
            inputs: [1n],
        };

        const res1 = poseidonBN([1]);

        const w = await circuitBN1.calculateWitness(input, true);

        await circuitBN1.assertOut(w, {out: poseidonBN.F.toObject(res1)});
    });

    it("Check that poseidon matches t=2 GK", async () => {

        const input  = {
            inputs: [1n],
        };

        const res1 = poseidonGK([1]);

        const w = await circuitGK1.calculateWitness(input, true);

        await circuitGK1.assertOut(w, {out: poseidonGK.F.toObject(res1)});
    });


    it("Check that poseidon matches t=12 BN", async () => {

        const input  = {
            inputs: [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n],
        };

        const res1 = poseidonBN([1,2,3,4,5,6,7,8,9,10,11]);

        const w = await circuitBN11.calculateWitness(input, true);

        await circuitBN11.assertOut(w, {out: poseidonBN.F.toObject(res1)});
    });

    it("Check that poseidon matches t=12 GK", async () => {

        const input  = {
            inputs: [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n],
        };

        const res1 = poseidonGK([1,2,3,4,5,6,7,8,9,10,11]);

        const w = await circuitGK11.calculateWitness(input, true);

        await circuitGK11.assertOut(w, {out: poseidonGK.F.toObject(res1)});
    });
});



