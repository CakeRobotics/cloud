/* The configuration needed to test the service with a local minishift cluster and its integrated docker registry.
 * Make sure:
 *
 * - minishift is up, logged in, and correct project is selected. (host root access is not required)
 *
 * - minishift pods can run as custom users inside containers (you should add a SCC: i think: `oc adm policy add-scc-to-group anyuid system:authenticated`)
 *
 * - "oc" command is working
 *
 * - Node domains resolve to $(minishift ip) [Add all of them to /etc/hosts]
 *
 * - Environment variable CONFIG=local is set
 *
 * - Image `sim:latest` is available in the docker registry, and the active "oc" user has access to it.
 *      More info:
    *      I. EXPOSE AN INSECURE REGISTRY ROUTE
    *      $ oc login -u system:admin
    *      $ oc policy add-role-to-user registry-editor developer
    *      $ oc expose service docker-registry --hostname=registry.local -n default
    *
    *      II. LOGIN TO THE INSECURE REGISTRY
    *      $ oc login -u developer -p developer
    *      # ADD "registry.local" to insecure-registries key in /etc/docker/daemon.json
    *      # ADD `$(minikube ip) registry.local` to /etc/hosts
    *      # systemctl restart docker.service
    *      # docker login -u developer -p $(oc whoami -t) registry.local:80
    *
    *      III. PUSH TO REGISTRY
    *      docker tag sim:latest registry.local:80/myproject/sim:latest # NOTE THAT `myproject` IS A PROJECT YOU HAVE ACCESS TO
    *      docker push registry.local:80/myproject/sim:latest
    *
    *      IV. INSPECT REGISTRY
    *      eval $(minishift docker-env)
    *      docker images
    *
    * SIMILAR STEPS AT: https://github.com/minishift/minishift/issues/817#issuecomment-296920873
 */


// Openshift commandline entrypoint
const OC_CMD = "oc";

// List of available domains. Make sure they resolve to $(minishift ip)
const NODE_HOSTNAMES_POOL = [
    "node-1.sim.minishift.local",
    "node-2.sim.minishift.local",
    "node-3.sim.minishift.local",
];

// Whether or not the pod's resources should be explicitly claimed in the yaml
const DEFINE_RESOURCES = false;

// OC Project (Namespace)
const OC_PROJECT = "myproject";

// Fixed arguments to oc calls (all calls are like $OC_CMD $OC_FIXED_ARGS ...)
const OC_FIXED_ARGS = ["-n", OC_PROJECT];

// Where to pull sim image from
const SIM_IMAGE = `${REGISTRY_INTERNAL_ADRESS}/${OC_PROJECT}/sim:latest`;

// Where to pull crl image from
const CRL_DEV_IMAGE = `cakerobotics/crl-dev:latest`;

// cake-bundler executable (probably venv'd)
const PYTHON_EXEC = `python3` // $ source /home/mostafa/dev/cake/core/sim/venv/bin/activate


module.exports = {
    OC_CMD,
    NODE_HOSTNAMES_POOL,
    DEFINE_RESOURCES,
    OC_PROJECT,
    OC_FIXED_ARGS,
    SIM_IMAGE,
    CRL_DEV_IMAGE,
    PYTHON_EXEC,
}
