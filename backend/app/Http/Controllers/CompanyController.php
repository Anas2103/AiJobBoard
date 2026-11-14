<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    use ApiResponse;

    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->company) {
            return $this->errorResponse('You already have a company profile', null, 422);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'website' => 'nullable|url',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        $company = Company::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'location' => $request->location,
            'website' => $request->website,
            'logo' => $logoPath,
        ]);

        return $this->successResponse($company, 'Company created successfully', 201);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $company = $user->company;

        if (!$company) {
            return $this->errorResponse('Company not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'website' => 'nullable|url',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        if ($request->hasFile('logo')) {
            $company->logo = $request->file('logo')->store('logos', 'public');
        }

        $company->update($request->only(['name', 'description', 'location', 'website']));

        return $this->successResponse($company, 'Company updated successfully');
    }

    public function show()
    {
        $company = auth()->user()->company;

        if (!$company) {
            return $this->errorResponse('Company not found', null, 404);
        }

        return $this->successResponse($company);
    }
}
