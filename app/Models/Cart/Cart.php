<?php

namespace App\Models\Cart;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class Cart extends Model
{
    protected $table = 'carts';
    protected $fillable = [
        'user_id',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function cartItems() {
        return $this->hasMany(CartItem::class);
    }
}
