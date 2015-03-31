<?php

/*!
 * webkitecture-connector.php
 * http://coronadofactory.com/webkitecture/
 *
 * Copyright (c) 2011-2015 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/webkitecture/master/LICENSE.txt
 *
 * Date: 2014-12-25
 */


class WebkitectureResponseHTTP {

	private $exec;
	private $info;

	function __construct($exec, $info, $error) {
		$this->exec = $exec;
		$this->info = $info;
		$this->error = $error;
	}
	
	function haserror() {
		return $this->info['http_code']!=200;
	}	

	function errorcode() {
		return $this->info['http_code'];
	}	

	function errormessage() {
		if ($this->info['http_code']==0) {
			return $this->error;
		} else if ($this->info['http_code']==404) {
			return 'HTTP 404 - Not found';
		} else if ($this->info['http_code']==405) {
			return 'HTTP 405 - Request method \'POST\' not supported';
		} else {
			return $this->exec;
		}
	}	

	function content() {
		return $this->exec;
	}	
	
}

class WebkitectureResponsePHP {

	private $response;

	function __construct($response) {
		$this->response = $response;
	}

	public function haserror() {
		return $this->response->hasError();
	}
	
	public function errorcode() {
		return $this->response->errorcode();
	}

	public function errormessage() {
		return $this->response->errormessage();
	}
	
	public function content() {
		return $this->response->content();
	}

}

class WebkitectureCurl {

	private $URL;
	private	$CHARSET = 'utf-8';

	function __construct($value) {
		$this->URL = $value;
	}

	private function curl($service, $method, $requestJSON) {
	
		// URL to connect
		$curl_url = $this->URL . '/' . $service ;

		// Opening CURL connection
		$handler = curl_init($curl_url);

		// CURL configuration
		curl_setopt($handler, CURLOPT_CUSTOMREQUEST, $method);
		if (isset($requestJSON)) curl_setopt($handler, CURLOPT_POSTFIELDS, $requestJSON);
		curl_setopt($handler, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($handler, CURLOPT_HTTPHEADER, array(
		    'Content-Type: application/json',
		    'Content-Length: ' . strlen($requestJSON))
		);
		
		$response = new WebkitectureResponseHTTP(curl_exec($handler), curl_getinfo($handler), curl_error($handler));
	    curl_close($handler);
		return $response;
		
	}
	
	public function invoke($service, $method, $request) {
		return new WebkitectureResponsePHP($this->curl($service, $method, $request));
	}
		
}

class WebkitectureResponseJSON {

	private $response;

	function __construct($response) {
		$this->response = $response;
	}

	public function haserror() {
		return $this->response->hasError();
	}
	
	public function ok() {
		return ! $this->haserror();
	}

	public function errormessage() {
		return $this->response->errorMessage();
	}
	
	public function content() {
		return json_decode($this->response->content());
	}

}

class Webkitecture {

	function __construct($url) {
		$this->repo = new WebkitectureCurl($url);
	}

	function get($service, $method, $request) {
		if ($method=='GET') {
			return new WebkitectureResponseJSON($this->repo->invoke($service, $method, '{}'));
		} else {
			return new WebkitectureResponseJSON($this->repo->invoke($service, $method, json_encode($request)));
		}
	}

	function proxy($service, $method) {
		header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header('Cache-Control: post-check=0, pre-check=0', FALSE);
		header('Pragma: no-cache');
		
		$response = $this->repo->invoke($service, $method, file_get_contents('php://input'));
		if ($response->hasError()) {
		    $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
		    header($protocol . ' ' . $response->errorcode() . ' ' . $response->errormessage());
		} else {
			echo $response->content();	
		}
	}
	
}


?>