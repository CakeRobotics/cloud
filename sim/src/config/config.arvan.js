// Openshift commandline entrypoint
const OC_CMD = "oc";

// List of available domains. Make sure they resolve to $(minishift ip)
const NODE_HOSTNAMES_POOL = [
    "node-1.sim.cakerobotics.com",
    "node-2.sim.cakerobotics.com",
    "node-3.sim.cakerobotics.com",
];

// Whether or not the pod's resources should be explicitly claimed in the yaml
const DEFINE_RESOURCES = true;

// OKD integrated docker registry address in ip:port format (Accessible within the cluster)
// const REGISTRY_INTERNAL_ADRESS = "user-registry-test-1.apps.ir-thr-at1.arvan.run";
const REGISTRY_INTERNAL_ADRESS = "user-images.cakerobotics.com";
// NOTE: Maybe remove public route and use "user-images.test-1.svc"

// OC Project (Namespace)
const OC_PROJECT = "test-1";

// Fixed arguments to oc calls (all calls are like $OC_CMD $OC_FIXED_ARGS ...)
const OC_FIXED_ARGS = [
    "--kubeconfig",
    "/home/mostafa/.arvan/paasconfig",
    "-n",
    OC_PROJECT
];

// Where to pull sim image from
const SIM_IMAGE = `cakerobotics/sim:r15.2345ded-lite`;

// cake-bundler executable (probably venv'd) FIXME: needs dockerfile
const CAKE_BUNDLER = `${process.env.HOME}/dev/cake/core/sim/venv/bin/cake-bundler`


module.exports = {
    OC_CMD,
    NODE_HOSTNAMES_POOL,
    DEFINE_RESOURCES,
    REGISTRY_INTERNAL_ADRESS,
    REGISTRY_INTERNAL_ADRESS,
    OC_PROJECT,
    OC_FIXED_ARGS,
    SIM_IMAGE,
    CAKE_BUNDLER,
}
