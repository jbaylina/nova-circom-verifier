

const readR1cs = require("r1csfile").readR1cs;

const fs = require("fs");
const version = require("../package").version;

const generateCircomWitnessVerifier = require("./generate_circom_witness_verifier");


const argv = require("yargs")
    .version(version)
    .usage("node generate_witness_verifier.js -r <circuit.r1cs> -c <verifier.circom>")
    .alias("r", "r1cs")
    .alias("c", "circom")
    .argv;

async function run() {


    const r1csFile = typeof(argv.r1cs) === "string" ?  argv.r1cs.trim() : "circuit.r1cs";

    const r1cs = await readR1cs(r1csFile, true, true, false);


    const circomFile = typeof(argv.circom) === "string" ?  argv.circom.trim() : "verifier.circom";

    const circomData = generateCircomWitnessVerifier(r1cs);

    await fs.promises.writeFile(circomFile, circomData, "utf8");

    console.log("files Generated Correctly");
}

run().then(()=> {
    process.exit(0);
}, (err) => {
    console.log(err.message);
    console.log(err.stack);
    process.exit(1);
});

