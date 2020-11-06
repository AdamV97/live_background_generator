let scene, camera, renderer, starGeo, stars, element, mainAnimation, mainRotation;

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

// function getBase64(file) {
//   var deferred = $.Deferred();

//   var reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = function () {
//     deferred.resolve(reader.result);
//     // return(reader.result);
//   };
//   reader.onerror = function (error) {
//     deferred.reject(error);
//     console.log('Error: ', error);
//   };

//   deferred.promise();
// }

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function mapValues(){
  return new Promise((resolve, reject) => {
    var inputs = $('.mainChange');
    var properties = {};

    for(let i = 0; i < inputs.length; i++){
      properties[inputs[i].name] = $(inputs[i]).val();
    }

    mainRotation = parseFloat(properties.rotation);

    if(properties.number_particles > 1000000){
      properties.number_particles = 1000000;
      $('#particle_number').val('1000000');
    }

    var file = document.querySelector('#upload_sprite').files[0];
    if(file === undefined){
      properties.upload_sprite = 'img/main_particle.png';
      return resolve(properties);
    }

    getBase64(file).then(function (data){
      properties.upload_sprite = data;
      return resolve(properties);
    });
  });
}

function initial_function(properties){
  scene =new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI/2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(element.offsetWidth, element.offsetHeight);
  element.appendChild(renderer.domElement);

  starGeo = new THREE.Geometry();
  for(let i = 0; i < properties.number_particles; i++){
    star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity =  parseFloat(properties.velocity);
    star.acceleration = parseFloat(properties.acceleration);
    starGeo.vertices.push(star);
  }

  let sprite = new THREE.TextureLoader().load(properties.upload_sprite);
  let starMaterial = new THREE.PointsMaterial({
    color: properties.color,
    size: properties.size,
    map: sprite,
    opacity: 1
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
  stars.rotation.y += mainRotation;
  renderer.render(scene,camera);
  mainAnimation = requestAnimationFrame(animate);
}

mapValues().then(function (data){
  initial_function(data);
});

$( ".mainChange" ).change(function() {
  reset();
  mapValues().then(function (data){
    initial_function(data);
  });
});