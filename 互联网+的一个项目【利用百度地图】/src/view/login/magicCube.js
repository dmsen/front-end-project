import * as THREE from "three";
import {
  Message
} from "iview";
var scene, camera, renderer, light, geometry, material, cube;
//主函数
export function magicCube(id) {
  var id = !!id ? id : 'id'
  try {
    initRender(id);
    initSenue();
    initLight();
    initCamera();
    initTri();
    animate();
  } catch (err) {
    console.log(err);
    Message.error("您的浏览器版本过低，可能会存在兼容问题");
  }
}

export function clearDON() {
    renderer.clear();
}
//定义场景
function initSenue() {
  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(0x050505, 2000, 3500)
}
//定义相机
function initCamera() {
  camera = new THREE.PerspectiveCamera(45, 1, 1, 100000);
  camera.position.set(0, 0, 1700);
  camera.up.x = 0;
  camera.up.y = 1;
  camera.up.z = 0;
  camera.lookAt(0, 0, 0);
}
//定义渲染器
function initRender(id) {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(710, 710);
  document.getElementById(id).appendChild(renderer.domElement);
  renderer.setClearColor(0xffffff, 1.0);
}
//定义灯光
function initLight() {
  light = new THREE.DirectionalLight(0xffffff, 1, 1);
  light.position.set(0, 0, 5000);
  scene.add(light);
}
//定义物体
function initObject() {
  geometry = new THREE.CubeGeometry(10, 10, 10);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    side: THREE.BackSide
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
//创建三角形
function initTri() {
  var num = 32000;
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(num * 3 * 3);
  var normals = new Float32Array(num * 3 * 3);
  var colors = new Float32Array(num * 3 * 3);
  var color = new THREE.Color();
  var n = 800,
    n2 = n / 2;
  var d = 12,
    d2 = d / 2;
  var pa = new THREE.Vector3();
  var pb = new THREE.Vector3();
  var pc = new THREE.Vector3();
  var cb = new THREE.Vector3();
  var ab = new THREE.Vector3();
  for (var i = 0; i < positions.length; i += 9) {
    var x = Math.random() * n - n2;
    var y = Math.random() * n - n2;
    var z = Math.random() * n - n2;

    var ax = x + Math.random() * d - d2;
    var ay = y + Math.random() * d - d2;
    var az = z + Math.random() * d - d2;

    var bx = x + Math.random() * d - d2;
    var by = y + Math.random() * d - d2;
    var bz = z + Math.random() * d - d2;

    var cx = x + Math.random() * d - d2;
    var cy = y + Math.random() * d - d2;
    var cz = z + Math.random() * d - d2;

    positions[i] = ax;
    positions[i + 1] = ay;
    positions[i + 2] = az;
    positions[i + 3] = bx;
    positions[i + 4] = by;
    positions[i + 5] = bz;
    positions[i + 6] = cx;
    positions[i + 7] = cy;
    positions[i + 8] = cz;

    pa.set(ax, ay, az);
    pb.set(bx, by, bz);
    pc.set(cx, cy, cz);

    cb.subVectors(pc, pb);
    ab.subVectors(pa, pb);
    cb.cross(ab);
    cb.normalize();

    var nx = cb.x;
    var ny = cb.y;
    var nz = cb.z;

    normals[i] = nx;
    normals[i + 1] = ny;
    normals[i + 2] = nz;

    normals[i + 3] = nx;
    normals[i + 4] = ny;
    normals[i + 5] = nz;

    normals[i + 6] = nx;
    normals[i + 7] = ny;
    normals[i + 8] = nz;

    var vx = x / n + 0.5;
    var vy = y / n + 0.5;
    var vz = z / n + 0.5;

    color.setRGB(vx, vy, vz);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;

    colors[i + 3] = color.r;
    colors[i + 4] = color.g;
    colors[i + 5] = color.b;

    colors[i + 6] = color.r;
    colors[i + 7] = color.g;
    colors[i + 8] = color.b;
  }
  geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();

  material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    specular: 0xffffff,
    shininess: 250,
    side: THREE.DoubleSide,
    vertexColors: THREE.VertexColors
  });

  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
//定义渲染
function animate() {
  renderer.clear();
  cube.rotation.x += 0.009;
  cube.rotation.y += 0.009;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}


