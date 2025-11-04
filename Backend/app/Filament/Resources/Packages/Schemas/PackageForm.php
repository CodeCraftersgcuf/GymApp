<?php

namespace App\Filament\Resources\Packages\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PackageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Title (e.g., Option 1, Option 2)')
                    ->required()
                    ->maxLength(255),
                TextInput::make('bank_name')
                    ->label('Bank Name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('account_title')
                    ->label('Account Title')
                    ->required()
                    ->maxLength(255),
                TextInput::make('account_number')
                    ->label('Account Number')
                    ->required()
                    ->maxLength(255),
                TextInput::make('whatsapp_number')
                    ->label('WhatsApp Number (for receipt)')
                    ->tel()
                    ->maxLength(20)
                    ->helperText('Users will send receipt screenshot to this number'),
                Textarea::make('description')
                    ->label('Description/Instructions')
                    ->rows(3)
                    ->columnSpanFull(),
                TextInput::make('order')
                    ->label('Display Order')
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower numbers appear first'),
                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->required(),
            ]);
    }
}
