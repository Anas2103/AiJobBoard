<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'description', 'requirements',
        'location', 'type', 'salary_min', 'salary_max', 'status'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id');
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class, 'job_id');
    }
}
