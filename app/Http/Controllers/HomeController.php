<?php

namespace App\Http\Controllers;

use App\Models\Product\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(Request $request) {
        $data = [];
        $products = Product::all();

        if ($request->user()) {
            $data['products'] = $products;
        } else {
            $data['canRegister'] = Features::enabled(
                Features::registration()
            );
        }

        return Inertia::render('welcome', $data);
    }
}
