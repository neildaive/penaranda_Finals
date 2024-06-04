<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Project;
use Carbon\Carbon;

class UpdateProjectStatus extends Command
{
    protected $signature = 'project:update-status';
    protected $description = 'Update project statuses based on end datetime';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $currentDateTime = Carbon::now();
        $projects = Project::where('status', 'Reserved')
            ->where('end_datetime', '<', $currentDateTime)
            ->get();

        foreach ($projects as $project) {
            $project->status = 'Available';
            $project->reserved_by = null;
            $project->start_datetime = null;
            $project->end_datetime = null;
            $project->save();
        }

        $this->info('Updated ' . $projects->count() . ' projects to Available.');
    }
}
