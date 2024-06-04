<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Inertia\Inertia;

class ReservedRoomController extends Controller
{
    /**
     * Display a listing of reserved rooms.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Fetch all reserved rooms
        $reservedRooms = Project::where('status', 'Reserved')->get();

        // Return the reserved rooms using Inertia response
        return Inertia::render('ReservedRooms', [
            'reservedRooms' => $reservedRooms
        ]);
    }
}
