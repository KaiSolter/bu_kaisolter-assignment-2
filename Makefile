install:
	@echo "Installing dependencies..."
	npm install
	npm install -D tailwindcss
	npm install react-chartjs-2 chart.js
	npx tailwindcss init
	@echo "All dependencies installed."

run:
	@echo "Starting the React app..."
	npm start
