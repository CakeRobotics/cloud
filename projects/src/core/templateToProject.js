'use strict';

// This is a transformation from a template object to project object

const defaulSampleCode = `
import Cake

class MyRobot():
    def init():
        pass
    
    def loop():
        pass
`

module.exports = function(template, owner) {
    const sampleCode = template.sampleCode;

    delete template._id;
    delete template.sampleCode;

    return {
        owner,
        lastChange: new Date(),
        files: {
            'props.json': JSON.stringify(template),
            'main.py': sampleCode || defaulSampleCode,
        }
    }
}