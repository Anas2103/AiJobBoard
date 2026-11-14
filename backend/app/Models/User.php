<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'password', 'role', 'avatar'];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return ['password' => 'hashed'];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }
}
