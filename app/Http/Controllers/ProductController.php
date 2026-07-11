<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use App\Models\Category;
use App\Models\Promo;
use App\Models\Product\Product;
use App\Models\Product\Attribute;
use App\Models\Product\AttributeValue;
use App\Models\Product\ProductVariant;
use App\Models\Product\ProductImage;
use App\Models\Product\VariantAttribute;

class ProductController extends Controller
{
    public function index() {
        $products = collect();
        $categories = collect();
        $user = Auth::user();

        if (!$user->is_umkm) {
            return Inertia::render('umkm/product', [
                'products' => null,
                'categories' => [],
            ]);
        }

        if($user->is_umkm) {
            $umkm = $user->umkm;
    
            $products = Product::where('umkm_id', $umkm->id)->with([
                'category',
                'promo',
                'productImages',
                'productVariants',
                'productVariants.attributeValues',
                'productVariants.attributeValues.attribute',
                'umkm',
                'umkm.city',
            ])
            ->withSum('orderItems as sold_count', 'quantity')
            ->latest()
            ->paginate(20);
            $categories = Category::all();
        }

        return Inertia::render('umkm/product', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create() {
        $categories = Category::all();
        $promos = Promo::where('umkm_id', Auth::user()->umkm->id)->get();

        return Inertia::render('umkm/product/product-create', [
            'categories' => $categories,
            'promos' => $promos,
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'promo_id' => ['nullable'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'images' => ['required', 'array'],
            'images.*' => ['image', 'max:1024'],
            'attributes' => ['required', 'array'],
            'attributes.*.name' => ['required', 'string'],
            'attributes.*.values' => ['required', 'array'],
            'attributes.*.values.*' => ['required', 'string'],
            'variants' => ['required', 'array'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],
            'variants.*.attributes' => ['required', 'array'],
        ]);

        DB::beginTransaction();
        $imagePaths = [];

        try {
            $umkm = Auth::user()->umkm;
            $promoId = ($validated['promo_id'] === 'none' || empty($validated['promo_id'])) ? null : $validated['promo_id'];
            $product = Product::create([
                'umkm_id' =>Auth::user()->umkm->id,
                'category_id' => $validated['category_id'],
                'promo_id' => $promoId,
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);

            // product images create
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $originalName = pathinfo(
                        $image->getClientOriginalName(),
                        PATHINFO_FILENAME
                    );
                    
                    $extension = $image->getClientOriginalExtension();
                    $fileName =
                        substr(Str::slug($originalName), 0, 70)
                        . '-'
                        . time()
                        . '-'
                        . uniqid()
                        . '.'
                        . $extension;

                    $path = $image->storeAs(
                        "products/{$umkm->id}", $fileName, 'public'
                    );

                    $imagePaths[] = $path;
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $path,
                    ]);
                }
            }

            // attribute and attribute value create
            $attributeMap = [];

            foreach ($validated['attributes'] as $attributeData) {
                $attribute = Attribute::create([
                    'name' => trim($attributeData['name']),
                ]);

                foreach ($attributeData['values'] as $value) {
                    $attributeValue = AttributeValue::create([
                        'attribute_id' => $attribute->id,
                        'value' => trim($value),
                    ]);
                    $attributeMap[trim($attribute->name)][trim($value)] = $attributeValue->id;
                }
            }

            // variants create
            foreach ($validated['variants'] as $variantData) {
                $variant = ProductVariant::create([
                    'product_id' => $product->id,
                    'price' => $variantData['price'],
                    'stock' => $variantData['stock'],
                ]);

                foreach ($variantData['attributes'] as $attribute) {
                    VariantAttribute::create([
                        'variant_id' => $variant->id,
                        'attribute_value_id' => $attributeMap[
                            trim($attribute['attribute'])
                        ][
                            trim($attribute['value'])
                        ],
                    ]);
                }
            }
            DB::commit();

            return redirect()->route('product')->with('success', 'Produk berhasil ditambahkan.');
        } catch (\Throwable $th) {
            DB::rollBack();

            foreach ($imagePaths as $path) {
                if (
                    Storage::disk('public')->exists($path)
                ) {
                    Storage::disk('public')->delete($path);
                }
            }
            return redirect()->back()->withErrors(['message' => $th->getMessage()]);
        }
    }

