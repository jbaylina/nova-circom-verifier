const blake2b = require("blake2b");

const GENPOINT_PREFIX = "PedersenGenerator";

class Pedersen {
    constructor(EC) {
        this.EC = EC;
        this.bases = [];
    }

    padLeftZeros(idx, n) {
        let sidx = "" + idx;
        while (sidx.length<n) sidx = "0"+sidx;
        return sidx;
    }

    baseHash(S) {
        return Buffer.from(blake2b(32).update(Buffer.from(S)).digest());
    }



    getBasePoint(pointIdx) {
        if (this.bases[pointIdx]) return this.bases[pointIdx];
        let p= null;
        let tryIdx = 0;
        while (p==null) {
            const S = GENPOINT_PREFIX + "_" + this.padLeftZeros(pointIdx, 32) + "_" + this.padLeftZeros(tryIdx, 32);
            const h = this.baseHash(S);
            h[31] = h[31] & 0xBF;  // Set 255th bit to 0 (256th is the signal and 254th is the last possible bit to 1)
            p = this.EC.unpackPoint(h);
            tryIdx++;
        }

        this.bases[pointIdx] = p;
        return p;
    }

    getRandomOffset() {
        let p= null;
        let tryIdx = 0;
        while (p==null) {
            const S = GENPOINT_PREFIX + "_RANDOMOFFSET_" + this.padLeftZeros(tryIdx, 32);
            const h = this.baseHash(S);
            h[31] = h[31] & 0xBF;  // Set 255th bit to 0 (256th is the signal and 254th is the last possible bit to 1)
            p = this.EC.unpackPoint(h);
            tryIdx++;
        }

        const offset4 = this.EC.neg(this.EC.scalarMul(1n << 256n, p));
        return [p, offset4];
    }

}

module.exports = Pedersen;