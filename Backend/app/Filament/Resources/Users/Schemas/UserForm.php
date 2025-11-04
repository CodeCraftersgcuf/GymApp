<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->default(null),
                Select::make('gender')
                    ->options(['male' => 'Male', 'female' => 'Female', 'other' => 'Other'])
                    ->default(null),
                DatePicker::make('dob'),
                TextInput::make('height_cm')
                    ->numeric()
                    ->default(null),
                TextInput::make('weight_kg')
                    ->numeric()
                    ->default(null),
                TextInput::make('city')
                    ->default(null),
                Select::make('user_type')
                    ->label('User Type')
                    ->options([
                        'simple' => 'Simple User',
                        'premium' => 'Premium User',
                    ])
                    ->default('simple')
                    ->required(),
                Select::make('goal')
                    ->options([
            'fat_loss' => 'Fat loss',
            'muscle_gain' => 'Muscle gain',
            'maintenance' => 'Maintenance',
            'endurance' => 'Endurance',
            'strength' => 'Strength',
        ])
                    ->default(null),
                TextInput::make('locale')
                    ->required()
                    ->default('en'),
                TextInput::make('timezone')
                    ->required()
                    ->default('UTC'),
                DateTimePicker::make('last_login_at'),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('password')
                    ->password()
                    ->required(),
            ]);
    }
}
