<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\UpdateProjectRequest;




class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query();
        $projects = $query->paginate(10)->onEachSide(1);
        return inertia("Project/Index", [
            "projects" => ProjectResource::collection($projects),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'image_path' => 'required|url',
        ]);

        // Create a new project
        $project = new Project([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'due_date' => $request->input('due_date'),
            'status' => 'Available',
            'image_path' => $request->input('image_path'),
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);
        $project->save();

        // Redirect back to the reservation page with a success message
        return redirect()->route('reservations.index')->with('success', 'Room added successfully.');
    }



    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
    public function updateStatuses()
    {
        $currentDate = now();

        // Update projects whose due date has passed

        Project::where('status', 'reserved')
            ->where('due_date', '<', $currentDate)
            ->update(['status' => 'available', 'image_path' => 'https://www.solidbackgrounds.com/images/1920x1080/1920x1080-bright-green-solid-color-background.jpg']);










        // Fetch updated projects
        $projects = Project::all();

        return response()->json($projects);
    }

}
