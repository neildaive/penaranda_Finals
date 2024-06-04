<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Project;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = 'AVAILABLE';

        $imageUrls = [
            'AVAILABLE' => 'https://www.solidbackgrounds.com/images/1920x1080/1920x1080-bright-green-solid-color-background.jpg',
            'RESERVED' => 'https://htmlcolorcodes.com/assets/images/colors/dark-red-color-solid-background-1920x1080.png',
        ];

        return [
            'name' => $this->faker->sentence(),
            'description' => $this->faker->realText(),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'status' => $status,
            'image_path' => $imageUrls[$status],
        ];
    }

    /**
     * Indicate that the project is reserved.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function reserved(\DateTime $dueDateTime)
    {
        return $this->state(function (array $attributes) use ($dueDateTime) {
            return [
                'status' => 'RESERVED',
                'due_date' => $dueDateTime,
                'image_path' => 'https://htmlcolorcodes.com/assets/images/colors/dark-red-color-solid-background-1920x1080.png',
            ];
        });
    }
}
