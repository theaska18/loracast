<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_image {
	public function get($name,$base="upload/"){
		if(trim($name)=='')
			$name='NO.GIF';
		if(file_exists($base.$name))
			return $name;
		else
			return 'NO.GIF';
	}
	function compress($source, $destination, $quality) {

		$info = getimagesize($source);

		if ($info['mime'] == 'image/jpeg') 
			$image = imagecreatefromjpeg($source);

		elseif ($info['mime'] == 'image/gif') 
			$image = imagecreatefromgif($source);

		elseif ($info['mime'] == 'image/png') 
			$image = imagecreatefrompng($source);

		imagejpeg($image, $destination, $quality);

		return $destination;
	}
	public function upload($base64_string=null, $type,$replace=null,$directory='upload/') {
		$ci=& get_instance();
		if($base64_string == null || $base64_string !== true){
			$val=null;
			if($base64_string != null && $base64_string != ''){
				$ci->load->library('lib/lib_sequence');
				$seq=$ci->lib_sequence->get('FILE_UPLOAD',null);
				$file_out=$directory.$seq['val'].'_'.$ci->pagesession->get()->tenant_id.'.'.$type;
				$ifp = fopen($file_out,"wb");
				$data = explode(',', $base64_string);
				$s=null;
				if(count($data)>1)
					$s=$data[1];
				else
					$s=$data[0];
				fwrite($ifp, base64_decode($s));
				fclose($ifp);
				$val=$seq['val'].'_'.$ci->pagesession->get()->tenant_id.'.'.$type;
				//$this->compress($directory.$val,$directory.$val,10);
			}
			if($replace!=null&&trim($replace)!=''&&$replace!='NO.GIF')
				if (file_exists($directory.$replace))
					unlink($directory.$replace);
			return $val;
		}else{
			return $replace;
		}
	}
}
?>