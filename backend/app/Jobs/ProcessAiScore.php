<?php

namespace App\Jobs;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProcessAiScore implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Application $application)
    {
    }

    public function handle(): void
    {
        try {
            $job = $this->application->job;
            $cvText = $this->extractCvText($this->application->cv_path);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.key'),
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => config('services.openai.model', 'gpt-4o-mini'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert HR recruiter. Analyze the candidate\'s CV against the job description and requirements. Return ONLY a valid JSON object with exactly two fields: "score" (integer 0-100 representing match percentage) and "feedback" (string, 2-3 sentences explaining strengths and gaps). No extra text.',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Job Title: {$job->title}\n\nJob Requirements:\n{$job->requirements}\n\nJob Description:\n{$job->description}\n\nCandidate CV:\n{$cvText}",
                    ],
                ],
                'temperature' => 0.3,
                'max_tokens' => 300,
            ]);

            if ($response->successful()) {
                $content = $response->json('choices.0.message.content');
                $result = json_decode($content, true);

                if (isset($result['score']) && isset($result['feedback'])) {
                    $this->application->update([
                        'ai_score' => max(0, min(100, (int) $result['score'])),
                        'ai_feedback' => $result['feedback'],
                    ]);
                    return;
                }
            }
        } catch (\Exception $e) {
            // fall through to keyword-based estimate
        }

        $this->application->update($this->keywordEstimate($cvText ?? '', $job ?? $this->application->job));
    }

    /**
     * Offline fallback used when the OpenAI API is unreachable or not configured:
     * scores the CV by how many of the job's requirement keywords it mentions.
     */
    private function keywordEstimate(string $cvText, $job): array
    {
        $stop = ['and', 'the', 'with', 'for', 'you', 'our', 'are', 'have', 'will', 'from', 'that', 'this', 'years', 'year',
                 'experience', 'knowledge', 'strong', 'good', 'ability', 'skills', 'working', 'work', 'plus', 'least', 'using'];
        preg_match_all('/[a-z][a-z0-9.+#-]{2,}/', strtolower((string) ($job?->requirements ?? '')), $m);
        $keywords = array_values(array_unique(array_diff($m[0], $stop)));

        if (!$keywords) {
            return ['ai_score' => 50, 'ai_feedback' => 'Estimated score (AI service unavailable): no requirement keywords to compare.'];
        }

        $cv = strtolower($cvText);
        $matched = array_values(array_filter($keywords, fn ($k) => str_contains($cv, $k)));
        $score = (int) round(count($matched) / count($keywords) * 100);
        $missing = array_slice(array_values(array_diff($keywords, $matched)), 0, 5);

        $feedback = sprintf('Estimated by keyword matching (AI service unavailable): the CV mentions %d of %d requirement keywords.',
            count($matched), count($keywords));
        if ($matched) $feedback .= ' Matched: ' . implode(', ', array_slice($matched, 0, 6)) . '.';
        if ($missing) $feedback .= ' Not found: ' . implode(', ', $missing) . '.';

        return ['ai_score' => max(0, min(100, $score)), 'ai_feedback' => $feedback];
    }

    private function extractCvText(string $path): string
    {
        try {
            $fullPath = Storage::disk('public')->path($path);

            if (!file_exists($fullPath)) {
                return 'CV file not found.';
            }

            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

            if ($extension === 'pdf') {
                // Try to extract text from PDF using basic approach
                $content = file_get_contents($fullPath);
                // Extract readable text from PDF binary
                preg_match_all('/BT[\s\S]*?ET/', $content, $matches);
                $text = '';
                foreach ($matches[0] as $block) {
                    preg_match_all('/\(([^)]+)\)/', $block, $strings);
                    $text .= implode(' ', $strings[1]) . ' ';
                }
                if (strlen(trim($text)) > 50) {
                    return substr($text, 0, 3000);
                }
                // Fallback: return raw readable characters
                $text = preg_replace('/[^\x20-\x7E\n\r\t]/', ' ', $content);
                $text = preg_replace('/\s+/', ' ', $text);
                return substr(trim($text), 0, 3000);
            }

            return substr(file_get_contents($fullPath), 0, 3000);
        } catch (\Exception $e) {
            return 'Could not read CV content.';
        }
    }
}
