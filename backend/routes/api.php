<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\SavedJobController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// Public job routes
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);

// Authenticated routes
Route::middleware('auth:api')->group(function () {
    // Company routes (employer)
    Route::middleware('role:employer')->group(function () {
        Route::post('/company', [CompanyController::class, 'store']);
        Route::put('/company', [CompanyController::class, 'update']);
        Route::get('/company', [CompanyController::class, 'show']);

        // Employer job management
        Route::post('/jobs', [JobController::class, 'store']);
        Route::put('/jobs/{id}', [JobController::class, 'update']);
        Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
        Route::get('/employer/jobs', [JobController::class, 'employerJobs']);
        Route::get('/employer/applications/{jobId}', [ApplicationController::class, 'employerApplications']);
        Route::put('/employer/applications/{application}/status', [ApplicationController::class, 'updateStatus']);
    });

    // Candidate routes
    Route::middleware('role:candidate')->group(function () {
        Route::post('/jobs/{job}/apply', [ApplicationController::class, 'apply']);
        Route::get('/applications', [ApplicationController::class, 'myApplications']);
        Route::delete('/applications/{id}', [ApplicationController::class, 'withdraw']);

        Route::post('/jobs/{job}/save', [SavedJobController::class, 'toggle']);
        Route::get('/saved-jobs', [SavedJobController::class, 'index']);
    });

    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/jobs', [AdminController::class, 'jobs']);
        Route::delete('/jobs/{id}', [AdminController::class, 'deleteJob']);
    });
});
