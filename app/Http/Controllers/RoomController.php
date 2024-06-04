<?php





namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $room = Project::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'status' => 'Available', // Set default status to 'Available'
        ]);

        return response()->json(['room' => $room], 200);
    }
}
