const {expect, test} =require('@oclif/test');

const expectNextLineToBe = (outputLines, expected) => {
  expect(outputLines.length).to.be.gte(1);
  if(expected!==undefined){
    const output = outputLines[0];
    expect(output).to.be.eq(expected);
  }
  outputLines.shift();
}

/**
 * Naming of the test:
 * [*environment path*|*endpoint path*] *what it should do*
 * 
 * The test resources are stored in test/resources.
 */
describe('send', () => {
  fetchMock('https://test.url/start',"GET").status(200).json({test: "json"});
  test
  .stdout()
  .command(['send', 'test/resources/collections/url-start.json' , '-v', 'bearerToken: 3'])
  .it('[test-env|url-start] should log request and response by default', ctx => {
    const output = ctx.stdout.split("\n");
    
    expectNextLineToBe(output,"Request:");
    // Two not really displayed lines because of color logger
    // => ignore
    expectNextLineToBe(output);
    expectNextLineToBe(output);
    // Endpoint
    expectNextLineToBe(output, " GET https://test.url/start");
    // Headers
    expectNextLineToBe(output, "Authorization: Bearer 3");

  })

  // test
  // .nock('https://api.heroku.com', api => api
  //   .get('/account')
  //   // HTTP 401 means the user is not logged in with valid credentials
  //   .reply(401)
  // )
  // .command(['auth:whoami'])
  // // checks to ensure the command exits with status 100
  // .exit(100)
  // .it('exits with status 100 when not logged in')
})
