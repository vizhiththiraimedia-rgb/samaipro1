<?php
// =========================================================================
// SAM AI - Reusable API Client for Standalone PHP Service Sites
// Include this in every standalone PHP service site to connect to the
// central SAM AI API at samai.com
// =========================================================================

class SamAI_API_Client {
    private $api_base;
    private $service_key;
    private $jwt_token;
    private $timeout;

    public function __construct($config) {
        $this->api_base = rtrim($config['api_base'], '/');
        $this->service_key = $config['service_key'];
        $this->jwt_token = $config['jwt_token'] ?? null;
        $this->timeout = $config['timeout'] ?? 30;
    }

    public function setToken($jwt) {
        $this->jwt_token = $jwt;
    }

    public function getToken() {
        return $this->jwt_token;
    }

    /**
     * Check if user is authenticated (has valid JWT)
     */
    public function isAuthenticated() {
        return !empty($this->jwt_token);
    }

    /**
     * Make an authenticated API request
     * Returns ['status' => 'success'|'error', 'data' => ..., 'error' => ..., 'code' => ...]
     */
    public function request($method, $endpoint, $data = null) {
        $url = $this->api_base . '/api' . $endpoint;

        $headers = [
            'x-api-key: ' . $this->service_key,
            'Content-Type: application/json',
            'Accept: application/json',
        ];

        if ($this->jwt_token) {
            $headers[] = 'Authorization: Bearer ' . $this->jwt_token;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

        if ($method === 'POST' || $method === 'PUT') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            if ($data) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            }
        } else {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            if ($data) {
                $url .= '?' . http_build_query($data);
                curl_setopt($ch, CURLOPT_URL, $url);
            }
        }

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return ['status' => 'error', 'error' => $error, 'code' => 0];
        }

        $decoded = json_decode($response, true);

        // Handle 402 Payment Required
        if ($http_code === 402) {
            return [
                'status' => 'payment_required',
                'error' => $decoded['message'] ?? 'Insufficient credits',
                'code' => 402,
                'purchase_url' => $decoded['purchase_url'] ?? '/pricing',
                'cost_required' => $decoded['cost_required'] ?? null,
                'current_balance' => $decoded['current_balance'] ?? 0,
            ];
        }

        // Handle 401 Unauthorized
        if ($http_code === 401) {
            return [
                'status' => 'unauthorized',
                'error' => $decoded['message'] ?? 'Authentication required',
                'code' => 401,
            ];
        }

        if ($http_code >= 400) {
            return [
                'status' => 'error',
                'error' => $decoded['detail'] ?? $decoded['message'] ?? 'API error',
                'code' => $http_code,
                'data' => $decoded,
            ];
        }

        return [
            'status' => 'success',
            'code' => $http_code,
            'data' => $decoded,
        ];
    }

    /**
     * Convenience: GET request
     */
    public function get($endpoint, $data = null) {
        return $this->request('GET', $endpoint, $data);
    }

    /**
     * Convenience: POST request
     */
    public function post($endpoint, $data = null) {
        return $this->request('POST', $endpoint, $data);
    }

    /**
     * Check credit balance
     */
    public function getCreditBalance() {
        return $this->get('/services/credits/balance');
    }

    /**
     * Get credit transaction history
     */
    public function getCreditHistory($limit = 50) {
        return $this->get('/services/credits/history', ['limit' => $limit]);
    }

    /**
     * Get credit packs available
     */
    public function getCreditPacks() {
        return $this->get('/services/credits/packs');
    }

    /**
     * Get service catalog (public)
     */
    public function getServiceCatalog() {
        return $this->get('/services/catalog');
    }

    /**
     * Register a new user
     */
    public function register($email, $password, $name = null) {
        return $this->post('/auth/register', [
            'email' => $email,
            'password' => $password,
            'name' => $name,
        ]);
    }

    /**
     * Login and get JWT token
     */
    public function login($email, $password) {
        $result = $this->post('/auth/login', [
            'email' => $email,
            'password' => $password,
        ]);

        if ($result['status'] === 'success' && isset($result['data']['access_token'])) {
            $this->jwt_token = $result['data']['access_token'];
            return [
                'status' => 'success',
                'token' => $this->jwt_token,
                'user' => $result['data']['user'] ?? null,
                'expires_in' => $result['data']['expires_in'] ?? 3600,
            ];
        }

        return $result;
    }
}

/**
 * Session management helper
 * Stores user session JWT in PHP sessions
 */
class SamAI_Session {
    private $session_key = 'samai_user_session';

    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function setUser($user_data, $jwt_token) {
        $_SESSION[$this->session_key] = [
            'user' => $user_data,
            'token' => $jwt_token,
            'login_time' => time(),
        ];
    }

    public function getUser() {
        return $_SESSION[$this->session_key]['user'] ?? null;
    }

    public function getToken() {
        return $_SESSION[$this->session_key]['token'] ?? null;
    }

    public function isLoggedIn() {
        return isset($_SESSION[$this->session_key]['token']);
    }

    public function logout() {
        unset($_SESSION[$this->session_key]);
    }

    public function getRemainingCredits($api_client) {
        $result = $api_client->getCreditBalance();
        if ($result['status'] === 'success') {
            return $result['data']['balance'] ?? 0;
        }
        return 0;
    }
}
