<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [];

        for ($i = 1; $i <= 10; $i++) {
            $projects[] = [
                'name' => 'Room ' . $i,
                'description' => 'Description for Room ' . $i,
                'due_date' => now()->addDays(rand(1, 30)),
                'status' => 'AVAILABLE',
                'image_path' => 'https://www.solidbackgrounds.com/images/1920x1080/1920x1080-bright-green-solid-color-background.jpg',
                'created_by' => 1,
                'updated_by' => 1,
                'start_datetime' => null,
                'end_datetime' => null,
                'reserved_by' => null,
            ];
        }

        DB::table('projects')->insert($projects);
    }
}
