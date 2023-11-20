const parseOpenshiftTable = require("../../../../src/utils/openshift/utils/parseOpenshiftTable");

test('parseOpenshiftTable', async function() {
    const openshiftOutput =
        `NAME               TYPE     FROM             STATUS     STARTED        DURATION
        crl-code-build-3   Docker   Binary@f5aa4d9   Complete   21 hours ago   4m4s
        crl-code-build-4   Docker   Binary@f5aa4d9   Complete   21 hours ago   6s`;
    const data = parseOpenshiftTable(openshiftOutput);
    expect(data[1]).toMatchObject({
        name: 'crl-code-build-4',
        type: 'Docker',
        from: 'Binary@f5aa4d9',
        status: 'Complete',
        started: '21 hours ago',
        duration: '6s',
    })
});
