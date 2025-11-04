<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email address')
                    ->searchable(),
                TextColumn::make('phone')
                    ->searchable(),
                TextColumn::make('gender')
                    ->badge(),
                TextColumn::make('dob')
                    ->date()
                    ->sortable(),
                TextColumn::make('height_cm')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('weight_kg')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('user_type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'premium' => 'success',
                        'simple' => 'gray',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('goal')
                    ->badge(),
                TextColumn::make('locale')
                    ->searchable(),
                TextColumn::make('timezone')
                    ->searchable(),
                TextColumn::make('last_login_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('email_verified_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
