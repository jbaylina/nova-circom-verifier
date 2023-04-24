
include "pedersen_commitment.circom";
include "verify_witness.circom";
include "evaluate_pol.circom";
include "evaluate_lagrange.circom";


template NovaVerifier(nWLogic, nELogic, nWDummy, nEDummy) {

    signal input publicInputLogic;     // z_0
    signal output publicOutputLogic;    // z_i

    // Required to do the KATE opening outside
    signal output commWlogicX[2];  // 2 chunks of 128 bits in dummy field
    signal output commWlogicY[2];  // 2 chunks of 128 bits in dummy field
    signal output commElogicX[2];  // 2 chunks of 128 bits in dummy field
    signal output commElogicY[2];  // 2 chunks of 128 bits in dummy field
    signal output evalW;
    signal output evalE;

    signal input Wlogic[nWLogic];   // Witness values
    signal input Elogic[nELogic];   // Error values

    signal input Wdummy[nWDummy][2];  // Groups o 2 chunks 2 128 bits
    signal input Edummy[nEDummy][2];  // Groups o 2 chunks 2 128 bits

    // Extract the logic circuit commitments from the Dummy witness
    commWlogicX <== Wdummy[1];
    commWlogicY <== Wdummy[2];
    commElogicX <== Wdummy[3];
    commElogicY <== Wdummy[4];

    signal uLogic <== Wlogic[5];

    Wlogic[0] === uLogic;  // Forces 1 to all registers

    signal commWdummyX;  // 4 chunks of 64 bits in dummy field
    signal commWdummyY;  // 4 chunks of 64 bits in dummy field
    signal commEdummyX;  // 4 chunks of 64 bits in dummy field
    signal commEdummyY;  // 4 chunks of 64 bits in dummy field
    // Extract the dummy circuit commitments from the logic witness
    commWdummyX <= Wlogic[1];
    commWdummyY <= Wlogic[2];
    commEdummyX <= Wlogic[3];
    commEdummyY <= Wlogic[4];

    signal uDummy[2] <== Wdummy[5];

    Wdummy[0][0] === uDummy[0];  // Forces 1 to all registers
    Wdummy[0][1] === uDummy[1];  // Forces 1 to all registers

    // Extract public outputs

    publicOutput <== Wlogic[7];
    publicInput === Wlogic[8];

    // Asset public inputs

    component verifyWitnessLogic = VeifyWitnessLogic();
    verifyWitnessLogic.W <== Wlogic;
    verifyWitnessLogic.E <== Elogic;
    verifyWitnessLogic.u <== uLogic;

    component verifyWitnessDummy = VeifyWitnessDummy();
    verifyWitnessDummy.W <== WDummy;
    verifyWitnessDummy.E <== Edummy;
    verifyWitnessDummy.u <== uDummy;

    /////////////
    // Verification of the logic commitment.
    /////////////

    // We use KATE commitment for the logc commitment

    // Get an opening point by SHA256 comitmet to the witness of W and E

    signal x <== CWCE_to_scalar()(commWlogicX, commWlogicY, commElogicX, commElogicY);

    var maxLogic = nWLogic > nELogic ? nWLogic : nELogic;
    signal L <== EvaluateLagrange(maxLogic)(xi);

    signal LW[nWLogic];
    signal LE[nELogic];

    for (var i=0; i< nWLogic; i++) {
        LW[i] <== L[i];
    }

    for (var i=0; i< nELogic; i++) {
        LE[i] <== L[i];
    }

    evalW <== EvaluatePol(nWLogic)(Wlogic, LW);
    evalE <== EvaluatePol(nELogic)(Elogic, LE);

    // The verifier will check this openings.

    /////////////
    // Verification of the dummy commitment.
    /////////////

    signal commCdummyX_calc, commCdummyY_calc;
    [commWdummyX_calc, commWdummyY_calc] <== PedersenCommitment(nDummy)(Wdummy);
    commWdummyX_calc === commWdummyX;
    commWdummyY_calc === commWdummyY;

    signal commEdummyX_calc, commEdummyY_calc;
    [commEdummyX_calc, commEdummyY_calc] <== PedersenCommitment(nDummy)(Edummy);
    commEdummyX_calc === commEdummyX;
    commEdummyY_calc === commEdummyY;

}