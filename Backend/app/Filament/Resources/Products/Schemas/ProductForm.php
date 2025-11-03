<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                TextInput::make('price_cents')
                    ->required()
                    ->numeric(),
                Select::make('interval')
                    ->options([
            'one_time' => 'One time',
            'monthly' => 'Monthly',
            'quarterly' => 'Quarterly',
            'semiannual' => 'Semiannual',
            'annual' => 'Annual',
        ])
                    ->default('one_time')
                    ->required(),
                Toggle::make('active')
                    ->required(),
                Textarea::make('features')
                    ->default(null)
                    ->columnSpanFull(),
            ]);
    }
}
