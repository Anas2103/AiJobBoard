<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id', 'user_id', 'cv_path', 'cover_letter',
        'ai_score', 'ai_feedback', 'status'
    ];

    public function job()
    {
        return $this->belongsTo(JobListing::class, 'job_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
