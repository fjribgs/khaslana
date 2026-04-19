# 🚀 Khaslana

A modern full-stack web application built using Laravel, Inertia.js, and React.  
This project uses Pest as the testing framework and Vite for frontend asset bundling.

## 📦 Tech Stack

- **Backend:** Laravel
- **Frontend:** React (via Inertia.js)
- **Build Tool:** Vite
- **Database:** Mysql
- **Testing:** Pest

## 🛠 Installation Guide

Follow the steps below to set up the project locally.

### 1️⃣ Clone this Repository

```bash
git clone https://github.com/rafidhp/khaslana.git
cd khaslana
```

### 2️⃣ Copy Environment File

Create your `.env` file from the example file:

```bash
cp .env.example .env
```

Then configure your database and other environment variables inside the `.env` file.

### 3️⃣ Install Backend Dependencies

```bash
composer install
```

### 4️⃣ Install Frontend Dependencies

```bash
npm install
```

### 5️⃣ Generate Application Key

```bash
php artisan key:generate
```

### 6️⃣ Run Database Migration & Seeder

```bash
php artisan migrate --seed
```

Make sure your database has been created before running this command.

### 7️⃣ Activate Wayfinder
```bash
php artisan wayfinder:generate
```

## ▶️ Running the Project

You need to run both the backend and frontend development servers.

### Start Laravel Development Server

```bash
php artisan serve
```

The application will be available at:

```
http://127.0.0.1:8000
```

### Start Vite Development Server

```bash
npm run dev
```

## 🧪 Running Tests (Pest)

To run the test suite:

```bash
php artisan test
```

or

```bash
./vendor/bin/pest
```

## 📁 Project Structure Overview

```
app/
bootstrap/
config/
database/
public/
resources/
    js/
        pages/
        components/
        ...
routes/
storage/
tests/
...
```

## ⚙️ Requirements

- PHP 8.3 or higher
- Composer
- Node.js 20 or higher
- NPM
- MySQL / SQLite (or compatible database)

## 📌 Development Notes

- Ensure your `.env` configuration matches your local environment.
- Both `php artisan serve` and `npm run dev` must run simultaneously in development mode.
- If you encounter caching issues, try:

```bash
php artisan optimize:clear
```

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).
