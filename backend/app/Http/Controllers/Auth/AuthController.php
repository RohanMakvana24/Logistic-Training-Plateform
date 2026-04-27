<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /** Login API Controller */
    public function LoginController(Request $request)
    {
        try {
            $request->validate([
                "email" => "required|email",
                "password" => "required|min:6"
            ]);

            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "Invalid Credentials"
                ], 403);
            }

            $isPassword = Hash::check($request->password, $user['password']);
            if (!$isPassword) {
                return response()->json([
                    "success" => false,
                    "message" => "Invalid Credentials"
                ], 403);
            }
            $accessToken = $user->createToken('access-token', ['*'], now()->addHours(2))->plainTextToken;
            $refreshToken = $user->createToken('refresh-token', ['refresh'], now()->addDay(7))->plainTextToken;
            $user->last_login_at = now();
            $user->save();
            return response()->json([
                "success" => true,
                "message" => "Login Successfull",
                "accessToken" => $accessToken,
                "refreshToken" => $refreshToken,
                "user" => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "errors" => $e->getTrace(),
                "message" => $e->getMessage(),
            ], 500);
        }
    }

    /** Logout Controller */
    public function LogoutController(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
            return response()->json([
                "success" => true,
                "message" => "Logout Successfull",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "errors" => $e->getTrace(),
                "message" => $e->getMessage(),
            ]);
        }
    }

    public function refresh(Request $request)
    {
        $request->validate([
            'refresh_token' => 'required'
        ]);

        $token = PersonalAccessToken::findToken($request->refresh_token);

        if (!$token) {
            return response()->json([
                'message' => 'Invalid refresh token'
            ], 401);
        }

        if (!$token->can('refresh')) {
            return response()->json([
                'message' => 'Token is not allowed to refresh'
            ], 403);
        }

        if ($token->expires_at && $token->expires_at->isPast()) {
            $token->delete();

            return response()->json([
                'message' => 'Refresh token expired'
            ], 401);
        }

        $user = $token->tokenable;

        $user->tokens()
            ->where('name', 'access-token')
            ->delete();

        $accessToken = $user->createToken(
            'access-token',
            ['*'],
            now()->addMinutes(15)
        )->plainTextToken;

        return response()->json([
            'accessToken' => $accessToken
        ]);
    }

    /** Fresher Login Controller */
    public function loginFresher(Request $request)
    {
        try {
            /** Validation */
            $request->validate([
                "password" => "required"
            ]);

            /** URL Validation */
            if (!$request->hasValidSignature()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired login link'
                ], 403);
            }
            $userId = $request->user;
            $user = User::find($userId);
            if (!$user || $user->login_used) {
                return response()->json([
                    "success" => false,
                    "message" => "Link already used or invalid"
                ], 403);
            }
            $user->login_used = true;
            $user->password = Hash::make($request->password);
            $user->save();
            $accessToken = $user->createToken('access-token', ['*'], now()->addHours(2))->plainTextToken;
            $refreshToken = $user->createToken('refresh-token', ['refresh'], now()->addDay(7))->plainTextToken;
            return response()->json([
                "success" => true,
                "message" => "Login Successfull",
                "accessToken" => $accessToken,
                "refreshToken" => $refreshToken,
                "user" => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" =>  $e->getTrace()
            ], 500);
        }
    }
}
