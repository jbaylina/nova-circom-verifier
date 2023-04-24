const fs = require('fs');
const { exit } = require('process');
const BigNumber = require('bignumber.js');

const CHUNKS = 4;

const CONSTANT = new BigNumber(2).pow(128).minus(1);

async function main() {
    let obj = [];
    let precomputed_bases = [];
    const data = await fs.readFileSync('generated_files/generators.json', 'utf8');
    obj = JSON.parse(data);

    for (let i = 0; i < obj.length; i += CHUNKS) {
        for (let j = 0; j < (1 << CHUNKS); j++) {
            console.log(j.toString(2).padStart(CHUNKS, '0'));
            const selectors = Array.from(j.toString(2).padStart(CHUNKS, '0'), Number);
            selectors.reverse();
            let accumulator = CONSTANT;
            for (let k = 0; k < selectors.length; k++) {
                if (selectors[k] === 1) {
                    const num = new BigNumber(obj[i + k], 16);
                    accumulator = accumulator.plus(num);
                }
            }
            console.log(selectors);
            console.log("0x" + accumulator.toString(16));
            precomputed_bases.push("0x" + accumulator.toString(16));
        }
    }
    const json = JSON.stringify(precomputed_bases);
    fs.writeFile('generated_files/pre_computed_generators.json', json, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Random Bases generated successfully!');
    });
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});