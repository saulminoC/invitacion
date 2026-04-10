<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BabyShowerController extends Controller
{
    public function getData()
    {
        return response()->json([
            'votes' => DB::table('baby_votes')->first(),
            'messages' => DB::table('baby_messages')->latest()->take(15)->get()
        ]);
    }

    public function castVote(Request $request)
    {
        $team = $request->input('team'); // 'nino' o 'nina'

        if (in_array($team, ['nino', 'nina'])) {
            DB::table('baby_votes')->increment($team);
        }

        return DB::table('baby_votes')->first();
    }

    public function postMessage(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'msg' => 'required|string',
        ]);

        DB::table('baby_messages')->insert([
            'name' => $request->name,
            'message' => $request->msg,
            'created_at' => now(),
        ]);

        return DB::table('baby_messages')->latest()->take(15)->get();
    }
}
