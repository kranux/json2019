var assert = require("assert");
var expect = require("chai").expect;

const json2019 = require("../src/json2019");

describe("json2019", function() {
  describe("#stringify()", function() {
    it('should convert {} to "{}"', function() {
      expect(json2019.stringify({})).to.equal("{}");
    });
  });
});