    public function show(Product $product) {
        $product->load([
            'category',
            'productImages',
            'productVariants.attributeValues.attribute',
            'promo',
        ]);

        return Inertia::render('umkm/product/product-show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product) {
        $product->load([
            'productImages',
            'productVariants.attributeValues.attribute',
        ]);

        $promos = Promo::where('umkm_id', Auth::user()->umkm->id)
        ->whereIn('status', ['BERLANGSUNG', 'SEGERA HADIR'])
        ->get();

        return Inertia::render('umkm/product/product-create', [
            'product' => $product,
            'categories' => Category::all(),
            'promos' => $promos,
        ]);
    }

    public function update(Request $request, Product $product) {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'promo_id' => ['nullable'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],

            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:1024'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['integer', 'exists:product_images,id'],

            'attributes' => ['required', 'array'],
            'attributes.*.name' => ['required', 'string'],
            'attributes.*.values' => ['required', 'array'],
            'attributes.*.values.*' => ['required', 'string'],

            'variants' => ['required', 'array'],
            'variants.*.price' => ['required', 'numeric'],
            'variants.*.stock' => ['required', 'integer'],
            'variants.*.attributes' => ['required', 'array'],
        ]);

        DB::beginTransaction();
        $newImagePaths = [];

        try {
            $umkm = Auth::user()->umkm;
            $promoId = ($validated['promo_id'] === 'none' || empty($validated['promo_id'])) ? null : $validated['promo_id'];

            $product->update([
                'category_id' => $validated['category_id'],
                'promo_id' => $promoId,
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);

            $keepImageIds = $validated['existing_images'] ?? [];
            $imagesToDelete = ProductImage::where('product_id', $product->id)
                ->whereNotIn('id', $keepImageIds)
                ->get();

            foreach ($imagesToDelete as $image) {
                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
                $image->delete();
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
                    $extension = $image->getClientOriginalExtension();

                    $fileName = substr(Str::slug($originalName), 0, 70)
                        . '-' . time()
                        . '-' . uniqid()
                        . '.' . $extension;

                    $path = $image->storeAs("products/{$umkm->id}", $fileName, 'public');
                    $newImagePaths[] = $path;

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $path,
                    ]);
                }
            }

            $currentAttributeIds = [];
            $currentValueIds = [];
            $attributeMap = [];

            foreach ($validated['attributes'] as $attributeData) {
                $attribute = Attribute::firstOrCreate([
                    'name' => trim($attributeData['name']),
                ]);
                $currentAttributeIds[] = $attribute->id;

                foreach ($attributeData['values'] as $value) {
                    $attributeValue = AttributeValue::firstOrCreate([
                        'attribute_id' => $attribute->id,
                        'value' => trim($value),
                    ]);
                    $currentValueIds[] = $attributeValue->id;
                    $attributeMap[trim($attribute->name)][trim($value)] = $attributeValue->id;
                }
            }

            $activeVariantIds = [];

            foreach ($validated['variants'] as $variantData) {
                $targetValueIds = [];
                foreach ($variantData['attributes'] as $attr) {
                    $targetValueIds[] = $attributeMap[trim($attr['attribute'])][trim($attr['value'])];
                }
                sort($targetValueIds);

                $existingVariant = ProductVariant::where('product_id', $product->id)
                    ->whereHas('variantAttributes', function($query) use ($targetValueIds) {
                        $query->whereIn('attribute_value_id', $targetValueIds);
                    }, '=', count($targetValueIds))
                    ->first();

                if ($existingVariant) {
                    $existingVariant->update([
                        'price' => $variantData['price'],
                        'stock' => $variantData['stock'],
                    ]);
                    $activeVariantIds[] = $existingVariant->id;
                } else {
                    $newVariant = ProductVariant::create([
                        'product_id' => $product->id,
                        'price' => $variantData['price'],
                        'stock' => $variantData['stock'],
                    ]);
                    $activeVariantIds[] = $newVariant->id;

                    foreach ($targetValueIds as $valueId) {
                        VariantAttribute::create([
                            'variant_id' => $newVariant->id,
                            'attribute_value_id' => $valueId,
                        ]);
                    }
                }
            }

            $oldVariantsToDelete = ProductVariant::where('product_id', $product->id)
                ->whereNotIn('id', $activeVariantIds)
                ->get();

            foreach ($oldVariantsToDelete as $oldVariant) {
                $hasBeenOrdered = DB::table('order_items')->where('variant_id', $oldVariant->id)->exists();

                if (!$hasBeenOrdered) {
                    VariantAttribute::where('variant_id', $oldVariant->id)->delete();
                    $oldVariant->delete();
                }
            }
            
            DB::commit();
            return redirect()->route('product')->with('success', 'Produk berhasil diperbarui.');
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error($th);
            throw $th;

            foreach (
                $newImagePaths as $path
            ) {
                if (
                    Storage::disk('public')->exists($path)
                ) {
                    Storage::disk('public')->delete($path);
                }
            }
            return back()->withErrors([
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function destroy($product_id) {
        $user = Auth::user();

        if (!$user->is_umkm) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses.');
        }

        $product = Product::where('id', $product_id)
                    ->where('umkm_id', $user->umkm->id)
                    ->first();

        if (!$product) {
            return redirect()->back()->with('error', 'Produk tidak ditemukan.');
        }

        $product->delete();
        return redirect()->route('product')->with('success', 'Produk berhasil dihapus.');
    }
}
