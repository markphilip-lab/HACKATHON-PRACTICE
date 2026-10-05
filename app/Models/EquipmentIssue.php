<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentIssue extends Model
{
    protected $fillable = [
        'lab_number',
        'equipment_type',
        'equipment_issue',
        'issue_description',
        'reported_by',
        'severity',
    ];
}