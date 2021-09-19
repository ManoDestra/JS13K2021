window.addEventListener('load', async () => {
	const game = new Game();
	await game.init();
	game.start();
});
