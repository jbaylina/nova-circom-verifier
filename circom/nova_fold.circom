template NovaFold {

    // Public output
    signal output commitWx_other_out;  // Commitment of the other circuit
    signal output commitWy_other_out;
    signal output commitEx_other_out;
    signal output commitEy_other_out;
    signal output u_other_out[2];
    signal output x_other_out[2];
    signal output zi_out;

    signal input z0_in;
    signal input zi_in;
    signal input commitWx_other_in;  // Commitment of the other circuit
    signal input commitWy_other_in;
    signal input commitEx_other_in;
    signal input commitEy_other_in;
    signal input u_other_in[2];
    signal input x_other_in[2];

    signal input commitWx_other;
    signal input commitWy_other;
    signal input commitEx_other;
    signal input commitEy_other;
    signal input commitTx_other;
    signal input commitTy_other;
    signal input x_other[2];
    signal input u_other[2];

    signal input i;
    signal input zi_out;



    // First Hash
    signal hIn = Poseidon()(
        i,
        z0,
        zi_in,
        commitWx_other_in,
        commitWy_other_in,
        commitEx_other_in,
        commitEy_other_in,
        u_other_in[0], u_other_in[1];
        x_other_in[0], x_other_out[1];
        z0_in,
        zi_in
    );

    signal hInBits <== OtherToBits()(hIn);
    signal x_other_calc <== BitsToOther()(hInBits);
    x_other_calc[0] === x_other[0];
    x_other_calc[1] === x_other[1];

    // NIFS.V
    signal r <== Poseidon(2)(commitTx_other, commitTx_other);

    signal rBits[254] <== Num2Bits_strict(r);
    signal r2Bits <== mulOther()(rBits, rBits);

    signal [p_rT_x, p_rT_y] <== ScalarMulAny(254)(rBits, commitTx_other, commitTy_other);
    signal [p_r2E_x, p_r2E_y] <== ScalarMulAny(254)(r2Bits, commitEx_other, commitEy_other);
    signal [P1x, P1y] <== ECAdd()(commitEx_other_in, commitEy_other_in, p_rT_x, p_rT_y);
    signal [commitEx_other_out, commitEy_other_out] <== ECAdd()(P1x, P1y, p_rT_x, p_rT_y);

    signal [p_rW_x, p_rW_y] <== ScalarMulAny(254)(rBits, commitWx_other_in, commitWy_other_in);

    signal uBits <== OtherToBits()(u_other);
    signal u_other_in_bits <== OtherToBits()(u_other_in);
    signal u_other_out_bits <== mulAddOther()(rBits, uBits, u_other_in_bits);
    signal u_other_out <== BitsToOther()(u_other_out_bits);

    signal xBits <== OtherToBits()(x_other);
    signal x_other_in_bits <== OtherToBits()(x_other_in);
    signal x_other_out_bits <== mulAddOther()(rBits, xBits, x_other_in_bits);
    signal x_other_out <== BitsToOther()(x_other_out_bits);

    // Last hash
    signal hOut = Poseidon()(
        i + 1,
        z0,
        zi_out,
        commitWx_other_out,
        commitWy_other_out,
        commitEx_other_out,
        commitEy_other_out,
        u_other_other_out[0], u_other_out[1];
        x_other_other_out[0], x_other_out[1];
        z0_in,
        zi_in
    );

}