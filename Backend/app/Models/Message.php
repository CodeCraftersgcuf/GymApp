<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'admin_id',
        'message',
        'sender_type',
        'is_read',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    /**
     * Get the user who sent/received this message.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who sent/received this message.
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Mark message as read.
     */
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }
}
