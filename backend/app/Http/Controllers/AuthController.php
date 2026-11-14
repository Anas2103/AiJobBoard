<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:candidate,employer',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
        ]);

        $token = auth()->login($user);

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ], 'User registered successfully', 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', $validator->errors(), 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return $this->errorResponse('Invalid credentials', null, 401);
        }

        $user = auth()->user();
        if ($user->role === 'employer') {
            $user->load('company');
        }

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ], 'Login successful');
    }

    public function logout()
    {
        auth()->logout();
        return $this->successResponse(null, 'Logged out successfully');
    }

    public function me()
    {
        $user = auth()->user();
        if ($user->role === 'employer') {
            $user->load('company');
        }
        return $this->successResponse($user);
    }

    public function refresh()
    {
        $token = auth()->refresh();
        return $this->successResponse([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ], 'Token refreshed');
    }
}
