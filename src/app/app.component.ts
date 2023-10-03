import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private loader = new GLTFLoader();
  currentModelID: number;
  scrollY: number;

  modelArray: any[] = [];
  currentModelIndex: number;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.initScene();
    this.preloadModels();
    this.animate();
  }

  preloadModels() {
    this.loader.load('assets/objeto.glb', (result) => {
      this.modelArray[0] = result.scene; this.displayModel(0)
      result.scene.rotation.y = Math.PI / 2;
    });
    this.loader.load('assets/reffer.glb', (result) => {
      this.modelArray[1] = result.scene;
      result.scene.rotation.y = Math.PI / 2;
    });
  }
  
  displayModel(index: number){
    console.log(index);
    console.log(this.currentModelIndex);
    
    if( index != this.currentModelIndex ) {
      this.renderer.domElement.classList.remove('fade-in');
      this.renderer.domElement.classList.add('fade-out');
  
      this.modelArray.forEach( model => {
        this.scene.remove(model);
      } );
  
      
      setTimeout(() => {
        this.renderer.domElement.classList.remove('fade-out');
        this.renderer.domElement.classList.add('fade-in');
        
        this.scene.add(this.modelArray[index]);
        this.currentModelIndex = index;
        
        this.scene.background = null;
      
        if(index === 1) {
          this.camera.position.z = 8.3;
          this.camera.position.y = 1.5;
          this.camera.position.x = -0.7;
        } else {
          this.camera.position.z = 4;
          this.camera.position.y = 0;
          this.camera.position.x = 0;
        }
      }, 50);
    }

  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(1,1,1);
    this.renderer = new THREE.WebGLRenderer( { alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.style.position = "fixed";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
    this.renderer.domElement.style.opacity = "1";
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setClearColor( 0xff0000, 0 );

    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(3, 0, 5);
    this.scene.add(directionalLight);

    directionalLight2.position.set(-3, 0, 5);
    this.scene.add(directionalLight2);

    directionalLight3.position.set(0, -3, 5);
    this.scene.add(directionalLight3);

    directionalLight4.position.set(0, 3, 5);
    this.scene.add(directionalLight4);

    // Posiciona la cámara
    this.camera.position.z = 4;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
    
  }

  private animate(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };    
    animate();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.scrollY = window.scrollY;
    
    const scrollPercent =
      ((document.documentElement.scrollTop || document.body.scrollTop) /
          ((document.documentElement.scrollHeight ||
              document.body.scrollHeight) -
              document.documentElement.clientHeight)) *
      100;
    const rotationFactor = 0.005;
    this.scene.rotation.y = (scrollPercent * 3) * (rotationFactor * 3);

    if( scrollPercent < 35 ) {
      this.renderer.domElement.style.left = `${scrollPercent}%`;
      this.displayModel(0);

    } else if( scrollPercent >= 35 && scrollPercent <= 75  ) { 
      this.renderer.domElement.style.left = `${35 - (scrollPercent - 35)}%`;
      this.displayModel(1);
    }
  
  
    console.log(scrollPercent);
  }

}
