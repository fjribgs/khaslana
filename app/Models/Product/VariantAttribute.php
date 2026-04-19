<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Model;

class VariantAttribute extends Model
{
    protected $table = 'variant_attribites';
    protected $fillable = [
        'variant_id',
        'attribute_value_id',
    ];

    public function variant() {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function attributeValue() {
        return $this->belongsTo(AttributeValue::class, 'attribute_value_id');
    }
}
