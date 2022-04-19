'use strict';

// This is a transformation from a template object to project object

const defaulSampleCode = `import cake

print("Starting the program...")
robot = cake.Robot()

print("Exploring the room...")
robot.navigation.explore(timeout=40)

print("Moving to the starting point...")
robot.navigation.move_to(0, 0)

print("Program finished.")
robot.shutdown()
`

module.exports = function(template, owner) {
    const sampleCode = template.sampleCode;

    delete template._id;
    delete template.sampleCode;
    delete template.thumbnail;

    return {
        owner,
        lastChange: new Date(),
        files: {
            'props.json': JSON.stringify(template),
            'main.py': sampleCode || defaulSampleCode,
        }
    }
}
