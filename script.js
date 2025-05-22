document.addEventListener('DOMContentLoaded', () => {
	const notebookSpreadImage = document.getElementById('notebookSpreadImage');
	const prevArea = document.getElementById('prevArea');
	const nextArea = document.getElementById('nextArea');
	const goToStartBtn = document.getElementById('goToStartBtn');
	const goToEndBtn = document.getElementById('goToEndBtn');
	const introTextOverlay = document.getElementById('introTextOverlay');
	const outroTextOverlay = document.getElementById('outroTextOverlay');

	const spreadImages = [
		"images/spread-01.png", "images/spread-02.png", "images/spread-03.png",
		"images/spread-04.png", "images/spread-05.png", "images/spread-06.png",
		"images/spread-07.png", "images/spread-08.png", "images/spread-09.png",
		"images/spread-10.png", "images/spread-11.png", "images/spread-12.png",
		"images/spread-13.png", "images/spread-14.png", "images/spread-15.png",
		"images/spread-16.png", "images/spread-17.png", "images/spread-18.png",
		"images/spread-19.png", "images/spread-20.png", "images/spread-21.png",
		"images/spread-22.png", "images/spread-23.png", "images/spread-24.png",
		"images/spread-25.png", "images/spread-26.png", "images/spread-27.png",
		"images/spread-28.png", "images/spread-29.png", "images/spread-30.png",
		"images/spread-31.png", "images/spread-32.png", "images/spread-33.png",
		"images/spread-34.png", "images/spread-35.png", "images/spread-36.png",
		"images/spread-37.png", "images/spread-38.png", "images/spread-39.png",
		"images/spread-40.png", "images/spread-41.png", "images/spread-42.png",
		"images/spread-43.png", "images/spread-44.png", "images/spread-45.png",
		"images/spread-46.png", "images/spread-47.png", "images/spread-48.png",
		"images/spread-49.png", "images/spread-50.png", "images/spread-51.png",
		"images/spread-52.png", "images/spread-53.png", "images/spread-54.png",
		"images/spread-55.png", "images/spread-56.png", "images/spread-57.png",
		"images/spread-58.png", "images/spread-59.png", "images/spread-60.png",
		"images/spread-61.png", "images/spread-62.png",
	];

	let currentSpreadIndex = 0;

	function updateDisplay() {
		if (spreadImages.length === 0) {
			console.error("Image configuration missing: spreadImages array is empty.");
			if (document.querySelector('.notebook-container')) { // Check if container exists
				document.querySelector('.notebook-container').innerHTML = "<p>Portfolio images not configured.</p>";
			}
			return;
		}

		notebookSpreadImage.src = spreadImages[currentSpreadIndex];
		notebookSpreadImage.alt = `Portfolio spread ${currentSpreadIndex + 1}`;

		introTextOverlay.style.display = (currentSpreadIndex === 0) ? 'block' : 'none';
		outroTextOverlay.style.display = (currentSpreadIndex === spreadImages.length - 1) ? 'block' : 'none';

		updateButtonStates();
	}

	function updateButtonStates() {
		const canGoPrev = currentSpreadIndex > 0;
		goToStartBtn.disabled = !canGoPrev;
		// Check if prevArea exists before trying to set its style
		if (prevArea) {
			prevArea.style.pointerEvents = canGoPrev ? 'auto' : 'none';
			prevArea.style.opacity = canGoPrev ? '1' : '0.5';
		}

		const canGoNext = currentSpreadIndex < spreadImages.length - 1;
		goToEndBtn.disabled = !canGoNext;
		// Check if nextArea exists
		if (nextArea) {
			nextArea.style.pointerEvents = canGoNext ? 'auto' : 'none';
			nextArea.style.opacity = canGoNext ? '1' : '0.5';
		}
	}

	// --- NAVIGATION FUNCTIONS ---
	function goToNextSpread() {
		if (currentSpreadIndex < spreadImages.length - 1) {
			currentSpreadIndex++;
			updateDisplay();
		}
	}

	function goToPrevSpread() {
		if (currentSpreadIndex > 0) {
			currentSpreadIndex--;
			updateDisplay();
		}
	}
	// --------------------------


	// --- CLICK EVENT LISTENERS ---
	// Check if elements exist before adding listeners (good practice)
	if (nextArea) {
		nextArea.addEventListener('click', goToNextSpread);
	}
	if (prevArea) {
		prevArea.addEventListener('click', goToPrevSpread);
	}

	goToStartBtn.addEventListener('click', () => {
		currentSpreadIndex = 0;
		updateDisplay();
	});

	goToEndBtn.addEventListener('click', () => {
		currentSpreadIndex = spreadImages.length - 1;
		updateDisplay();
	});
	// ---------------------------


	// --- KEYBOARD NAVIGATION ---
	document.addEventListener('keydown', (event) => {
		// No need to check for activeElement if there are no input fields
		switch (event.key) {
			case 'ArrowRight':
				goToNextSpread();
				break;
			case 'ArrowLeft':
				goToPrevSpread();
				break;
			case 'Home':
				event.preventDefault(); // Prevent default scroll
				currentSpreadIndex = 0;
				updateDisplay();
				break;
			case 'End':
				event.preventDefault(); // Prevent default scroll
				currentSpreadIndex = spreadImages.length - 1;
				updateDisplay();
				break;
		}
	});
	// ---------------------------


	// Initial Load
	if (spreadImages.length > 0) {
		updateDisplay();
	} else {
		console.error("Portfolio cannot be loaded: No images configured.");
		if (document.querySelector('.notebook-container')) {
			document.querySelector('.notebook-container').innerHTML = "<p>Sorry, the portfolio is currently unavailable.</p>";
		}
	}
});
