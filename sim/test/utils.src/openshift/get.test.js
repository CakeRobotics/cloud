const get = require("../../../src/utils/openshift/get");

test('get', async function() {
    const replicaSets = await get('ReplicaSets');
    expect(replicaSets.length).toEqual(0);
})
