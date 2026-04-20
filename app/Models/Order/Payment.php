<?php

namespace App\Models\Order;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    protected $fillable = [
        'order_id',
        'midtrans_order_id',
        'payment_type',
        'transaction_status',
        'fraud_status',
        'gross_amount',
        'snap_token',
        'raw_response',
        'paid_at',
    ];

    public function order() {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
