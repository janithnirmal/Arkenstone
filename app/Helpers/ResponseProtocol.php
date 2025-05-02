<?php
namespace App\Helpers;

class ResponseProtocol
{
    public static function success($data = null, $message = null, $code = 200)
    {
        return response()->json(self::formatResponse("success", $data, null, $message), $code);
    }

    public static function error($errors = null, $message = null, $code = 400)
    {
        return response()->json(self::formatResponse("error", null, $errors, $message), $code);
    }

    private static function formatResponse($status = "success", $data = null, $errors = null, $message = null)
    {
        $response = [
            'status' => $status,
            'message' => $message,
        ];
        if ($data) {
            $response['data'] = $data;
        }
        if ($errors) {
            $response['errors'] = $errors;
        }
        return $response;
    }
}
