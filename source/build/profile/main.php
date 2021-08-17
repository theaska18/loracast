<?php
function initRun(){
	$pid=_get('i');
	$data=_this()->query->row("SELECT M.foto AS f1,R.role_name AS f2,M.email_address AS f3,M.gender AS f4,M.birth_place AS f5,
		M.birth_date  AS f6 FROM app_employee M
		LEFT JOIN app_user U ON U.employee_id=M.employee_id
		LEFT JOIN app_role R ON R.role_id=U.role_id WHERE M.employee_id=".$pid);
	// $ip                 = $_SERVER['REMOTE_ADDR']; 
	// $userGeoData        = getGeoIP($ip);
	// _this()->load->plugin('geo_location');
	
	// $ip = _this()->input->ip_address();
    // $geo_data = get_geolocation($ip);
	// $data->f4=$geo_data;
	$data->f6=hitung_umur($data->f6);
	_data($data);
}
function hitung_umur($tanggal_lahir) {
    list($year,$month,$day) = explode("-",$tanggal_lahir);
    $year_diff  = date("Y") - $year;
    $month_diff = date("m") - $month;
    $day_diff   = date("d") - $day;
    if ($month_diff < 0) $year_diff--;
        elseif (($month_diff==0) && ($day_diff < 0)) $year_diff--;
    return $year_diff;
}
 function get_geolocation($ip) {
	 $stream_opts = ['ssl' => ['verify_peer'=>false,'verify_peer_name'=>false]];
	$d = file_get_contents("http://www.ipinfodb.com/ip_query.php?ip=$ip&output=xml",false,stream_context_create($stream_opts));
	
	//Use backup server if cannot make a connection
	if (!$d) {
		$backup = file_get_contents("http://backup.ipinfodb.com/ip_query.php?ip=$ip&output=xml",false,stream_context_create($stream_opts));
		$result = new SimpleXMLElement($backup);
		if (!$backup)
			return false; // Failed to open connection
	} else {
		$result = new SimpleXMLElement($d);
	}
	//Return the data as an array
	return array('ip'=>$ip, 'country_code'=>$result->CountryCode, 'country_name'=>$result->CountryName, 'region_name'=>$result->RegionName, 'city'=>$result->City, 'zip_postal_code'=>$result->ZipPostalCode, 'latitude'=>$result->Latitude, 'longitude'=>$result->Longitude, 'timezone'=>$result->Timezone, 'gmtoffset'=>$result->Gmtoffset, 'dstoffset'=>$result->Dstoffset);
}
function getLocation(){
	$latitude=_get('latitude');
	$longitude=_get('longitude');
	$geolocation = $latitude.','.$longitude;
	$request = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='.$geolocation.'&sensor=true&key=AIzaSyC2RTgVPbqOcoBPLqW02HSho8zEfygY0Rk'; 
	$file_contents = file_get_contents($request);
	$json_decode = json_decode($file_contents);
	$arr=array();
	if(isset($json_decode->results[0])) {
		$response = array();
		foreach($json_decode->results[0]->address_components as $addressComponet) {
			if(in_array('political', $addressComponet->types)) {
					$response[] = $addressComponet->long_name; 
			}
		}

		if(isset($response[0])){ $first  =  $response[0];  } else { $first  = 'null'; }
		if(isset($response[1])){ $second =  $response[1];  } else { $second = 'null'; } 
		if(isset($response[2])){ $third  =  $response[2];  } else { $third  = 'null'; }
		if(isset($response[3])){ $fourth =  $response[3];  } else { $fourth = 'null'; }
		if(isset($response[4])){ $fifth  =  $response[4];  } else { $fifth  = 'null'; }

		if( $first != 'null' && $second != 'null' && $third != 'null' && $fourth != 'null' && $fifth != 'null' ) {
			$arr=array('address'=>$first,'city'=>$second,'state'=>$fourth,'country'=>$fifth);
		}
		else if ( $first != 'null' && $second != 'null' && $third != 'null' && $fourth != 'null' && $fifth == 'null'  ) {
			$arr=array('address'=>$first,'city'=>$second,'state'=>$third,'country'=>$fourth);
		}
		else if ( $first != 'null' && $second != 'null' && $third != 'null' && $fourth == 'null' && $fifth == 'null' ) {
			$arr=array('city'=>$first,'state'=>$second,'country'=>$third);
		}
		else if ( $first != 'null' && $second != 'null' && $third == 'null' && $fourth == 'null' && $fifth == 'null'  ) {
			$arr=array('state'=>$first,'country'=>$second);
		}
		else if ( $first != 'null' && $second == 'null' && $third == 'null' && $fourth == 'null' && $fifth == 'null'  ) {
			$arr=array('country'=>$first);
		}
	  }
	  return $arr;
}
// function getGeoIP($ip = null, $jsonArray = false) {
        // try {
            // if($ip == null) {
                // $ip   = filter_input(INPUT_SERVER, 'REMOTE_ADDR');
            // }
			// echo $ip;
            // // if($ip == "127.0.0.1" || $ip == "::1") {
                // // throw new Exception('You are on a local sever, this script won\'t work right.');
            // // }
            // // if(!filter_var($ip, FILTER_VALIDATE_IP)) {
                // // throw new Exception('Invalid IP address "' . $ip . '".');
            // // }
            // // if(!is_bool($jsonArray)) {
                // // throw new Exception('The second parameter must be a boolean - true (return array) or false (return JSON object); default is false.');
            // // }
           // // var_dump($ip);
            // $url  = "http://freegeoip.net/json/" . $ip;
            // $json = @file_get_contents($url);
            // if($json === false) {
                // return false;
            // }
            // $json = json_decode($json, $jsonArray);
            // if($json === null) {
                // // Return false
                // return false;
            // } else {
                // return $json;
            // }
           // //  var_dump($json); die();
        // } catch(Exception $e) {
            // return $e->getMessage();
        // }
    // }
function saveProfile(){
	$result=_this()->jsonresult;
	$pid=_post('i');
	$firstName=_post('f2');
	$secondName=_post('f3');
	$lastName=_post('f4');
	$gender=_post('f5');
	$religion=_post('f6');
	$birthPlace=_post('f7');
	_this()->load->library('lib/lib_dynamic_option');
	_this()->lib_dynamic_option->set($birthPlace,'DYNAMIC_CITY');
	$birthDate=_post('f8');
	$address=_post('f9');
	$email=_post('f10');
	$phone1=_post('f11');
	$phone2=_post('f12');
	$fax1=_post('f13');
	$fax2=_post('f14');
	$foto=_post('f15');
	
	$employee= _this()->query->row("SELECT foto,id_number FROM app_employee WHERE employee_id=".$pid);
	if ($employee != null) {
		$resFoto=$employee->foto;
		if($foto == null || $foto !== true){
			_this()->load->library('lib/lib_image');
			$resFoto=_this()->lib_image->upload($foto,'jpg',$employee->foto);
		}
		$full_name=$firstName;
		if(trim($secondName) !=''){
			$full_name.=' '.$secondName;
		}
		if(trim($lastName) !=''){
			$full_name.=' '.$lastName;
		}
		_this()->query->set("UPDATE app_employee SET full_name='".$full_name."',first_name='".$firstName."',foto='".$resFoto."',second_name='".$secondName."',
				last_name='".$lastName."',gender='".$gender."',religion='".$religion."',birth_date='".$birthDate->format('Y-m-d')."',birth_place='".$birthPlace."',
				address='".$address."',email_address='".$email."',phone_number1='".$phone1."',phone_number2='".$phone2."',fax_number1='".$fax1."',
				fax_number2='".$fax2."' WHERE employee_id=".$pid);
		$result->setMessageEdit ('Nomor ID', $employee->id_number )->end ();
	}else{
		$result->error()->setMessageNotExist()->end();
	}
}
function saveUsername(){
	$result=_this()->jsonresult;
	$new=_post('f1');
	$old=_post('f2');
	$password=_post('f3');
	$user = _this()->query->row( "SELECT password FROM app_user WHERE user_code='" . $old . "' " );
	if ($user) {
		if ($user->password == hash ( 'md5', $password )) {
			if($new != $old){
				$cek = _this()->query->row( "SELECT user_code FROM app_user WHERE user_code='" . $new . "'" );
				if(!$cek){
					_this()->query->set( "UPDATE app_user SET user_code='". $new ."' WHERE user_code='".$old."'" );
					$result->setMessage ('Kode Pengguna Berhasil diUbah.')->end();
				}else
					$result->warning()->setMessage ('Kode Pengguna tidakk tersedia.')->end();
			}else
				$result->warning()->setMessage ('Kode Pengguna Baru tidak boleh sama dengan Kode Pengguna Baru.')->end();
		}else
			$result->warning()->setMessage ('Kode Pengguna lama dan kata sandi tidak sesuai .')->end();
	}else
		$result->warning()->setMessage ('Kode Pengguna lama dan kata sandi tidak sesuai .')->end();
}
function savePassword(){
	$result=_this()->jsonresult;
	$new=_post('f1');
	$userName=_post('f2');
	$old=_post('f3');
	$user = _this()->query->row( "SELECT password FROM app_user WHERE user_code ='" . $userName . "' " );
	if ($user) {
		if ($user->password == hash ( 'md5', $old )) {
			if($new != $old){
				_this()->query->set( "UPDATE app_user SET password='". hash ( 'md5', $new ) ."' WHERE user_code='".$userName."'" );
				$result->setMessage ('Kata Sandi Berhasil diUbah.')->end();
			}else
				$result->warning()->setMessage ('Kata Sandi baru dan Kata Sandi lama tidak boleh sama.')->end();
		}else
			$result->warning()->setMessage ('Kode Pengguna dan Kata Sandi lama tidak sesuai.')->end();
	}else
		$result->warning()->setMessage ('Kode Pengguna dan Kata Sandi lama tidak sesuai.')->end();
}
function getProfile(){
	$result = _this()->jsonresult;
	$pid=_get('i');
	$employee=_this()->query->row("SELECT id_number,first_name,second_name,last_name,gender,religion,
				birth_place,birth_date,address,email_address,phone_number1,phone_number2,fax_number1,fax_number2,foto FROM app_employee WHERE employee_id=".$pid);
	if($employee !== null){
		$data=array();
		$o=array();
		$o['f1']=$employee->id_number;
		$o['f2']=$employee->first_name;
		$o['f3']=$employee->second_name;
		$o['f4']=$employee->last_name;
		$o['f5']=$employee->gender;
		$o['f6']=$employee->religion;
		$o['f7']=$employee->birth_place;
		$birthDate=new DateTime($employee->birth_date);
		$o['f8']=$birthDate->format('Y-m-d');
		$o['f9']=$employee->address;
		$o['f10']=$employee->email_address;
		$o['f11']=$employee->phone_number1;
		$o['f12']=$employee->phone_number2;
		$o['f13']=$employee->fax_number1;
		$o['f14']=$employee->fax_number2;
		_this()->load->library('lib/lib_image');
		$o['f15'] =_this()->lib_image->get($employee->foto);
		$data['o']=$o;
		$result->setData($data)->end();
	}else
		$result->error()->setMessageNotExist()->end();
}