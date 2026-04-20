<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\UMKM\Umkm;

class Wishlist extends Model
{
    protected $table = 'wishlists';
    protected $fillable = [
        'umkm_id',
        'user_id',
    ];

    public function umkm() {
        return $this->belongsTo(Umkm::class, 'umkm_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
