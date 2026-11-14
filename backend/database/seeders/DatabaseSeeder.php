<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\SavedJob;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Sample CV referenced by the seeded applications
        Storage::disk('public')->put('cvs/sample_cv.pdf', file_get_contents(__DIR__ . '/files/sample_cv.pdf'));

        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hirematch.com',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
        ]);

        // Employers
        $employers = [
            ['name' => 'Alice Johnson', 'email' => 'alice@techcorp.com'],
            ['name' => 'Bob Smith',     'email' => 'bob@creativeagency.com'],
            ['name' => 'Carol White',   'email' => 'carol@startupxyz.com'],
        ];

        $companyData = [
            [
                'name' => 'Tech Corp',
                'description' => 'Leading technology company building innovative software solutions for enterprise clients. We work with Fortune 500 companies to transform their digital infrastructure.',
                'location' => 'San Francisco, CA',
                'website' => 'https://techcorp.example.com',
            ],
            [
                'name' => 'Creative Agency',
                'description' => 'Award-winning creative agency specializing in brand identity, UI/UX design, and digital marketing. Our work has been featured in Awwwards and CSS Design Awards.',
                'location' => 'New York, NY',
                'website' => 'https://creativeagency.example.com',
            ],
            [
                'name' => 'StartupXYZ',
                'description' => 'Fast-growing fintech startup disrupting the AI-powered financial tools space. Series B funded with $42M. Backed by top-tier investors including Sequoia and a16z.',
                'location' => 'Austin, TX',
                'website' => 'https://startupxyz.example.com',
            ],
        ];

        $companies = [];
        foreach ($employers as $i => $employerData) {
            $employer = User::create([
                'name'     => $employerData['name'],
                'email'    => $employerData['email'],
                'password' => Hash::make('Password123!'),
                'role'     => 'employer',
            ]);
            $company = Company::create(array_merge($companyData[$i], ['user_id' => $employer->id]));
            $companies[] = $company;
        }

        // Candidates
        $candidateData = [
            ['name' => 'David Lee',     'email' => 'david@candidate.com'],
            ['name' => 'Emma Davis',    'email' => 'emma@candidate.com'],
            ['name' => 'Frank Brown',   'email' => 'frank@candidate.com'],
            ['name' => 'Grace Wilson',  'email' => 'grace@candidate.com'],
            ['name' => 'Henry Taylor',  'email' => 'henry@candidate.com'],
        ];
        $candidates = [];
        foreach ($candidateData as $data) {
            $candidates[] = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => Hash::make('Password123!'),
                'role'     => 'candidate',
            ]);
        }

        // Jobs
        $jobsData = [
            // Tech Corp (company 0)
            [
                'company' => 0,
                'title' => 'Senior Laravel Developer',
                'description' => 'We are looking for an experienced Laravel developer to join our backend team. You will build scalable APIs, work with microservices, and mentor junior developers. This is a high-impact role on our core platform team.',
                'requirements' => 'PHP 8.x, Laravel 10+, MySQL, Redis, REST APIs, microservices architecture, 5+ years experience. Experience with Dockerized environments is a plus.',
                'location' => 'San Francisco, CA',
                'type' => 'full-time',
                'salary_min' => 100000,
                'salary_max' => 140000,
                'status' => 'open',
            ],
            [
                'company' => 0,
                'title' => 'React Frontend Engineer',
                'description' => 'Join our frontend team to build beautiful, responsive web applications. You will work closely with designers and backend engineers to deliver pixel-perfect features for our enterprise clients.',
                'requirements' => 'React 18+, TypeScript, Tailwind CSS, REST API integration, performance optimization, unit testing with Jest, 3+ years experience.',
                'location' => 'Remote',
                'type' => 'remote',
                'salary_min' => 85000,
                'salary_max' => 115000,
                'status' => 'open',
            ],
            [
                'company' => 0,
                'title' => 'DevOps Engineer',
                'description' => 'Looking for a DevOps engineer to manage our cloud infrastructure, CI/CD pipelines, and ensure 99.9% uptime. You will own our observability stack and lead incident response.',
                'requirements' => 'AWS/GCP, Docker, Kubernetes, Terraform, GitHub Actions, Prometheus/Grafana, 4+ years experience.',
                'location' => 'San Francisco, CA',
                'type' => 'hybrid',
                'salary_min' => 110000,
                'salary_max' => 150000,
                'status' => 'open',
            ],
            [
                'company' => 0,
                'title' => 'Mobile Developer (iOS/Android)',
                'description' => 'Build and maintain our mobile applications for both iOS and Android platforms using React Native. You will own the mobile roadmap and work closely with product and design.',
                'requirements' => 'React Native, TypeScript, iOS/Android deployment, App Store and Play Store experience, REST APIs, 3+ years experience.',
                'location' => 'Remote',
                'type' => 'remote',
                'salary_min' => 90000,
                'salary_max' => 120000,
                'status' => 'closed',
            ],
            // Creative Agency (company 1)
            [
                'company' => 1,
                'title' => 'UI/UX Designer',
                'description' => 'We need a creative UI/UX designer to craft stunning user interfaces and improve user experience across our digital products. You will run user research sessions, create wireframes, and deliver production-ready Figma files.',
                'requirements' => 'Figma, Adobe XD, user research methodologies, prototyping, design systems, 3+ years experience in product design.',
                'location' => 'New York, NY',
                'type' => 'full-time',
                'salary_min' => 75000,
                'salary_max' => 100000,
                'status' => 'open',
            ],
            [
                'company' => 1,
                'title' => 'Digital Marketing Specialist',
                'description' => 'Drive our digital marketing efforts including SEO, SEM, social media campaigns, and content strategy. You will manage a $200k annual ad budget and report directly to the CMO.',
                'requirements' => 'Google Ads, Meta Ads Manager, SEO tools (Ahrefs/Semrush), Google Analytics 4, content creation, A/B testing, 2+ years experience.',
                'location' => 'New York, NY',
                'type' => 'part-time',
                'salary_min' => 45000,
                'salary_max' => 60000,
                'status' => 'open',
            ],
            [
                'company' => 1,
                'title' => 'Brand Strategist',
                'description' => 'Lead brand strategy initiatives for our Fortune 500 clients. Develop brand guidelines, messaging frameworks, and positioning strategies that drive measurable business outcomes.',
                'requirements' => 'Brand strategy, competitive analysis, market research, executive presentations, client management, 5+ years agency experience.',
                'location' => 'New York, NY',
                'type' => 'full-time',
                'salary_min' => 90000,
                'salary_max' => 120000,
                'status' => 'open',
            ],
            // StartupXYZ (company 2)
            [
                'company' => 2,
                'title' => 'Full Stack Engineer',
                'description' => 'Join our fintech startup as a full stack engineer. Build features end-to-end, from database schema design to pixel-perfect UI. You will own entire product verticals and ship independently.',
                'requirements' => 'Node.js, React, PostgreSQL, AWS, REST/GraphQL APIs, fintech or payments experience a plus, 3+ years experience.',
                'location' => 'Austin, TX',
                'type' => 'full-time',
                'salary_min' => 95000,
                'salary_max' => 130000,
                'status' => 'open',
            ],
            [
                'company' => 2,
                'title' => 'Data Scientist',
                'description' => 'Analyze financial data, build predictive models, and develop AI-powered features for our platform. You will work closely with the product team to translate data insights into product decisions.',
                'requirements' => 'Python, TensorFlow/PyTorch, SQL, data visualization, statistical modeling, financial domain knowledge preferred, 3+ years experience.',
                'location' => 'Remote',
                'type' => 'remote',
                'salary_min' => 100000,
                'salary_max' => 135000,
                'status' => 'open',
            ],
            [
                'company' => 2,
                'title' => 'Product Manager',
                'description' => 'Lead product strategy and roadmap for our AI-powered financial tools. Work cross-functionally with engineering, design, and sales. Own KPIs and present quarterly business reviews to the board.',
                'requirements' => 'Product roadmap ownership, user story writing, agile/scrum, stakeholder management, fintech domain knowledge preferred, 4+ years PM experience.',
                'location' => 'Austin, TX',
                'type' => 'hybrid',
                'salary_min' => 105000,
                'salary_max' => 140000,
                'status' => 'open',
            ],
        ];

        $jobListings = [];
        foreach ($jobsData as $jobData) {
            $companyIndex = $jobData['company'];
            unset($jobData['company']);
            $jobListings[] = JobListing::create(array_merge($jobData, [
                'company_id' => $companies[$companyIndex]->id,
            ]));
        }

        // Indexes for readability
        // 0: Senior Laravel Dev, 1: React Frontend, 2: DevOps, 3: Mobile Dev (closed)
        // 4: UI/UX Designer, 5: Digital Marketing, 6: Brand Strategist
        // 7: Full Stack, 8: Data Scientist, 9: Product Manager

        $aiFeedbacks = [
            'strong'   => 'Exceptional match — candidate\'s skills align precisely with all key requirements. Strong portfolio evidence and relevant domain experience. Recommended for immediate interview.',
            'good'     => 'Good alignment with role requirements. Technical skills are solid with minor gaps that can be addressed through onboarding. Communication skills appear strong based on cover letter.',
            'moderate' => 'Partial match. Core technical skills are present but 1-2 key requirements are not clearly demonstrated. Consider phone screen to assess depth of experience.',
            'weak'     => 'Limited match with the role requirements. Candidate shows potential but lacks several key qualifications. Would need significant ramp-up time.',
        ];

        $applicationData = [
            // David Lee — strong backend developer
            ['job' => 0, 'candidate' => 0, 'status' => 'accepted', 'ai_score' => 92, 'ai_feedback' => 'Outstanding PHP and Laravel expertise with 6 years of hands-on experience. Demonstrated microservices architecture knowledge and Redis optimization. Excellent API design patterns in portfolio. ' . $aiFeedbacks['strong']],
            ['job' => 1, 'candidate' => 0, 'status' => 'reviewed', 'ai_score' => 74, 'ai_feedback' => 'Solid React skills with TypeScript proficiency. Portfolio shows clean component architecture. Performance optimization experience is limited. Testing coverage could be improved. ' . $aiFeedbacks['moderate']],
            ['job' => 7, 'candidate' => 0, 'status' => 'accepted', 'ai_score' => 88, 'ai_feedback' => 'Strong full-stack background with Node.js and React expertise. AWS certification present. Fintech domain experience is limited but technical skills are exceptional. ' . $aiFeedbacks['good']],
            ['job' => 9, 'candidate' => 0, 'status' => 'pending',  'ai_score' => 61, 'ai_feedback' => 'Technical background is strong but PM experience is not clearly demonstrated. CV focuses heavily on engineering. Would need assessment of product thinking and stakeholder management skills. ' . $aiFeedbacks['moderate']],

            // Emma Davis — designer and marketer
            ['job' => 4, 'candidate' => 1, 'status' => 'accepted', 'ai_score' => 89, 'ai_feedback' => 'Excellent Figma proficiency with a stunning portfolio of product work. UX research methodology clearly documented. Design system experience is a standout. ' . $aiFeedbacks['strong']],
            ['job' => 1, 'candidate' => 1, 'status' => 'reviewed', 'ai_score' => 72, 'ai_feedback' => 'Good React knowledge and TypeScript usage. UI sensibility is strong given design background. Performance optimization experience not demonstrated. ' . $aiFeedbacks['moderate']],
            ['job' => 6, 'candidate' => 1, 'status' => 'pending',  'ai_score' => 83, 'ai_feedback' => 'Strong brand strategy background. Agency experience is directly relevant. Portfolio demonstrates measurable results for clients. Presentation skills appear polished. ' . $aiFeedbacks['good']],
            ['job' => 5, 'candidate' => 1, 'status' => 'rejected', 'ai_score' => 55, 'ai_feedback' => 'Design background does not translate well to performance marketing. Google Ads and Meta Ads Manager experience not demonstrated. SEO knowledge appears surface-level. ' . $aiFeedbacks['weak']],

            // Frank Brown — mid-level developer
            ['job' => 4, 'candidate' => 2, 'status' => 'rejected', 'ai_score' => 42, 'ai_feedback' => 'Basic design skills but lacks Figma proficiency and modern UX tools. Portfolio does not demonstrate the depth of research required for a senior design role. ' . $aiFeedbacks['weak']],
            ['job' => 2, 'candidate' => 2, 'status' => 'reviewed', 'ai_score' => 68, 'ai_feedback' => 'Decent infrastructure knowledge with Docker and basic AWS experience. Kubernetes and Terraform exposure is limited. Would need mentoring on observability tooling. ' . $aiFeedbacks['moderate']],
            ['job' => 7, 'candidate' => 2, 'status' => 'pending',  'ai_score' => 76, 'ai_feedback' => 'Solid full-stack experience with Node.js. React skills demonstrated through side projects. PostgreSQL and AWS knowledge present. Fintech experience absent. ' . $aiFeedbacks['good']],

            // Grace Wilson — data and marketing
            ['job' => 7, 'candidate' => 3, 'status' => 'accepted', 'ai_score' => 81, 'ai_feedback' => 'Strong Node.js and React background with production AWS experience. Database design skills evidenced in portfolio. Fintech domain knowledge is limited but technical profile is impressive. ' . $aiFeedbacks['good']],
            ['job' => 5, 'candidate' => 3, 'status' => 'pending',  'ai_score' => 70, 'ai_feedback' => 'Google Analytics and social media campaign experience present. SEO knowledge appears solid. Meta Ads experience is limited. Budget management skills not clearly demonstrated. ' . $aiFeedbacks['moderate']],
            ['job' => 8, 'candidate' => 3, 'status' => 'reviewed', 'ai_score' => 78, 'ai_feedback' => 'Strong Python and data analysis pipeline experience. Machine learning background with PyTorch. Financial modeling knowledge is limited which is a key requirement. ' . $aiFeedbacks['moderate']],

            // Henry Taylor — data and product
            ['job' => 8, 'candidate' => 4, 'status' => 'pending',  'ai_score' => 65, 'ai_feedback' => 'Solid Python and ML foundations. Data pipeline experience demonstrated. Financial domain knowledge is lacking. Visualization skills appear adequate. ' . $aiFeedbacks['moderate']],
            ['job' => 9, 'candidate' => 4, 'status' => 'reviewed', 'ai_score' => 77, 'ai_feedback' => 'Good product thinking demonstrated through case studies. Agile experience well-documented. Fintech knowledge is a gap but stakeholder management skills appear strong. ' . $aiFeedbacks['good']],
            ['job' => 3, 'candidate' => 4, 'status' => 'accepted', 'ai_score' => 85, 'ai_feedback' => 'Strong React Native experience with published apps on both App Store and Play Store. TypeScript proficiency is excellent. REST API integration skills well-demonstrated. ' . $aiFeedbacks['strong']],
        ];

        foreach ($applicationData as $appData) {
            Application::create([
                'job_id'       => $jobListings[$appData['job']]->id,
                'user_id'      => $candidates[$appData['candidate']]->id,
                'cv_path'      => 'cvs/sample_cv.pdf',
                'cover_letter' => 'I am very interested in this position and believe my skills and experience align well with your requirements. I would welcome the opportunity to discuss how I can contribute to your team.',
                'status'       => $appData['status'],
                'ai_score'     => $appData['ai_score'],
                'ai_feedback'  => $appData['ai_feedback'],
            ]);
        }

        // Saved jobs — each candidate has bookmarked several roles
        $savedJobsData = [
            // David
            [$candidates[0]->id, $jobListings[1]->id],
            [$candidates[0]->id, $jobListings[2]->id],
            [$candidates[0]->id, $jobListings[9]->id],
            // Emma
            [$candidates[1]->id, $jobListings[0]->id],
            [$candidates[1]->id, $jobListings[4]->id],
            [$candidates[1]->id, $jobListings[6]->id],
            // Frank
            [$candidates[2]->id, $jobListings[2]->id],
            [$candidates[2]->id, $jobListings[8]->id],
            // Grace
            [$candidates[3]->id, $jobListings[7]->id],
            [$candidates[3]->id, $jobListings[8]->id],
            [$candidates[3]->id, $jobListings[9]->id],
            // Henry
            [$candidates[4]->id, $jobListings[8]->id],
            [$candidates[4]->id, $jobListings[9]->id],
        ];

        foreach ($savedJobsData as [$userId, $jobId]) {
            SavedJob::create(['user_id' => $userId, 'job_id' => $jobId]);
        }
    }
}
