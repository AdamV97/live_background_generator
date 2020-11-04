let scene, camera, renderer, starGeo, stars, element, mainAnimation;

element = document.getElementById('preview');

function reset(){
scene = '';
camera = '';
renderer = '';
starGeo = '';
stars = '';
element.innerHTML = '';
cancelAnimationFrame(mainAnimation);
}

function mapValues(){
  
}

function initial_function(color, size){

  if(color === undefined){
    color = '#fffff';
  }else if(size === undefined){
    size = 0.7;
  };

  scene =new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI/2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(element.offsetWidth, element.offsetHeight);
  element.appendChild(renderer.domElement);

  starGeo = new THREE.Geometry();
  for(let i = 0; i<10000; i++){
    star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.005;
    starGeo.vertices.push(star);
  }

  let sprite = new THREE.TextureLoader().load('img/main_particle.png');
  let starMaterial = new THREE.PointsMaterial({
    color: color,
    size: size,
    map: sprite
  });

  stars = new THREE.Points(starGeo,starMaterial);
  scene.add(stars);
  animate();
}

function animate(){
  starGeo.vertices.forEach(p => {
    p.velocity += p.acceleration;
    p.y -= p.velocity;

    if(p.y <-200){
      p.y = 200;
      p.velocity = 0;
    }
  });
  starGeo.verticesNeedUpdate = true;
  stars.rotation.y += 0.002;
  renderer.render(scene,camera);
  mainAnimation = requestAnimationFrame(animate);
}

initial_function();


// EVENTS

$( ".mainChange" ).change(function(e) {
  console.log($('#sprite_size').val());
  reset();
  initial_function();
});