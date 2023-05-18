<script setup>
import axios from 'axios';
import { reactive, onMounted, onBeforeMount } from 'vue';
const BASE_URL = 'http://127.0.0.1:5050';

var data = reactive({
  nx: 4,
  ny: 6,
  d: 1.0,
  robot_states: {
    '1': [3.01, 4.25, 5],
    '2': [0.99, 1.81, 5],
    '3': [0.24, 3, 5],
  },
  paths: {
    '1': [[3, 1], [2, 1], [2, 2], [2, 3], [2, 4], [3, 5]],
    '2': [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
    '3': [[0, 3], [1, 3], [2, 3], [3, 3]],
  },
  // obstacles: [[3, 2]],
  obstacles: [],
  goals: {
    '1': [3, 1],
    '2': [0, 0],
    '3': [3, 3],
  }
});

var selected_robot = reactive();
var target_x = reactive();
var target_y = reactive();
var target_heading = reactive(2);
var plan_preview_image_url = reactive();

onMounted(async function () {
  await fetch();
  await updateChain();
  // bump_preview_image_url();
  // console.log(plan_preview_image_url);
});


function bump_preview_image_url() {
  plan_preview_image_url = `${BASE_URL}/env/default/plans/viz.png?v=${Math.random()}`;
}

function gridPoints() {
  const {nx, ny} = data;
  var list = []
  for (var i = 0; i < nx; i++) {
    for (var j = 0; j < ny; j++) {
      list.push({style: {left: `${100*(i+.5)/nx}%`, bottom: `${100*(j+.5)/ny}%`}});
    }
  }
  return list;
}

function robots() {
  var list = []
  for (const robot in data.robot_states) {
    const [x, y, theta] = data.robot_states[robot];
    const { d, nx, ny } = data;
    list.push({style: {left: `${100*(x/d+.5)/nx}%`, bottom: `${100*(y/d+.5)/ny}%`}, id: robot});
  }
  return list;
}

function pathTraces() {
  var list = []
  for (const robot in data.robot_states) {
    const path = data.paths[robot];
    if (!path) {
      continue;
    }
    const { d, nx, ny } = data;
    var [x, y] = path[0]
    for (var i = 0; i < path.length; i+=0.1) {
      var a = path[Math.floor(i)];
      var b = path[Math.floor(i + 1)];
      if (!b) {
        continue;
      }
      var x = a[0] * (i - Math.floor(i)) + b[0] * (1 - i + Math.floor(i));
      var y = a[1] * (i - Math.floor(i)) + b[1] * (1 - i + Math.floor(i));
      list.push({style: {left: `${100*(x/d+.5)/nx}%`, bottom: `${100*(y/d+.5)/ny}%`}, id: robot});
    }
  }
  return list;
}

function obstacles() {
  var list = []
  for (const [x, y] of data.obstacles) {
    const { d, nx, ny } = data;
    list.push({style: {left: `${100*(x/d+.5)/nx}%`, bottom: `${100*(y/d+.5)/ny}%`}});
  }
  return list;
}

async function apply_mission() {
  // const { data } = await axios.get(`${BASE_URL}/health`);
  // alert(JSON.stringify(data));
  if (!selected_robot || !target_x || !target_y) {
    alert('Select the robot and targets first.');
    return;
  }
  const { data } = await axios.post(`${BASE_URL}/set-goal`, {
    key: 'default',
    robot: selected_robot,
    x: parseInt(target_x),
    y: parseInt(target_y),
    h: parseInt(target_heading),
  });
}

async function fetch() {
  const { data: remoteData } = await axios.get(`${BASE_URL}/env/default`);
  data.robot_states = remoteData.robot_states;
  data.goals = remoteData.robot_goals;
  data.nx = remoteData.nx;
  data.ny = remoteData.ny;
  bump_preview_image_url();
}

async function forceCalculate() {
  await axios.post(`${BASE_URL}/env/default/generate_paths`);
}

const updateChain = async () => {
  try {
    await forceCalculate();
    await fetch();
  } finally {
    setTimeout(updateChain, 1000);
  }
};

// function gridPointsSty(nx, ny) {
//   list = []
//   for (var i = 0; i < nx; i++) {
//     for (var j = 0; j < ny; j++) {
//       list.push({x: `${100*i/nx}%`, y: `${100*j/ny}%`});
//     }
//   }
// }

</script>

<template>
  <div class="plan-preview">
    <img width="400" :src="plan_preview_image_url">
  </div>

  <div class="map">
    <div v-for="p in gridPoints()" class="gridpoint" :style="p.style"></div>
    <div v-for="r in robots()" class="robot" :style="r.style">
      {{ r.id }}
    </div>
    <div v-for="t in pathTraces()" class="trace" :style="t.style"></div>
    <div v-for="b in obstacles()" class="obstacle" :style="b.style"></div>
  </div>

  <div class="control-panel">
    <div>
      Robot:
      <select v-model="selected_robot">
        <option disabled value="">Please select one</option>
        <option v-for="name in Object.keys(data.robot_states)">{{name}}</option>
      </select>
    </div>

    <div>
      Target X:
      <input v-model="target_x">
    </div>

    <div>
      Target Y:
      <input v-model="target_y">
    </div>

    <div>
      Target Heading (Clock Angle):
      <select v-model="target_heading">
        <option value="2">12:00</option>
        <option value="1">1:30</option>
        <option value="0">3:00</option>
        <option value="7">4:30</option>
        <option value="6">6:00</option>
        <option value="5">7:30</option>
        <option value="4">9:00</option>
        <option value="3">10:30</option>
      </select>
    </div>

    <div>
      <button @click="apply_mission">Apply mission</button>
    </div>

    <div style="margin-top: 3em;">
      <div>Status:</div>
      <div v-for="r in Object.keys(data.goals)">
        Robot {{ r }},
        <template v-if="data.robot_states[r]">
          Position: [ {{ data.robot_states[r][0] }}, {{ data.robot_states[r][1] }} ] Target: {{ data.goals[r] }}
        </template>
        <template v-else>
          Unknown State
        </template>
      </div>
    </div>

    <!-- <button @click="fetch">Fetch Data</button>
    <button @click="forceCalculate">Force Calculate</button> -->
  </div>

</template>

<style scoped>

.map{
  width: 30em;
  height: 30em;
  background-color: #ddd;
  position: relative;
  border-radius: 8px;
  margin-left: 1em;
}

.plan-preview {
  width: 30em;
  height: 30em;
  position: relative;
  border-radius: 8px;
  border: #000 solid 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-panel{
  margin-left: 1em;
  width: 30em;
  height: 30em;
  border: 1px solid #333;
  position: relative;
  border-radius: 8px;
  padding: 2em;
}


.gridpoint{
  width: 0.5em;
  height: 0.5em;
  background-color: #000;
  border-radius: 50%;
  position: absolute;
}

.robot{
  width: 1rem;
  height: 1rem;
  margin-left: -0.4em;
  margin-top: -0.4em;
  z-index: 2;
  background-color: red;
  border-radius: 50%;
  position: absolute;
  font-size: 10px;
  text-align: center;
  font-weight: 900;
}

.trace{
  width: 0.3em;
  height: 0.3em;
  background-color: red;
  border-radius: 50%;
  position: absolute;
}

.obstacle{
  width: 3em;
  height: 3em;
  margin-left: -1.3em;
  margin-top: -1.3em;
  background-color: black;
  position: absolute;
}



header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
