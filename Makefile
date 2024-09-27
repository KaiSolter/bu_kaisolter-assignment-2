install:
	@echo "Installing dependencies..."
	npm install
	npm install -D tailwindcss
	npx tailwindcss init
	@echo "All dependencies installed."

run:
	@echo "Starting the React app..."
	npm start
