const F1Field = require("ffjavascript").F1Field;
const EC = require("./ec.js");
const Pedersen = require("./pedersen.js")

const p = 21888242871839275222246405745257275088696311157297823662689037894645226208583n;
const q = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;


function printPoint(F, p) {
    console.log(`[ 0x${F.toObject(p[0]).toString(16)}, 0x${F.toObject(p[1]).toString(16)} ],`);
}

function formatPoint(F, p) {
    return `[ 0x${F.toObject(p[0]).toString(16).padStart(64,"0")}, 0x${F.toObject(p[1]).toString(16).padStart(64,"0")} ]`;
}


async function run() {
    const gkF = new F1Field(q);
    const gkEC = new EC(gkF, gkF.zero, gkF.e(-17n));
    const gkPedersen = new Pedersen(gkEC);
    const bnF = new F1Field(p);
    const bnEC = new EC(bnF, bnF.zero, bnF.e(3n));
    const bnPedersen = new Pedersen(bnEC);

    const out = [];
    out.push(`pragma circom 2.0.5;`);
    out.push(``);

    const [gkOffset, gkOffset4] = gkPedersen.getRandomOffset();
    const [bnOffset, bnOffset4] = bnPedersen.getRandomOffset();

    out.push(`function getOffsetPoints() {`);
    out.push(`  var PM1 = 0x${(p-1n).toString(16)};`);
    out.push(`  var QM1 = 0x${(q-1n).toString(16)};`);
    out.push(``);
    out.push(`    if (-1 == QM1) {`);
    out.push(`        return [`);
    out.push(`            ${formatPoint(gkF, gkOffset)},`);
    out.push(`            ${formatPoint(gkF, gkOffset4)}`);
    out.push(`        ];`);
    out.push(`    } else if (-1 == PM1) {`);
    out.push(`        return [`);
    out.push(`            ${formatPoint(bnF, bnOffset)},`);
    out.push(`            ${formatPoint(bnF, bnOffset4)}`);
    out.push(`        ];`);
    out.push(`    } else {`);
    out.push(`        assert(0);`);
    out.push(`        return([[0,0],[0,0]]);`);
    out.push(`    }`);
    out.push(`}`);


    console.log(out.join("\n"));

    // console.log("Bases");
    for (let i=0; i<4; i++) {
        const p = gkPedersen.getBasePoint(i);
        // printPoint(gkF, p);
    }

    /*
    const r = gkEC.scalarMul(p, gkEC.g);
    printPoint(gkF, r);
    */


}

run().then(()=> {
    process.exit(0);
}, (err) => {
    console.log(err.message);
    console.log(err.stack);
    process.exit(1);
});