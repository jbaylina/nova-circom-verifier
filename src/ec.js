
class EC {
    constructor(F, a, b, g) {
        this.F = F;
        this.a=a;
        this.b=b;
        this.zero = [0n, 0n];
        if (g) {
            this.g=g;
        } else {
            this.g = this.getBase();
        }
    }

    add(inp, inq) {
        const F = this.F;
        if (F.isZero(inp[1])) return inq;
        if (F.isZero(inq[1])) return inp;
        let landa;
        if (!this.F.eq(inp[0], inq[0])) {
            landa = F.div( F.sub(inp[1], inq[1]), F.sub(inp[0], inq[0]) )
        } else {
            if (!F.eq(inp[1], inq[1])) {
                if (!F.isZero(F.add(inp[1], inq[1]))) throw new Error("Points not in curve");
                return [F.zero, F.zero];
            }
            const x2 = F.square(inp[0]);
            landa = F.div(
                F.add(F.add(F.add(x2, x2), x2), this.a),
                F.add(inp[1], inp[1])
            )
        }
        const r = [];
        r[0] = F.sub(F.square(landa), F.add(inp[0], inq[0]));
        r[1] = F.sub(F.mul(landa, F.sub(inp[0], r[0])), inp[1]);
        return r;
    }

    double(inp) {
        return this.add(inp, inp);
    }

    neg(inp) {
        return [inp[0], this.F.neg(inp[1])];
    }

    scalarMul(s, p) {
        let r = 1n;
        while (r<=s) r <<= 1n;

        let acc = [this.F.zero, this.F.zero];
        r >>= 1n;
        while(r) {
            acc = this.double(acc);
            if (r & s) acc = this.add(acc, p);
            r >>= 1n;
        }
        return acc;
    }


    unpackPoint(buff) {
        const F = this.F;
        let sign = false;
        const P = new Array(2);
        if (buff[31] & 0x80) {
            sign = true;
            buff[31] = buff[31] & 0x7F;
        }
        P[0] = F.fromRprLE(buff, 0);
        if (F.toObject(P[0]) >= this.F.p) return null;

        const right = F.add(
            F.mul(F.square(P[0]), P[0]),
            F.add(
                F.mul(this.a, P[0]),
                this.b
            )
        );

        let y = F.sqrt(right);

        if (y == null) return null;

        if (sign) y = F.neg(y);

        P[1] = y;

        return P;
    }

    baseHash(S) {
        return Buffer.from(blake2b(32).update(Buffer.from(S)).digest());
    }

    getBase() {
        const F = this.F;
        let P = [F.zero, null];
        while (!P[1]) {
            P[0] = F.add(P[0], F.one);
            const right = F.add(
                F.mul(F.square(P[0]), P[0]),
                F.add(
                    F.mul(this.a, P[0]),
                    this.b
                )
            );

            P[1] = F.sqrt(right);
        }
        return this.neg(P);
    }


}

module.exports = EC;