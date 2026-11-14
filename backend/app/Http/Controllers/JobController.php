<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = JobListing::with('company')->where('status', 'open');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('type')) {
            $types = is_array($request->type) ? $request->type : [$request->type];
            $query->whereIn('type', $types);
        }

        $jobs = $query->latest()->paginate(15);

        return $this->successResponse($jobs);
    }

    public function show($id)
    {
        $job = JobListing::with('company')
            ->withCount('applications')
            ->findOrFail($id);

        return $this->successResponse($job);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:5|max:255',
            'description' => 'required|string|min:20',
            'requirements' => 'required|string|min:10',
            'location' => 'required|string|max:255',
            'type' => 'required|in:full-time,part-time,remote,hybrid',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'status' => 'nullable|in:open,closed',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $company = auth()->user()->company;
        if (!$company) {
            return $this->errorResponse('Please create a company profile first', null, 422);
        }

        $job = JobListing::create([
            'company_id' => $company->id,
            'title' => $request->title,
            'description' => $request->description,
            'requirements' => $request->requirements,
            'location' => $request->location,
            'type' => $request->type,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'status' => $request->status ?? 'open',
        ]);

        return $this->successResponse($job->load('company'), 'Job created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $job = JobListing::findOrFail($id);
        $company = auth()->user()->company;

        if (!$company || $job->company_id !== $company->id) {
            return $this->errorResponse('Forbidden', null, 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|min:5|max:255',
            'description' => 'sometimes|string|min:20',
            'requirements' => 'sometimes|string|min:10',
            'location' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:full-time,part-time,remote,hybrid',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0',
            'status' => 'sometimes|in:open,closed',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $job->update($request->only([
            'title', 'description', 'requirements', 'location',
            'type', 'salary_min', 'salary_max', 'status'
        ]));

        return $this->successResponse($job->load('company'), 'Job updated successfully');
    }

    public function destroy($id)
    {
        $job = JobListing::findOrFail($id);
        $company = auth()->user()->company;

        if (!$company || $job->company_id !== $company->id) {
            return $this->errorResponse('Forbidden', null, 403);
        }

        $job->delete();
        return $this->successResponse(null, 'Job deleted successfully');
    }

    public function employerJobs()
    {
        $company = auth()->user()->company;
        if (!$company) {
            return $this->successResponse(['data' => [], 'total' => 0]);
        }

        $jobs = JobListing::where('company_id', $company->id)
            ->withCount('applications')
            ->latest()
            ->paginate(15);

        return $this->successResponse($jobs);
    }
}
