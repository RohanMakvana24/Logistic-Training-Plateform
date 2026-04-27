<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\LoginNotification;
use App\Services\TwilioWhatsAppService;
use Barryvdh\DomPDF\Facade\Pdf;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Svg\Tag\Rect;
use Twilio\Rest\Client;

class UserController extends Controller
{
    protected $whatsapp;

    public function __construct(TwilioWhatsAppService $whatsapp)
    {
        $this->whatsapp = $whatsapp;
    }

    /** Check User Mobile Number On Whatsapp Controller */
    public function checkWhatsapp(Request $request)
    {
        $request->validate([
            'mobile' => 'required|numeric|digits:10',
        ]);

        $mobile = (int) $request->mobile;
        $result = $this->whatsapp->checkWhatsappNumber($mobile);
        return response()->json($result, 400);
    }

    /** Create User Controller */
    public function createUser(Request $request)
    {
        try {
            $data = $request->validate([
                'full_name' => 'required|min:3',
                'role' => 'required|in:admin,user',
                'is_active' => 'required|in:1,0',
                'email' => 'required|email|unique:users,email',
                'mobile' => 'required|numeric|digits:10|unique:users,mobile',
                'iswhatsapp' => "required",
                'profile' => 'required|file',
            ]);

            /** 1. Profile Uploading */
            $url = null;
            $publicId = null;
            if ($request->hasFile('profile')) {
                $result = $request->file('profile')->storeOnCloudinary('logistic/user_profiles');
                $url = $result->getSecurePath();
                $publicId = $result->getPublicId();
            }

            /** 2. Create User */
            $user = User::create([
                'full_name' => $data['full_name'],
                'role' => $data['role'],
                'is_active' => $data['is_active'],
                'email' => $data['email'],
                'mobile' => $data['mobile'],
                "profile" => $url,
                "profile_id" => $publicId
            ]);

            /** 3. Magic Login Link */
            $backendUrl = URL::temporarySignedRoute(
                'login-fresher',
                now()->addMinutes(15),
                ['user' => $user->id]
            );

            $magicLink = "http://localhost:5173/auth/login-fresher?url=" . urlencode($backendUrl);
            /** 4. Send Notification */
            $twilioStatus = "not_sent";
            $sendViaWhatsapp = filter_var($request->iswhatsapp, FILTER_VALIDATE_BOOLEAN);
            if ($sendViaWhatsapp) {
                $twilioResponse = $this->whatsapp->sendWhatsApp($user->mobile, $magicLink);
                $twilioStatus = ($twilioResponse && isset($twilioResponse->status))
                    ? $twilioResponse->status
                    : "failed";
            } else {
                $user->notify(new LoginNotification($magicLink));
                $twilioStatus = "email_sent";
            }
            return response()->json([
                "success" => true,
                "message" => "User created successfully",
                "twilio_status" => $twilioStatus,
                "magic_link" => $magicLink
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" =>  $e->getTrace()
            ], 500);
        }
    }

    /** Fetch User Controller */
    public function fetchUsers(Request $request)
    {
        try {
            if ($request->boolean('showDeleted')) {
                $query = User::onlyTrashed();
            } else {
                $query = User::query();
            }
            /** 
             * Searching 
             */
            if ($request->filled('search') && $request->search != "") {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('role', 'LIKE', "%{$search}%")
                        ->orWhere('mobile', 'LIKE', "%{$search}%");
                });
            }

            /** 
             * Status Filter 
             */
            if ($request->filled('status')) {
                $query->where('is_active', $request->status);
            }

            /** 
             * Roles Filter 
             */
            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            /** 
             * Finds Stats 
             */
            $totalUsers = User::count();
            $totalActiveUsers = User::where('is_active', 1)->count();
            $totalAdmins = User::where('role', 'admin')->count();
            $totalFreshers = User::where('role', 'user')->count();
            $perPage = $request->per_page ?? 10;
            $page = $request->page ?? 1;

            $users = $query->paginate($perPage, ['*'], 'page', $page);
            $users->appends(['totalUsers' => $totalUsers]);
            $users->setCollection(
                $users->getCollection()
            );

            $users = $users->toArray();
            $users['totalUsers'] = $totalUsers;
            $users['totalActiveUsers'] = $totalActiveUsers;
            $users['totalAdmins'] = $totalAdmins;
            $users['totalFreshers'] = $totalFreshers;

