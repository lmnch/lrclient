const {expect, test} =require('@oclif/test');


describe('send', () => {
  fetchMock('https://test.url/start',"GET").status(200).json({test: "json"});
  test
  .stdout()
  .command(['send', 'test/resources/collections/url-start.json'])
  .it('shows user email when logged in', ctx => {
    expect(ctx.stdout).to.equal('jeff@example.com\n')
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
