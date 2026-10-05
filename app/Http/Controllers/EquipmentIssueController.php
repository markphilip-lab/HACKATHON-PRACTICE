<?php

namespace App\Http\Controllers;

use App\Models\EquipmentIssue;
use Illuminate\Http\Request;

class EquipmentIssueController extends Controller
{
    public function index()
    {
        return response()->json(
            EquipmentIssue::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lab_number' => [
                'required',
                'string',
                'in:Lab A,Lab B,Lab C,Mac Lab',
            ],

            'equipment_type' => [
                'required',
                'string',
                'in:Monitor,Keyboard,Mouse,LAN Cable',
            ],

            'issue_description' => [
                'required',
                'string',
            ],

            'reported_by' => [
                'required',
                'string'
            ],

            'severity' => [
                'required',
                'string',
                'in:Low,Medium,High',
            ],
        ]);

        $issue =EquipmentIssue::create($validated);

        return response()->json(
            $issue,
            201
        );
    }

    public function destroy(EquipmentIssue $equipmentIssue)
    {
        $equipmentIssue->delete();
        return response()->json([
            'message' => 'Equipment issue resolved/dismissed successfully.',
        ]);
    }
}
