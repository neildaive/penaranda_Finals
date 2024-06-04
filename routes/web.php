<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AvailableRoomController;
use App\Http\Controllers\ReservedRoomController;


Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
        ->name('dashboard');

    Route::resource('project', ProjectController::class);
    Route::resource('task', TaskController::class);
    Route::resource('user', UserController::class);
    Route::resource('availableRoom', AvailableRoomController::class);
    Route::resource('reservedRoom', ReservedRoomController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/update-project-statuses', [ProjectController::class, 'updateStatuses']);
Route::post('/projects/{projectId}/reserve', [ReservationController::class, 'reserve'])->name('projects.reserve');
Route::post('/reservations/{id}/reserve', [ReservationController::class, 'reserve']);

Route::post('/reservations/{id}/make-available', [ReservationController::class, 'makeAvailable']);
Route::get('/available-rooms', [ReservationController::class, 'getAvailableRooms']);

Route::inertia('/available-rooms', 'AvailableRooms');
Route::get('/available-rooms', [AvailableRoomController::class, 'index']);
Route::get('/AvailableRooms', [AvailableRoomController::class, 'index'])->name('availableRooms.index');

Route::get('/ReservedRooms', [ReservedRoomController::class, 'index'])->name('reservedRooms.index');





require __DIR__ . '/auth.php';
