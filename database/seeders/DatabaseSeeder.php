<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Laravolt\Indonesia\Seeds\DatabaseSeeder as IndonesiaSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if(app()->environment('production')) {
            User::firstOrCreate([
                'name' => 'Khaslana Superadmin',
                'username' => 'superadmin',
                'email' => 'superadmin@khaslana.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'superadmin' => true,
            ]);

            User::create([
                'name' => 'Fajri Bagas',
                'username' => 'fajribagas',
                'email' => 'fajribagas@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'is_umkm' => true,
            ]);

            $this->call([
                IndonesiaSeeder::class,
                CategorySeeder::class,
                UmkmSeeder::class,
                // AttributeSeeder::class,
                // ProductSeeder::class,
            ]);

            User::where('username', 'superadmin')->update(['is_umkm' => true]);
        } else {
            User::factory()->create([
                'name' => 'Test User',
                'username' => 'test',
                'email' => 'test@example.com',
            ]);

            User::create([
                'name' => 'Fajri Bagas',
                'username' => 'fajribagas',
                'email' => 'fajribagas@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'is_umkm' => true,
            ]);

            $this->call([
                IndonesiaSeeder::class,
                CategorySeeder::class,
                UmkmSeeder::class,
                AttributeSeeder::class,
                ProductSeeder::class,
            ]);

            User::firstOrCreate([
                'name' => 'Khaslana Superadmin',
                'username' => 'superadmin',
                'email' => 'superadmin@khaslana.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'superadmin' => true,
                'is_umkm' => true,
            ]);
        }
    }
}
