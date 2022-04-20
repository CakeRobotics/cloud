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

// OC Project (Namespace)
const OC_PROJECT = "cakerobotics";

// Fixed arguments to oc calls (all calls are like $OC_CMD $OC_FIXED_ARGS ...)
const OC_FIXED_ARGS = [
    "--kubeconfig",
    "/home/mostafa/.arvan/paasconfig",
    "-n",
    OC_PROJECT
];

// Where to pull sim image from
const SIM_IMAGE = `oreg.cakerobotics.com/sim:r23.922ef83-lite`;

// Where to pull crl image from
const CRL_DEV_IMAGE = `oreg.cakerobotics.com/crl-dev:latest`;


module.exports = {
    OC_CMD,
    NODE_HOSTNAMES_POOL,
    DEFINE_RESOURCES,
    OC_PROJECT,
    OC_FIXED_ARGS,
    SIM_IMAGE,
    CRL_DEV_IMAGE,
}
