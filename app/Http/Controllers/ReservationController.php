<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function reserve($id, Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'start_datetime' => 'required|date|after:now',
            'end_datetime' => 'required|date|after:start_datetime',
        ]);

        // Find the project by ID
        $project = Project::findOrFail($id);

        // Check if the project is already reserved
        if ($project->status === 'Reserved') {
            return response()->json(['message' => 'This room is already reserved.'], 400);
        }

        // Update the project with reservation details
        $project->update([
            'status' => 'Reserved',
            'reserved_by' => $validatedData['name'],
            'start_datetime' => $validatedData['start_datetime'],
            'end_datetime' => $validatedData['end_datetime'],
        ]);

        // Return a success response with the updated project data
        return response()->json(['message' => 'Room reserved successfully.', 'project' => $project], 200);
    }

    public function makeAvailable($id)
    {
        // Find the project by ID
        $project = Project::findOrFail($id);

        // Check if the project is already available
        if ($project->status === 'Available') {
            return response()->json(['message' => 'This room is already available.'], 400);
        }

        // Update the project to make it available
        $project->update([
            'status' => 'Available',
            'reserved_by' => null,
            'start_datetime' => null,
            'end_datetime' => null,
        ]);

        // Return a success response with the updated project data
        return response()->json(['message' => 'Room is now available.', 'project' => $project], 200);
    }
    public function getAvailableRooms()
    {
        // Fetch all available rooms
        $availableRooms = Project::where('status', 'Available')->get();

        // Return the available rooms
        return response()->json(['availableRooms' => $availableRooms], 200);
    }


}
