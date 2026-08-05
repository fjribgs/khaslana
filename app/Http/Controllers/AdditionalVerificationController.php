<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\UMKM\Umkm;
use App\Models\UMKM\UmkmData;
use Inertia\Inertia;

class AdditionalVerificationController extends Controller
{
    public function index() {
        $requestedUmkm = UmkmData::with([
            'umkm.user',
            'umkm.umkmImages',
            'umkm.umkmLocations',
        ])
        ->where('is_verified', 'PENDING')
        ->get();

        $umkm = Umkm::with([
            'user',
            'umkmData',
            'umkmImages',
            'umkmLocations',
        ])
        ->where('user_id', Auth::id())
        ->first();

        $storeCompletion = $this->checkStoreCompletion($umkm);

        $status = match ($umkm?->umkmData?->is_verified) {
            'PENDING' => 'pending',
            'VERIFIED' => 'verified',
            'REJECT' => 'rejected',
            default => 'not_submitted',
        };

        return Inertia::render('settings/verification', [
            'storeCompletion' => $storeCompletion,

            'verification' => [
                'verification_status' => $status,
                'umkm' => $umkm,
                'admin_review_note' => null,

                'owner_name' => $umkm?->umkmData?->owner_name,
                'nik' => $umkm?->umkmData?->nik,
                'npwp' => $umkm?->umkmData?->npwp,
                'nib' => $umkm?->umkmData?->nib,
                'file_path' => $umkm?->umkmData?->file_path
                ? Storage::url(
                    $umkm->umkmData->file_path
                )
                : null,
            ],
            'requestedUmkm' => $requestedUmkm,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'owner_name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16'],
            'npwp' => ['required', 'string', 'max:30'],
            'nib' => ['required', 'string', 'max:30'],
            'file_path' => ['required', 'image', 'max:1024'],
        ]);

        DB::beginTransaction();

        try {
            $umkm = Umkm::where(
                'user_id',
                Auth::id()
            )->firstOrFail();

            $oldDocument = $umkm->umkmData?->file_path;

            $documentPath = null;
            $hash = null;

            if ($request->hasFile('file_path')) {
                if (
                    $oldDocument &&
                    Storage::disk('public')->exists($oldDocument)
                ) {
                    Storage::disk('public')->delete($oldDocument);
                }

                $documentPath = $request
                    ->file('file_path')
                    ->store(
                        'umkm/verifications',
                        'public'
                    );

                $hash = hash_file(
                    'sha256',
                    storage_path(
                        'app/public/' . $documentPath
                    )
                );
            }

            UmkmData::updateOrCreate(
                [
                    'umkm_id' => $umkm->id,
                ],
                [
                    'nik' => $request->nik,
                    'npwp' => $request->npwp,
                    'nib' => $request->nib,
                    'file_path' => $documentPath,
                    'image_hash' => $hash,
                    'is_verified' => 'PENDING',
                ]
            );

            DB::commit();

            return back()->with(
                'success',
                'Verifikasi berhasil dikirim.'
            );
        } catch (\Throwable $e) {
            DB::rollBack();

            if ($documentPath) {
                Storage::disk('public')->delete($documentPath);
            }

            report($e);
            return back()->withErrors([
                'verification' => $e->getMessage(),
            ]);
        }
    }

    public function updateVerification(Request $request, UmkmData $umkmData) {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['VERIFIED', 'REJECT']),
            ],
        ]);

        $umkmData->update([
            'is_verified' => $validated['status'],
        ]);

        return back()->with([
            'success' => $validated['status'] === 'VERIFIED'
                ? 'Data UMKM berhasil diverifikasi!'
                : 'Data UMKM berhasil ditolak!',
        ]);
    }

    private function checkStoreCompletion(?Umkm $umkm): array {
        if (!$umkm) {
            return [
                'completed' => false,
                'missing' => [
                    'Informasi',
                    'Alamat',
                    'Operasional',
                    'Foto',
                ],
            ];
        }

        $missing = [];

        if (
            blank($umkm->store_name) ||
            blank($umkm->description) ||
            blank($umkm->phone_number) ||
            blank($umkm->type) ||
            blank($umkm->status)
        ) {
            $missing[] = 'Informasi';
        }

        if (
            blank($umkm->province_id) ||
            blank($umkm->city_id) ||
            blank($umkm->district_id) ||
            blank($umkm->village_id) ||
            blank($umkm->address) ||
            !$umkm->umkmLocations()->exists()
        ) {
            $missing[] = 'Alamat';
        }

        if (
            blank($umkm->open_days) ||
            blank($umkm->open_time) ||
            blank($umkm->close_time)
        ) {
            $missing[] = 'Operasional';
        }

        if (!$umkm->umkmImages()->exists()) {
            $missing[] = 'Foto';
        }

        return [
            'completed' => empty($missing),
            'missing' => $missing,
        ];
    }
}