<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class FlatFactory extends Factory
{

    public function definition(): array
    {
        $project = Project::first();
        if (! $project) {
            $project = Project::create(['title' => $this->faker->name]);
        }
        $rooms = rand(0, 4);
        $is_studio = false;
        if ($rooms === 0) {
            $is_studio = true;
        }
        return [
            'project_id'    => $project->id,
            'rooms'         => $rooms,
            'studio'        => $is_studio,
            'price'         => $this->faker->randomNumber(),
            'old_price'     => $this->faker->randomNumber(),
            'square'        => $this->faker->randomFloat(),
            'release_dates' => '3кв. 2026',
            'floor'         => $this->faker->randomNumber(),
            'image'         => $this->faker->imageUrl,
        ];
    }
}
