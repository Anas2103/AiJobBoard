<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessAiScore;
use App\Mail\ApplicationStatusUpdated;
use App\Models\Application;
use App\Models\JobListing;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    use ApiResponse;

    public function apply(Request $request, $jobId)
    {
        $job = JobListing::findOrFail($jobId);

        if ($job->status === 'closed') {
            return $this->errorResponse('This job is no longer accepting applications', null, 422);
        }

        $existing = Application::where('job_id', $jobId)
            ->where('user_id', auth()->id())
            ->first();

        if ($existing) {
            return $this->errorResponse('You have already applied for this job', null, 422);
        }

        $validator = Validator::make($request->all(), [
            'cv' => 'required|file|mimes:pdf,doc,docx|max:5120',
            'cover_letter' => 'nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $cvPath = $request->file('cv')->store('cvs', 'public');

        $application = Application::create([
            'job_id' => $jobId,
            'user_id' => auth()->id(),
            'cv_path' => $cvPath,
            'cover_letter' => $request->cover_letter,
            'status' => 'pending',
        ]);

        ProcessAiScore::dispatch($application);

        return $this->successResponse(
            $application->load('job.company'),
            'Application submitted successfully',
            201
        );
    }

    public function myApplications()
    {
        $applications = Application::with('job.company')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(15);

        return $this->successResponse($applications);
    }

    public function employerApplications($jobId)
    {
        $job = JobListing::findOrFail($jobId);
        $company = auth()->user()->company;

        if (!$company || $job->company_id !== $company->id) {
            return $this->errorResponse('Forbidden', null, 403);
        }

        $applications = Application::with('user')
            ->where('job_id', $jobId)
            ->latest()
            ->paginate(20);

        return $this->successResponse($applications);
    }

    public function updateStatus(Request $request, $applicationId)
    {
        $application = Application::with('job', 'user')->findOrFail($applicationId);
        $company = auth()->user()->company;

        if (!$company || $application->job->company_id !== $company->id) {
            return $this->errorResponse('Forbidden', null, 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:reviewed,accepted,rejected',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $application->update(['status' => $request->status]);

        try {
            Mail::to($application->user->email)->send(
                new ApplicationStatusUpdated($application)
            );
        } catch (\Exception $e) {
            // Mail failure should not block the status update
        }

        return $this->successResponse($application, 'Application status updated');
    }

    public function withdraw($id)
    {
        $application = Application::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        if ($application->status !== 'pending') {
            return $this->errorResponse('Only pending applications can be withdrawn', null, 422);
        }

        $application->delete();
        return $this->successResponse(null, 'Application withdrawn successfully');
    }
}
