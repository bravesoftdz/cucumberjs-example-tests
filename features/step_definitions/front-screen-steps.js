import { expect } from 'chai';

module.exports = function() {
  this.World = require('../support/world.js').World;

  this.Given(/^I am on the Next web site$/, function () {
    return this.browser.get(`${this.HOST}/`);
  });

  this.When(/^I search for "([^"]*)"$/, function (search_terms, done) {
    this.setField('#sli_search_1', search_terms);
    this.click('.SearchButton');
    done();
  });

  this.Then(/^I see the result beginning "([^"]*)"$/, function (result_title) {
    return expect(`.Image[title^="${result_title}"]`).dom.to.be.visible();
  });
};
