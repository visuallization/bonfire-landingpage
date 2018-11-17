export default {
	autoUpdate: true,
	alpha: {
		start: 1,
		end: 1
	},
	scale: {
		start: 0.08,
		end: 0.12,
		minimumScaleMultiplier: 1.5
	},
	color: {
		start: "#ffffff",
		end: "#4AD9D9"
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
		min: 0.4,
		max: 0.4
	},
	blendMode: "normal",
	frequency: 0.05,
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