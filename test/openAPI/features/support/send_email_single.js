const chai = require('chai');
const { spec } = require('pactum');
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const {
  localhost,
  defaultResponseTime,
  sendSingleEmailEndpoint,
  contentTypeHeader,
  sendEmailSingleResponseSchema,
  sendEmailSingleRequestBody,
} = require('./helpers/helpers');

chai.use(require('chai-json-schema'));

let specSendEmailSingle;

const baseUrl = localhost + sendSingleEmailEndpoint;
const endpointTag = { tags: `@endpoint=/${sendSingleEmailEndpoint}` };

Before(endpointTag, () => {
  specSendEmailSingle = spec();
});

// Scenario: User successfully sends an email smoke type test
Given(
  'User wants to send a single email',
  () => 'User wants to send a single email'
);

When(
  'User sends {string} request with given {string} as api_key and required body',
  (method, apiKey) =>
    specSendEmailSingle
      .withMethod(method)
      .withPath(baseUrl)
      .withHeaders('api_key', apiKey)
      .withHeaders('Accept', 'application/json')
      .withBody(sendEmailSingleRequestBody)
);

Then(
  'User receives a response from \\/send\\/email\\/single endpoint',
  async () => await specSendEmailSingle.toss()
);

Then(
  'The \\/send\\/email\\/single response should be returned in a timely manner 15000ms',
  () =>
    specSendEmailSingle
      .response()
      .to.have.responseTimeLessThan(defaultResponseTime)
);

Then('The \\/send\\/email\\/single response should have status 200', () =>
  specSendEmailSingle.response().to.have.status(200)
);

Then(
  'The \\/send\\/email\\/single response should have content-type: application\\/json header',
  () =>
    specSendEmailSingle
      .response()
      .to.have.headerContains(contentTypeHeader.key, contentTypeHeader.value)
);

Then('The \\/send\\/email\\/single response should match json schema', () =>
  chai
    .expect(specSendEmailSingle._response.json)
    .to.be.jsonSchema(sendEmailSingleResponseSchema)
);

// Scenario Outline: User is unable to send an email due to unallowed method in the request
// Given, When and others Then for this scenario are written in the aforementioned example

Then(
  'The \\/send\\/email\\/single response should have status 405 - Method not allowed',
  () => specSendEmailSingle.response().to.have.status(405)
);

Then(
  'The \\/send\\/email\\/single response should contain Allow header with POST method which is allowed',
  () => specSendEmailSingle.response().to.have.headerContains('allow', 'POST')
);

After(endpointTag, () => {
  specSendEmailSingle.end();
});
