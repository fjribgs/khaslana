<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UmkmController extends Controller
{
    public function index() {
        return Inertia::render('user/umkm');
    }

    public function detail() {
        return Inertia::render('user/umkm-user/detail-umkm/index');
    }

    public function umkmProducts() {
        return Inertia::render('user/umkm-user/umkm-products/index');
    }
}
