<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    use ApiResponse;

    public function stats()
    {
        return $this->successResponse([
            'total_users' => User::count(),
            'total_jobs' => JobListing::count(),
            'total_applications' => Application::count(),
            'total_companies' => Company::count(),
        ]);
    }

    public function users()
    {
        $users = User::latest()->paginate(20);
        return $this->successResponse($users);
    }

    public function deleteUser($id)
    {
        if ($id == auth()->id()) {
            return $this->errorResponse('Cannot delete your own account', null, 422);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }

    public function jobs()
    {
        $jobs = JobListing::with('company')->latest()->paginate(20);
        return $this->successResponse($jobs);
    }

    public function deleteJob($id)
    {
        $job = JobListing::findOrFail($id);
        $job->delete();
        return $this->successResponse(null, 'Job deleted successfully');
    }
}
