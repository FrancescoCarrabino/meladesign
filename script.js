document.addEventListener('DOMContentLoaded', () => {
	const notebookSpreadImage = document.getElementById('notebookSpreadImage');
	const prevArea = document.getElementById('prevArea');
	const nextArea = document.getElementById('nextArea');
	const goToStartBtn = document.getElementById('goToStartBtn');
	const goToEndBtn = document.getElementById('goToEndBtn');
	const introTextOverlay = document.getElementById('introTextOverlay');
	const outroTextOverlay = document.getElementById('outroTextOverlay');

	// --- CONFIGURATION: YOUR SPREAD IMAGES ---
	// Add the paths to your SPREAD images here, IN ORDER.
	// Paths are relative to index.html (e.g., "images/my-spread.jpg")
	const spreadImages = [
		"images/spread-01.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-02.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-03.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-04.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-05.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-06.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-07.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-08.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-09.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-10.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-11.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-12.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-13.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-14.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-15.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-16.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-17.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-18.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-19.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-20.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-21.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-22.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-23.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-24.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-25.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-26.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-27.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-28.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-29.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-30.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-31.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-32.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-33.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-34.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-35.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-36.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-37.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-38.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-39.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-40.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-41.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-42.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-43.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-44.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-45.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-46.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-47.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-48.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-49.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-50.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-51.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-52.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-53.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-54.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-55.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-56.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-57.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-58.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-59.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-60.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-61.jpg", // Example: Your "Hello I'm Manuela" spread
		"images/spread-62.jpg", // Example: Your "Hello I'm Manuela" spread
	];
	// ----------------------------------

	let currentSpreadIndex = 0;

	function updateDisplay() {
		if (spreadImages.length === 0) {
			console.error("Image configuration missing: spreadImages array is empty.");
			document.querySelector('.notebook-container').innerHTML = "<p>Portfolio images not configured.</p>";
			return;
		}

		notebookSpreadImage.src = spreadImages[currentSpreadIndex];
		notebookSpreadImage.alt = `Portfolio spread ${currentSpreadIndex + 1}`;

		// --- SHOW/HIDE INTRO TEXT ---
		if (currentSpreadIndex === 0) {
			introTextOverlay.style.display = 'block'; // Or 'flex' if its internal children need flex
		} else {
			introTextOverlay.style.display = 'none';
		}
		// -----------------------------
		//
		if (currentSpreadIndex === spreadImages.length - 1) { // Check if it's the last spread
			outroTextOverlay.style.display = 'block';
		} else {
			outroTextOverlay.style.display = 'none';
		}
		// ---------------------------

		updateButtonStates();
	}

	function updateButtonStates() {
		const canGoPrev = currentSpreadIndex > 0;
		goToStartBtn.disabled = !canGoPrev;
		prevArea.style.pointerEvents = canGoPrev ? 'auto' : 'none';
		prevArea.style.opacity = canGoPrev ? '1' : '0.5'; // Visual feedback

		const canGoNext = currentSpreadIndex < spreadImages.length - 1;
		goToEndBtn.disabled = !canGoNext;
		nextArea.style.pointerEvents = canGoNext ? 'auto' : 'none';
		nextArea.style.opacity = canGoNext ? '1' : '0.5'; // Visual feedback
	}

	nextArea.addEventListener('click', () => {
		if (currentSpreadIndex < spreadImages.length - 1) {
			currentSpreadIndex++;
			updateDisplay();
		}
	});

	prevArea.addEventListener('click', () => {
		if (currentSpreadIndex > 0) {
			currentSpreadIndex--;
			updateDisplay();
		}
	});

	goToStartBtn.addEventListener('click', () => {
		currentSpreadIndex = 0;
		updateDisplay();
	});

	goToEndBtn.addEventListener('click', () => {
		currentSpreadIndex = spreadImages.length - 1;
		updateDisplay();
	});

	// Initial Load
	if (spreadImages.length > 0) {
		updateDisplay();
	} else {
		console.error("Portfolio cannot be loaded: No images configured.");
		document.querySelector('.notebook-container').innerHTML = "<p>Sorry, the portfolio is currently unavailable.</p>";
	}
});
