<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 0.5in;
            size: A4;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #111827;
            margin: 0;
            font-size: 12px;
        }

        .full-width {
            width: 100%;
            border-collapse: collapse;
        }

        .header-container {
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }

        .stats-table {
            width: 100%;
            margin-bottom: 25px;
        }

        .stat-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            padding: 15px;
            text-align: left;
        }

        .data-table {
            width: 100%;
            table-layout: fixed;
            border: 1px solid #e5e7eb;
            border-collapse: collapse;
        }

        .data-table th {
            background-color: #f9fafb;
            color: #6b7280;
            text-transform: uppercase;
            font-size: 10px;
            padding: 10px;
            border-bottom: 1px solid #e5e7eb;
            text-align: left;
        }

        .data-table td {
            padding: 10px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: middle;
            /* Changed to middle for better image alignment */
            word-wrap: break-word;
        }

        /* Profile Image Styling */
        .profile-img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 10px;
            display: inline-block;
            vertical-align: middle;
            border: 1px solid #e5e7eb;
            object-fit: cover;
        }

        /* Fallback Avatar (Initial) */
        .avatar-initial {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background-color: #4f46e5;
            color: white;
            text-align: center;
            line-height: 35px;
            font-weight: bold;
            font-size: 11px;
            margin-right: 10px;
            display: inline-block;
            vertical-align: middle;
        }

        /* Badges */
        .badge {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .role-admin {
            background-color: #f3e8ff;
            color: #6b21a8;
        }

        .role-user {
            background-color: #e0f2fe;
            color: #0369a1;
        }

        .status-active {
            background-color: #dcfce7;
            color: #166534;
        }

        .status-inactive {
            background-color: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>

<body>

    <div class="header-container">
        <table class="full-width">
            <tr>
                <td>
                    <div style="font-size: 24px; font-weight: bold;">User Directory Report</div>
                    <div style="color: #6b7280;">Generated: {{ date('F d, Y') }}</div>
                </td>
                <td style="text-align: right;">
                    <span
                        style="background:#eef2ff; color:#4f46e5; padding:5px; font-weight:bold; font-size:10px;">INTERNAL
                        REPORT</span>
                </td>
            </tr>
        </table>
    </div>

    <table class="stats-table">
        <tr>
            <td class="stat-card" style="border-radius: 8px 0 0 8px;">
                <div style="color: #6b7280; font-size: 10px;">TOTAL USERS</div>
                <div style="font-size: 20px; font-weight: bold;">{{ count($users) }}</div>
            </td>
            <td class="stat-card">
                <div style="color: #6b7280; font-size: 10px;">ACTIVE</div>
                <div style="font-size: 20px; font-weight: bold; color: #16a34a;">
                    {{ count(array_filter($users, fn($u) => $u['is_active'])) }}
                </div>
            </td>
            <td class="stat-card" style="border-radius: 0 8px 8px 0;">
                <div style="color: #6b7280; font-size: 10px;">INACTIVE</div>
                <div style="font-size: 20px; font-weight: bold; color: #991b1b;">
                    {{ count(array_filter($users, fn($u) => !$u['is_active'])) }}
                </div>
            </td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 35%;">User</th>
                <th style="width: 25%;">Contact</th>
                <th style="width: 15%;">Role</th>
                <th style="width: 15%;">Status</th>
                <th style="width: 10%;">Joined</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
            <tr>
                <td>
                    @if(!empty($user['profile']))
                    <img src="{{ $user['profile'] }}" class="profile-img">

                    @else
                    <div class="avatar-initial">
                        {{ strtoupper(substr($user['full_name'], 0, 2)) }}
                    </div>
                    @endif

                    <div style="display: inline-block; vertical-align: middle;">
                        <div style="font-weight: bold;">{{ $user['full_name'] }}</div>
                        <div style="font-size: 9px; color: #9ca3af;">ID: #{{ $user['id'] }}</div>
                    </div>
                </td>
                <td>
                    <div>{{ $user['email'] }}</div>
                    <div style="color: #9ca3af; font-size: 10px;">{{ $user['mobile'] }}</div>
                </td>
                <td>
                    <span class="badge {{ strtolower($user['role']) == 'admin' ? 'role-admin' : 'role-user' }}">
                        {{ $user['role'] }}
                    </span>
                </td>
                <td>
                    <span class="badge {{ $user['is_active'] ? 'status-active' : 'status-inactive' }}">
                        {{ $user['is_active'] ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td style="color: #6b7280;">
                    {{ \Carbon\Carbon::parse($user['created_at'])->format('d M Y') }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>

</html>