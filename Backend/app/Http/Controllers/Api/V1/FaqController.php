<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FaqController extends Controller
{
    /**
     * List all active FAQs.
     */
    public function index(Request $request)
    {
        $query = Faq::where('is_active', true)
            ->orderBy('order');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('question', 'like', "%{$request->search}%")
                  ->orWhere('answer', 'like', "%{$request->search}%");
            });
        }

        $faqs = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $faqs->map(function ($faq) {
                return [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                    'category' => $faq->category,
                    'order' => $faq->order,
                ];
            }),
            'meta' => [
                'current_page' => $faqs->currentPage(),
                'per_page' => $faqs->perPage(),
                'total' => $faqs->total(),
            ],
            'links' => [
                'first' => $faqs->url(1),
                'last' => $faqs->url($faqs->lastPage()),
                'prev' => $faqs->previousPageUrl(),
                'next' => $faqs->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Show a single FAQ.
     */
    public function show($id): JsonResponse
    {
        $faq = Faq::where('is_active', true)->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $faq->id,
                'question' => $faq->question,
                'answer' => $faq->answer,
                'category' => $faq->category,
                'order' => $faq->order,
            ],
        ]);
    }
}

