<?php

namespace App\Models\Cart;

use Illuminate\Database\Eloquent\Model;

use App\Models\Product\ProductVariant;

class CartItem extends Model
{
    protected $table = 'cart_items';
    protected $fillable = [
        'cart_id',
        'variant_id',
        'quantity'
    ];

    public function cart() {
        return $this->belongsTo(Cart::class, 'cart_id');
    }

    public function variant() {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
