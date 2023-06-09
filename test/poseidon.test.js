const chai = require("chai");
const assert = chai.assert;

const buildPoseidon = require("../src/poseidon/poseidon.js");

describe("Poseidon test", function () {
    let poseidonBN;
    let poseidonGK;
    this.timeout(10000000);

    before(async () => {
        poseidonBN = await buildPoseidon("bn");
        poseidonGK = await buildPoseidon("gk");
    });

    it("Should check constrain reference implementation x5 t2 bn128", async () => {
        const res1 = poseidonBN([1]);
        assert(poseidonBN.F.eq(poseidonBN.F.e("0x29176100eaa962bdc1fe6c654d6a3c130e96a4d1168b33848b897dc502820133"), res1));
    });
    it("Should check constrain reference implementation x5 t2 grumpkin", async () => {
        const res1 = poseidonGK([1]);
        assert(poseidonGK.F.eq(poseidonGK.F.e("0x258b3bb5d2b0935c90a1631ad06517c0d47b199a735eec1b5d9b36854db5adbe"), res1));
    });
});
