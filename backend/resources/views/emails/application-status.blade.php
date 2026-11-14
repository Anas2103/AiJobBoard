<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563EB; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: bold; }
        .accepted { background: #d1fae5; color: #065f46; }
        .rejected { background: #fee2e2; color: #991b1b; }
        .reviewed { background: #dbeafe; color: #1e40af; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin:0">HireMatch</h1>
        <p style="margin:5px 0 0">Application Status Update</p>
    </div>
    <div class="content">
        <p>Hello {{ $application->user->name }},</p>
        <p>Your application for <strong>{{ $application->job->title }}</strong> has been updated.</p>
        <p>New Status: <span class="status {{ $application->status }}">{{ ucfirst($application->status) }}</span></p>
        @if($application->status === 'accepted')
            <p>Congratulations! The employer has accepted your application. They will reach out to you shortly.</p>
        @elseif($application->status === 'rejected')
            <p>Unfortunately, the employer has decided not to move forward with your application at this time. Keep applying!</p>
        @else
            <p>Your application is being reviewed by the employer.</p>
        @endif
        <p>Job: <strong>{{ $application->job->title }}</strong> at <strong>{{ $application->job->company->name }}</strong></p>
    </div>
    <div class="footer">
        <p>© {{ date('Y') }} HireMatch. All rights reserved.</p>
    </div>
</body>
</html>
