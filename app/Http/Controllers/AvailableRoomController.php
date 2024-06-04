<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Inertia\Inertia;

class AvailableRoomController extends Controller
{
    /**
     * Display a listing of available rooms.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Fetch all available rooms
        $availableRooms = Project::where('status', 'Available')->get();

        // Return the available rooms using Inertia response
        return Inertia::render('AvailableRooms', [
            'availableRooms' => $availableRooms
        ]);
    }

    // Other CRUD methods (create, store, show, edit, update, destroy) can be implemented as needed
}
