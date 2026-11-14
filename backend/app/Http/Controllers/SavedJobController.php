<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\SavedJob;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    use ApiResponse;

    public function toggle($jobId)
    {
        $job = JobListing::findOrFail($jobId);
        $userId = auth()->id();

        $saved = SavedJob::where('user_id', $userId)->where('job_id', $jobId)->first();

        if ($saved) {
            $saved->delete();
            return $this->successResponse(['saved' => false], 'Job removed from saved list');
        }

        SavedJob::create(['user_id' => $userId, 'job_id' => $jobId]);
        return $this->successResponse(['saved' => true], 'Job saved successfully');
    }

    public function index()
    {
        $savedJobs = SavedJob::with('job.company')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(15);

        return $this->successResponse($savedJobs);
    }
}
