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
      expect(json2019.stringify("")).to.equal("");
      expect(json2019.stringify("a")).to.equal("a");
      expect(json2019.stringify("10")).to.equal("10");
      expect(json2019.stringify("true")).to.equal("true");
      expect(json2019.stringify("{}")).to.equal("{}");
    });

    it("should handle numbers correctly", function() {
      expect(json2019.stringify(0)).to.equal("0");
      expect(json2019.stringify(10)).to.equal("10");
      expect(json2019.stringify(-10)).to.equal("-10");
      expect(json2019.stringify(3.3)).to.equal("3.3");
    });
  });
});
