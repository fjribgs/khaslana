<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

use App\Models\Category;
use App\Models\Product\Product;
use App\Models\UMKM\Umkm;
use App\Models\Review\Review;

class CatalogController extends Controller
{
    public function index() {
        $products = Product::with([
            'category',
            'promo',
            'productImages',
            'productVariants.attributeValues.attribute',
            'umkm',
            'umkm.city',
        ])
        ->withAvg('reviews as product_rating', 'rating')
        ->latest()
        ->paginate(12);
        $categories = Category::all();

        return Inertia::render('user/catalog', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function show($id) {
        $product = Product::where('id', $id)->with([
            'category',
            'promo',
            'productImages',
            'productVariants.attributeValues.attribute',
            'orderItems.order',
            'umkm',
            'umkm.city',
            'reviews' => function($query) {
                $userId = Auth::id();
                $query->withCount('reviewLikes');

                if (Auth::check()) {
                    $query->orderByRaw(
                        'CASE WHEN user_id = ? THEN 0 ELSE 1 END',
                        [$userId]
                    );
                }
                
                $query
                    ->orderByDesc('review_likes_count')
                    ->latest();
            },
            'reviews.user',
            'reviews.reviewLikes'
        ])
        ->withAvg('reviews as product_rating', 'rating')
        ->firstOrFail();

        $product->reviews->each(function ($review) {
            $review->is_liked = Auth::check()
                && $review->reviewLikes->contains('user_id', Auth::id());
        });

        return Inertia::render('user/catalog/detail', [
            'product' => $product,
            'pageType' => 'catalogDetail',
        ]);
    }

    public function storeReview(Request $request, $id) {
        $request->validate([
            'comment' => 'required|string|max:1000',
            'rating' => 'required|numeric|min:1|max:5'
        ]);

        $product = Product::findOrFail($id);

        $review = Review::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'umkm_id' => $product->umkm_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $this->updateUmkmAverageRating($review->umkm_id);

        return redirect()->back();
    }

    public function deleteReview(Review $review) {
        if ($review->user_id !== Auth::id()) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus ulasan ini!']);
        }

        try {
            $review->delete();

            return redirect()->back()->with('message', 'Ulasan berhasil dihapus!');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus ulasan: ' . $e->getMessage()]);
        }
    }

    public function likeReview(Review $review) {
        $userId = Auth::id();
        $existingLike = $review->reviewLikes()->where('user_id', $userId)->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            $review->reviewLikes()->create([
                'user_id' => $userId,
            ]);
        }
    }

    private function updateUmkmAverageRating(int $umkmId): void {
        $average = Review::where('umkm_id', $umkmId)
            ->avg('rating') ?? 0;

        Umkm::where('id', $umkmId)->update([
            'average_rating' => round($average, 1),
        ]);
    }
}
