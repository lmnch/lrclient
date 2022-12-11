
const path = require('path')
process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json')
process.env.NODE_ENV = 'development'

global.oclif = global.oclif || {}
global.oclif.columns = 80



global.fetchMock = (urlThat, methodThat, headersThat, bodyThat) => {
    const mockInator = (mocker) => {
        global.fetch = (pUrl, { method: pMethod, headers: pHeaders, body: pBody }) => {
            if (urlThat(pUrl) && methodThat(pMethod)
                && (!headersThat || headersThat(pHeaders))
                && (!bodyThat || bodyThat(pBody))) {
                return Promise.resolve(mocker);
            }
        };
    };
    return {
        status: (status, statusMessage="") => {
            return {
                json: (jsonPayload) => {
                    const headers = new Headers();
                    headers.append("Content-Type", "application/json");
                    return mockInator({ status: status, headers: headers, text: () => JSON.stringify(jsonPayload), statusText: statusMessage })
                },
                text: (textPaload) => mockInator({ status: status, headers: new Headers(), text: () => textPaload, statusText: statusMessage }),
            }
        }
    }
}

process.env.LRC_CONFIG_FILE = "./test/resources/test.config"