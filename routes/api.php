<?php

use App\Http\Controllers\EquipmentIssueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/equipment-issues', [
    EquipmentIssueController::class,
    'index'
]);

Route::post('/equipment-issues', [
    EquipmentIssueController::class,
    'store'
]);

Route::delete('/equipment-issues/{equipmentIssue}', [
    EquipmentIssueController::class,
    'destroy'
]);
