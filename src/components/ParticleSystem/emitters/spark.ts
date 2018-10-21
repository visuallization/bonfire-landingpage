export default {
	autoUpdate: true,
	alpha: {
		start: 1,
		end: 1
	},
	scale: {
		start: 0.1,
		end: 0.12,
		minimumScaleMultiplier: 1
	},
	color: {
		start: "#ffffff",
		end: "#00aaff"
	},
	speed: {
		start: 172,
		end: 50,
		minimumSpeedMultiplier: 0.001
	},
	acceleration: {
		x: 0,
		y: 0
	},
	maxSpeed: 0,
	startRotation: {
		min: 7,
		max: 360
	},
	noRotation: false,
	rotationSpeed: {
		min: 0,
		max: 0
	},
	lifetime: {
		min: 0.06,
		max: 0.15
	},
	blendMode: "normal",
	frequency: 0.001,
	emitterLifetime: -1,
	maxParticles: 500,
	pos: {
		x: 0,
		y: 0
	},
	addAtBack: false,
	spawnType: "circle",
	spawnCircle: {
		x: 0,
		y: 0,
		r: 0
	}
};