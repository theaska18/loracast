<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_common {
	public function cache_start($name=null){
		function seourl($s) {
			$c = array (' ','\\',',','#',':',';','\'','”','[',']','{','}',')','(','|','`','~','!','@','%','$','^','&','*','=','?','+','é','_');
			$s = strtolower(str_replace($c,'-', $s));
			$panjangdiv=strlen($s);
			$isi=explode('–',$s);
			for($i=0;$i<$panjangdiv;$i++){
				$s = str_replace('–-','-',$s);
				$s = str_replace('---','-',$s);
			}
			return $s;
		}
		$cachefile='';
		if($name==null){
			$urlcache = $_SERVER['REQUEST_URI'];
			$breakcache = explode('/', $urlcache);
			$filecache="";
			foreach($breakcache as $joincache){
				$filecache=seourl($filecache).'-'.seourl($joincache);
			}
			$cachefile = './cache/T'.seourl($filecache).'.html';
		}else{
			$cachefile = './cache/N-'.$name.'.html';
		}
		$cachetime = rand(300,90000);

		if (file_exists($cachefile) && time() - $cachetime < filemtime($cachefile)){
			include($cachefile);
			exit;
		}
		ob_start();
		return $cachefile;
	}
	public function cache_end($cachefile){
		$cached = fopen($cachefile,'w');
		fwrite($cached, ob_get_contents());
		fclose($cached);
		ob_end_flush();
	}
	public function ajax($type,$url,$content=null,$header=null){
		$curl = curl_init($url);
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $type);
		curl_setopt($curl, CURLOPT_HEADER, false);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		if($content != null){
			//echo json_encode($content);
			curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($content));
		}
		if($header != null){
			curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
		}
		if($type=='POST'){
			curl_setopt($curl, CURLOPT_POST, true);
		}
		$response = curl_exec($curl);
		if($response === FALSE){
			die(curl_error($curl));
		}
		$res=json_decode($response);
		curl_close($curl);
		return $res;
	}
	public function indonesianDate ($timestamp = '', $date_format = 'l, j F Y | H:i', $suffix = 'WIB') {
		if (trim ($timestamp) == '')
		{
				$timestamp = time ();
		}
		elseif (!ctype_digit ($timestamp))
		{
			$timestamp = strtotime ($timestamp);
		}
		# remove S (st,nd,rd,th) there are no such things in indonesia :p
		$date_format = preg_replace ("/S/", "", $date_format);
		$pattern = array (
			'/Mon[^day]/','/Tue[^sday]/','/Wed[^nesday]/','/Thu[^rsday]/',
			'/Fri[^day]/','/Sat[^urday]/','/Sun[^day]/','/Monday/','/Tuesday/',
			'/Wednesday/','/Thursday/','/Friday/','/Saturday/','/Sunday/',
			'/Jan[^uary]/','/Feb[^ruary]/','/Mar[^ch]/','/Apr[^il]/','/May/',
			'/Jun[^e]/','/Jul[^y]/','/Aug[^ust]/','/Sep[^tember]/','/Oct[^ober]/',
			'/Nov[^ember]/','/Dec[^ember]/','/January/','/February/','/March/',
			'/April/','/June/','/July/','/August/','/September/','/October/',
			'/November/','/December/',
		);
		$replace = array ( 'Sen','Sel','Rab','Kam','Jum','Sab','Min',
			'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu',
			'Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des',
			'Januari','Februari','Maret','April','Juni','Juli','Agustus','Sepember',
			'Oktober','November','Desember',
		);
		$date = date ($date_format, $timestamp);
		$date = preg_replace ($pattern, $replace, $date);
		$date = "{$date} {$suffix}";
		return $date;
	}
}
?>