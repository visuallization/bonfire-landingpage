export default  {
  autoUpdate: true,
  alpha: {
    start: 0.8,
    end: 0.15
  },
  scale: {
    start: 0.3,
    end: 0.1,
    minimumScaleMultiplier: 1
  },
  color: {
    list: [
      { value: "67A5EF", time: 0 },
      { value: "5EE8FF", time: 0.33 },
      { value: "99F1FF", time: 0.66 },
      { value: "CEF8FF", time: 1 },
    ],
    isStepped: false
  },
  speed: {
    start: 0,
    end: 0,
    minimumSpeedMultiplier: 1
  },
  acceleration: {
    x: 0,
    y: 0
  },
  maxSpeed: 0,
  startRotation: {
    min: 0,
    max: 0
  },
  noRotation: true,
  rotationSpeed: {
    min: 0,
    max: 0
  },
  lifetime: {
    min: 0.6,
    max: 0.6
  },  
  blendMode: "normal",
  frequency: 0.0002,
  emitterLifetime: -1,
  maxParticles: 7000,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "point"
};