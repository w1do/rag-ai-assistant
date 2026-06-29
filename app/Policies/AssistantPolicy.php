<?php

namespace App\Policies;

use App\Domain\Assistant\Models\Assistant;
use App\Models\User;

class AssistantPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Assistant $assistant): bool
    {
        return $user->id === $assistant->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        $subscription = $user->subscriptions()->active()->first();
        if (! $subscription) {
            return $user->balance > 0;
        }

        $limits = $subscription->plan->limits;
        $assistantLimit = $limits['assistants_count'] ?? 1;

        if ($assistantLimit === -1) {
            return true;
        }

        return $user->assistants()->count() < $assistantLimit;
    }

    /**
     * Determine whether the user can add URL to knowledge base.
     */
    public function addUrl(User $user, Assistant $assistant): bool
    {
        if ($user->id !== $assistant->user_id) {
            return false;
        }

        $subscription = $user->subscriptions()->active()->first();
        if (! $subscription) {
            return $user->balance > 0;
        }

        $limits = $subscription->plan->limits;
        $urlLimit = $limits['links_count'] ?? 0;

        if ($urlLimit === -1) {
            return true;
        }

        return $assistant->knowledge()->where('type', 'website')->count() < $urlLimit;
    }

    /**
     * Determine whether the user can upload audio to knowledge base.
     */
    public function uploadAudio(User $user, Assistant $assistant): bool
    {
        if ($user->id !== $assistant->user_id) {
            return false;
        }

        $subscription = $user->subscriptions()->active()->first();
        if (! $subscription) {
            return $user->balance > 0;
        }

        $limits = $subscription->plan->limits;
        $audioLimit = $limits['voice_count'] ?? -1;

        if ($audioLimit === -1) {
            return true;
        }

        return $assistant->knowledge()->where('type', 'voice')->count() < $audioLimit;
    }

    /**
     * Determine whether the user can upload document to knowledge base.
     */
    public function uploadDocument(User $user, Assistant $assistant): bool
    {
        if ($user->id !== $assistant->user_id) {
            return false;
        }

        $subscription = $user->subscriptions()->active()->first();
        if (! $subscription) {
            return $user->balance > 0;
        }

        $limits = $subscription->plan->limits;

        // Для старта загрузка документов может быть запрещена (лимит 0 или отсутствует)
        $docLimit = $limits['document_count'] ?? -1; // Если нет в лимитах, разрешаем (кроме старта, где мы не добавили)

        if ($subscription->plan->slug === 'start') {
            return false; // По ТЗ только ссылки и голосовые
        }

        if ($docLimit === -1) {
            return true;
        }

        return $assistant->knowledge()->where('type', 'document')->count() < $docLimit;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Assistant $assistant): bool
    {
        return $user->id === $assistant->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Assistant $assistant): bool
    {
        return $user->id === $assistant->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Assistant $assistant): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Assistant $assistant): bool
    {
        return false;
    }
}
