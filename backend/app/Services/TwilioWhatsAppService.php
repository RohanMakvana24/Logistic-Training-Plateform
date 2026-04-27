<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class TwilioWhatsAppService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client(
            env('TWILIO_SID'),
            env('TWILIO_AUTH_TOKEN')
        );
    }

    public function sendWhatsApp($mobile, $link)
    {
        try {
            $message = $this->client->messages->create(
                "whatsapp:+91" . $mobile,
                [
                    "from" => env('TWILIO_WHATSAPP_FROM'),
                    "body" => "👋 Welcome!\n\nYour account is ready.\n\nClick below to login:\n$link\n\n⏳ Link valid for 15 minutes"
                ]
            );

            return $message;
        } catch (\Exception $e) {
            Log::error("Twilio Error: " . $e->getMessage());
            return null;
        }
    }

    public function checkWhatsappNumber($toNumber)
    {
        try {
            // $message = $this->client->messages->create(
            //     "whatsapp:+91" . $toNumber,
            //     [
            //         "from" => env('TWILIO_WHATSAPP_FROM'),
            //         "body" => "Test message to verify WhatsApp number"
            //     ]
            // );
            return [
                "status" => false,
                "sid" => "test",
                "message" => "Message sent successfully"
            ];
        } catch (\Exception $e) {
            return [
                "status" => false,
                "error" => $e->getMessage()
            ];
        }
    }
}
