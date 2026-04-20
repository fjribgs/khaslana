<?php

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class CommentLike extends Model
{
    protected $table = 'comment_likes';
    protected $fillable = [
        'comment_id',
        'user_id',
    ];

    public function comment() {
        return $this->belongsTo(Comment::class, 'comment_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}
