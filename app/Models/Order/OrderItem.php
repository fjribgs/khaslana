<?php

namespace App\Models\Order;

use Illuminate\Database\Eloquent\Model;

use App\Models\Product\Product;
use App\Models\Product\ProductVariant;

class OrderItem extends Model
{
    protected $table = 'order_items';
    protected $fillable = [
        'order_id',
        'product_id',
        'variant_id',
        'product_name',
        'variant_detail',
        'price',
        'quantity',
        'subtotal',
    ];

    public function order() {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function variant() {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
