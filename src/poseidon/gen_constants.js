const fs = require("fs");
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const sageExe = "/Applications/SageMath-9-3.app/Contents/Frameworks/Sage.framework/Versions/Current/local/bin/sage"
const genPoseidonn = "/Users/jbaylina/git/iden3/hadeshash/code/generate_params_poseidon.sage";

const primeBN = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001n;
const primeGK = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47n;

//  1 0 254 3 5 128 30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001

async function genParams(t, prime) {
    const { stdout, stderr } = await exec(`${sageExe} ${genPoseidonn} 1 0 254 ${t} 5 128 ${prime.toString(16)}`);
    const lines = stdout.split("\n");
    if (stderr != "") {
        throw new Error(stderr);
    }
    const N = Number(lines[0].match(/R_P=([0-9]+)/)[1]);
    const C = JSON.parse(lines[5].replace(/'/g, '"'));
    const MDS = JSON.parse(lines[17].replace(/'/g, '"'));
    return [N, C, MDS];
}

async function run() {
    const constsBN = {C: [], M: []};
    const constsGK = {C: [], M: []};
    const nsBN = [];
    const nsGK = [];
    for (let i=2; i<=17; i++) {
        const [N1, C1, MDS1] = await genParams(i, primeBN);
        constsBN.C.push(C1);
        constsBN.M.push(MDS1);
        nsBN.push(N1);
        console.log(`${i-1} -> ${N1}`);
        const [N2, C2, MDS2] = await genParams(i, primeGK);
        constsGK.C.push(C2);
        constsGK.M.push(MDS2);
        nsGK.push(N2);
        console.log(`${i-1} -> ${N2}`);
    }
    console.log(JSON.stringify(nsBN));
    console.log(JSON.stringify(nsGK));
    await fs.promises.writeFile("./src/poseidon/poseidon_constants.js", `module.exports = { bn: ${ JSON.stringify(constsBN, null, 1) }, gk: ${ JSON.stringify(constsGK, null, 1) } };\n`);
}

run().then(()=> {
    process.exit(0);
}, (err) => {
    console.log(err.message);
    console.log(err.stack);
    process.exit(1);
});