<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class FixAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:fix-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix or create admin user with email admin@gmail.com and password';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fixing admin user...');

        // Get or create Admin role
        $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);

        // Remove Admin role from any other users with admin@fitness.app
        $oldAdmin = User::where('email', 'admin@fitness.app')->first();
        if ($oldAdmin) {
            $oldAdmin->removeRole('Admin');
            $this->info('Removed Admin role from old admin user (admin@fitness.app)');
        }

        // Create or update admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Ensure admin has the Admin role
        if (!$admin->hasRole('Admin')) {
            $admin->assignRole($adminRole);
            $this->info('Assigned Admin role to user');
        } else {
            $this->info('Admin role already assigned');
        }

        // Sync roles to ensure only Admin role
        $admin->syncRoles([$adminRole]);

        $this->info('Admin user fixed successfully!');
        $this->info('Email: admin@gmail.com');
        $this->info('Password: password');
        $this->line('');

        // Verify
        $this->info('Verifying admin user...');
        $verifiedAdmin = User::where('email', 'admin@gmail.com')->first();
        
        if ($verifiedAdmin && $verifiedAdmin->hasRole('Admin')) {
            $this->info('✓ Admin user exists');
            $this->info('✓ Admin role is assigned');
            $this->info('✓ Password is set');
            
            // Test password
            if (Hash::check('password', $verifiedAdmin->password)) {
                $this->info('✓ Password verification successful');
            } else {
                $this->error('✗ Password verification failed');
            }
        } else {
            $this->error('✗ Admin user verification failed');
        }

        return Command::SUCCESS;
    }
}