            return response()->json([
                "success" => true,
                "message" => "User Fetched Successfully",
                "users" => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Internal Server Errors",
                "errors" =>  $e->getTrace()
            ]);
        }
    }

    /** Fetch Single User Controller */
    public function fetchUser($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User not found..!"
                ]);
            }
            return response()->json([
                "success" => false,
                "message" => "User Fetchd Successfully",
                "user" => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" =>  $e->getTrace()
            ], 500);
        }
    }

    /** Update User Controller */
    public function updateUser(Request $request)
    {
        try {

            $userId = $request->userId;

            $data = $request->validate([
                'full_name' => 'required|min:3',
                'role' => 'required|in:admin,user',
                'is_active' => 'required|in:1,0',
                'email' => 'required|email|unique:users,email,' . $userId,
                'mobile' => 'required|numeric|digits:10|unique:users,mobile,' . $userId,
                'iswhatsapp' => "required",
                'profile' => 'nullable',
            ]);

            $user = User::findOrFail($userId);

            $newUrl = $user->profile;
            $publicId = $user->profile_id;

            if ($request->hasFile('profile')) {

                if ($publicId) {
                    $cloudinary = new Cloudinary();
                    $cloudinary->uploadApi()->destroy($publicId);
                }

                $result = $request->file('profile')
                    ->storeOnCloudinary('logistic/user_profiles');

                $newUrl = $result->getSecurePath();
                $publicId = $result->getPublicId();
            }

            $user->full_name = $data['full_name'];
            $user->role = $data['role'];
            $user->is_active = $data['is_active'];
            $user->email = $data['email'];
            $user->mobile = $data['mobile'];
            $user->profile = $newUrl;
            $user->profile_id = $publicId;

            $user->save();

            return response()->json([
                "success" => true,
                "message" => "User Updated Successfully",
                "user" => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" => $e->getTrace()
            ], 500);
        }
    }
    /** Delete User Controller */
    public function deleteUser($id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User not found.."
                ], 400);
            }
            if ($user->profile_id) {
                $cloudinary = new Cloudinary();
                $cloudinary->uploadApi()->destroy($user->profile_id);
            }
            $user->delete();
            return response()->json([
                "success" => false,
                "message" => "User Deleted Successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" => $e->getTrace()
            ], 500);
        }
    }

    /** Resend Fresher Login Controller */
    public function resentFresherLoginNotification($id)
    {
        try {
            $user = User::findOrFail($id);
            /** 1. Magic Login Link */
            $backendUrl = URL::temporarySignedRoute(
                'login-fresher',
                now()->addMinutes(15),
                ['user' => $user->id]
            );
            $magicLink = "http://localhost:5173/auth/login-fresher?url=" . urlencode($backendUrl);
            /** 2. Send Notification */
            $twilioStatus = "not_sent";
            $sendViaWhatsapp = filter_var($user->iswhatsapp, FILTER_VALIDATE_BOOLEAN);
            if ($sendViaWhatsapp) {
                $twilioResponse = $this->whatsapp->sendWhatsApp($user->mobile, $magicLink);
                $twilioStatus = ($twilioResponse && isset($twilioResponse->status))
                    ? $twilioResponse->status
                    : "failed";
            } else {
                $user->notify(new LoginNotification($magicLink));
                $twilioStatus = "email_sent";
            }
            return response()->json([
                "success" => true,
                "message" => "Fresher login Request Resent Successfully",
                "twilio_status" => $twilioStatus,
                "magic_link" => $magicLink
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" =>  $e->getTrace()
            ], 500);
        }
    }

    /** Generate Users PDF Controller */
    public function generatesPDF(Request $request)
    {
        try {
            $users = $request->data;
            $contxt = stream_context_create([
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ]
            ]);
            $pdf = Pdf::loadView('template.pdf.users', [
                "users" => $users
            ])->setPaper('a4', 'portrait')
                ->setOption([
                    'isRemoteEnabled' => true,
                    'isHtml5ParserEnabled' => true,
                    'chroot' => public_path(),
                ]);
            $pdf->getDomPDF()->setHttpContext($contxt);

            return $pdf->download('users_report.pdf');
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" =>  $e->getTrace()
            ], 500);
        }
    }

    /** Generate Users excel/csv file Controller */
    public function generateExcel(Request $request)
    {
        try {
            $users = $request->data;
            $contxt = stream_context_create([
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ]
            ]);
            $pdf = Pdf::loadView('template.pdf.users', [
                "users" => $users
            ])->setPaper('a4', 'portrait')
                ->setOption([
                    'isRemoteEnabled' => true,
                    'isHtml5ParserEnabled' => true,
                    'chroot' => public_path(),
                ]);
            $pdf->getDomPDF()->setHttpContext($contxt);

            return $pdf->download('users_report.pdf');
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage(),
                "errors" =>  $e->getTrace()
            ], 500);
        }
    }
}
