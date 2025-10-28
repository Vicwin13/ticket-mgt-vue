<script setup>
import Nav from './Nav.vue'
import Hero from './Hero.vue'
</script>

<template>
  <section>
    <Nav />
    <Hero />
    
    <div class="decorative-shapes">
      
      <svg class="shape circle-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#0066FF" opacity="0.1" />
        <circle cx="50" cy="50" r="30" fill="#0066FF" opacity="0.2" />
        <circle cx="50" cy="50" r="20" fill="#0066FF" opacity="0.3" />
      </svg>

      
      <svg class="shape triangle-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,10 90,90 10,90" fill="#0066FF" opacity="0.15" />
      </svg>

      
      <svg class="shape hexagon-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="#0066FF" opacity="0.12" />
      </svg>

      
      <svg class="shape square-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          fill="#0066FF"
          opacity="0.1"
          transform="rotate(45 50 50)"
        />
      </svg>

      
      <svg class="shape star-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="50,10 61,35 88,35 66,52 77,78 50,60 23,78 34,52 12,35 39,35"
          fill="#0066FF"
          opacity="0.2"
        />
      </svg>

      
      <svg class="shape blob-1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M40,40 Q60,20 80,40 T120,40 Q140,60 120,80 T120,120 Q100,140 80,120 T40,120 Q20,100 40,80 T40,40"
          fill="#0066FF"
          opacity="0.08"
        />
      </svg>
    </div>
  </section>
</template>

<style scoped>
section {
  min-height: calc(100vh - 60px); /* Subtract footer height */
  background: url("../assets/bg.svg");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.decorative-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  top: 10%;
  left: 10%;
  width: 120px;
  height: 120px;
  animation-delay: 0s;
}

.triangle-1 {
  top: 20%;
  right: 15%;
  width: 100px;
  height: 100px;
  animation-delay: 1s;
}

.hexagon-1 {
  bottom: 30%;
  left: 20%;
  width: 80px;
  height: 80px;
  animation-delay: 2s;
}

.square-1 {
  top: 60%;
  right: 10%;
  width: 90px;
  height: 90px;
  animation-delay: 3s;
}

.star-1 {
  bottom: 20%;
  right: 25%;
  width: 110px;
  height: 110px;
  animation-delay: 4s;
}

.blob-1 {
  top: 40%;
  left: 50%;
  width: 150px;
  height: 150px;
  animation-delay: 5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Additional subtle animations for different shapes */
.triangle-1 {
  animation: floatTriangle 8s ease-in-out infinite;
}

@keyframes floatTriangle {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-30px) rotate(120deg) scale(1.1);
  }
}

.hexagon-1 {
  animation: floatHexagon 7s ease-in-out infinite;
}

@keyframes floatHexagon {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-15px) rotate(60deg);
  }
  66% {
    transform: translateY(15px) rotate(120deg);
  }
}

.blob-1 {
  animation: floatBlob 10s ease-in-out infinite;
}

@keyframes floatBlob {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  25% {
    transform: translateY(-10px) scale(1.05);
  }
  50% {
    transform: translateY(0px) scale(1.1);
  }
  75% {
    transform: translateY(10px) scale(1.05);
  }
}

/* Ensure content stays above decorative shapes */
Nav,
Hero {
  position: relative;
  z-index: 2;
}
</style>
