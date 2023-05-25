pragma circom 2.0.5;

function getOffsetPoints() {
  var PM1 = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd46;
  var QM1 = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000000;

    if (-1 == QM1) {
        return [
            [ 0x0f51e074605c0ba98980b3c9c86343ac4a69e73e85555cece5cc7afd344e1f2c, 0x26969a627e7710ad50ef3c6247df46bb19080aaa113d07bde1ee4ac93c3fdca7 ],
            [ 0x0a83dd31abff1332f956164cfdeca28ab3399a4f617b493e01e58598e6b657cf, 0x28dd9b8ca8edaac30251d6eac4349c69dde385c25877e61ba042704e8b0d12a5 ]
        ];
    } else if (-1 == PM1) {
        return [
            [ 0x0b86d2c770c97a951896a942ea6fdc476ccfe3ed456069d79e01cd62b01f58af, 0x2e237d772881d6f932a3896e12293226584f5fa901e3b22fc19f8259c4b906a0 ],
            [ 0x1257b7936fff979fc035b0043196ab9b7cffd9eddd5d10381105afed7331f4e7, 0x0097ec2918ac199dc3693f079849dd2e44ab9f65df00a78e6aafeeb1795e197c ]
        ];
    } else {
        assert(0);
        return([[0,0],[0,0]]);
    }
}