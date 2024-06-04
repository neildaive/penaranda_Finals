<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Project; // Assuming your model is Project
use Illuminate\Support\Facades\Log;

class UpdateRoomStatus extends Command
{
    protected $signature = 'room:update-status';
    protected $description = 'Update room status based on reservation period';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Log the start of the command
        Log::info('Running room:update-status command');

        // Fetch reserved rooms where the reservation period has ended
        $projects = Project::where('status', 'Reserved')
            ->where('end_datetime', '<', now())
            ->get();

        // Log the number of projects found
        Log::info('Found ' . $projects->count() . ' projects to update');

        foreach ($projects as $project) {
            // Log the project details before updating
            Log::info('Updating project ID: ' . $project->id . ', Name: ' . $project->name);

            // Update the project status and other fields
            $project->status = 'Available';
            $project->reserved_by = null;
            $project->start_datetime = null;
            $project->end_datetime = null;
            $project->save();

            // Log the updated project details
            Log::info('Updated project ID: ' . $project->id . ' to Available');
        }

        // Log the end of the command
        Log::info('Completed room:update-status command');

        $this->info('Room statuses updated successfully.');
    }
}
