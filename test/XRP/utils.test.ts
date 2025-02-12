import { bytesToRippleAddress, rippleAddressToBytes, rippleTimeToUnixEpoch, unixEpochToRippleTime } from "../../src";
import { expect } from "chai";

describe("Test utils ", function () {
   it("should convert empty address to bytes ", async function () {
      const byts = rippleAddressToBytes("");

      expect(byts.length).to.eq(1);
   });

   it("should convert classic account to bytes ", async function () {
      const acc = "r4BhzWSGGjTeSdpcXMPoT1AbiCQm76FQGd";
      const byts = rippleAddressToBytes(acc);

      expect(byts.length).to.eq(20);
   });

   it("should convert x-account to bytes ", async function () {
      const acc = "XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi";
      const byts = rippleAddressToBytes(acc);

      expect(byts.length).to.eq(20);
   });

   it("should check that classic and x-account to bytes match ", async function () {
      const acc = "XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi";
      const classicAcc = "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf";
      const byts = rippleAddressToBytes(acc);
      const cByts = rippleAddressToBytes(classicAcc);

      expect(byts.length).to.eq(20);
      expect(cByts.length).to.eq(20);
      expect(Buffer.compare(byts, cByts)).to.eq(0);
   });

   it("should encode and decode to same acc string ", async function () {
      const classicAcc = "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf";
      const cByts = rippleAddressToBytes(classicAcc);
      const decode = bytesToRippleAddress(cByts);

      expect(cByts.length).to.eq(20);
      expect(classicAcc).to.eq(decode);
   });

   it("should not convert from bytes to ripple address", async function () {
      const byts = Buffer.from("0x00");
      const fn = () => {
         return bytesToRippleAddress(byts);
      };
      const er = `Not a valid ripple address`;
      expect(fn).to.throw(Error);
      expect(fn).to.throw(er);
   });

   it("should not decode from x-account to bytes ", async function () {
      const acc = "XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8yuPT7y4xaEHi";
      const classicAcc = "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf";
      const byts = rippleAddressToBytes(acc);
      const decode = bytesToRippleAddress(byts);

      expect(byts.length).to.eq(20);
      expect(classicAcc).to.eq(decode);
   });

   it("should convert from ripple time to unix epoch", async function () {
      //1.1.2022 in ripple time = 694310400
      //1.1.2022 in unix epoch = 1640995200
      const rt2022 = 694310400;
      const expected = 1640995200;
      const res = rippleTimeToUnixEpoch(rt2022);
      expect(res).to.equal(expected);
   });

   it("should convert from unix epoch to ripple time", async function () {
      //1.1.2022 in ripple time = 694310400
      //1.1.2022 in unix epoch = 1640995200
      const ux2022 = 1640995200;
      const expected = 694310400;
      const res = unixEpochToRippleTime(ux2022);
      expect(res).to.equal(expected);
   });
});
