<?php

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class PostLike extends Model
{
    protected $table = 'post_likes';
    protected $fillable = [
        'post_id',
        'user_id',
    ];

    public function post() {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
