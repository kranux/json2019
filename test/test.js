var assert = require("assert");
var expect = require("chai").expect;

const json2019 = require("../src/json2019");

describe("json2019", function() {
  describe("#stringify()", function() {
    it("should handle empty object correctly", function() {
      expect(json2019.stringify({})).to.equal("{}");
    });

    it("should handle booleans correctly", function() {
      expect(json2019.stringify(true)).to.equal("true");
      expect(json2019.stringify(false)).to.equal("false");
    });

    it("should handle strings correctly", function() {
      expect(json2019.stringify("")).to.equal('""');
      expect(json2019.stringify("a")).to.equal('"a"');
      expect(json2019.stringify("10")).to.equal('"10"');
      expect(json2019.stringify("true")).to.equal('"true"');
      expect(json2019.stringify("{}")).to.equal('"{}"');
    });

    it("should handle numbers correctly", function() {
      expect(json2019.stringify(0)).to.equal("0");
      expect(json2019.stringify(10)).to.equal("10");
      expect(json2019.stringify(-10)).to.equal("-10");
      expect(json2019.stringify(3.3)).to.equal("3.3");
    });

    it("should handle empty arrays", function() {
      expect(json2019.stringify([])).to.equal("[]");
    });

    it("should handle non-empty arrays", function() {
      expect(json2019.stringify(["aaa", false, true, 1, 1.3, {}])).to.equal(
        '["aaa",false,true,1,1.3,{}]'
      );
    });

    it("should handle undefined, a Function, or a Symbol in array correctly: by censoring to null", function() {
      expect(
        json2019.stringify([undefined, function() {}, Symbol.for("aaa")])
      ).to.equal("[null,null,null]");
    });

    it("should handle undefined, a Function, or a Symbol as pure values correctly: by returning undefined", function() {
      expect(json2019.stringify(undefined)).to.equal("undefined");
      expect(json2019.stringify(Symbol.for("true"))).to.equal("undefined");
      expect(json2019.stringify(Symbol.for(function() {}))).to.equal(
        "undefined"
      );
    });

    it("should handle The numbers Infinity and NaN, as well as the value null correctly: by returning null ", function() {
      expect(json2019.stringify(null)).to.equal("null");
      expect(json2019.stringify(NaN)).to.equal("null");
      expect(json2019.stringify(Infinity)).to.equal("null");
      expect(json2019.stringify([null, NaN, Infinity])).to.equals(
        "[null,null,null]"
      );
    });

    it("should handle non empty objects correctly", function() {
      expect(json2019.stringify({ a: "a", b: 10, c: true })).to.equal(
        '{"a":"a","b":10,"c":true}'
      );
    });
  });
});
