<?php defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class File extends MY_controller {
	function __construct() {
		parent::__construct();
	}
	public function CroppedThumbnail($imgSrc,$thumbnail_width=null,$thumbnail_height=null) { 
		list($width_orig, $height_orig) = getimagesize($imgSrc); 
		$arr_name=explode(".",$imgSrc);
		$type=strtolower($arr_name[count($arr_name)-1]);
		// $isi=$this->setCompressionQuality($imgSrc,10,$type);
		// $imgSrc='data:image/jpg;base64,'.base64_encode($isi);
		if($type=='jpg' || $type=='jpeg'){
			$myImage = imagecreatefromjpeg($imgSrc);
		}else if($type=='png'){
			$myImage = imagecreatefrompng($imgSrc);
		}else if($type=='gif'){
			$myImage = imagecreatefromgif($imgSrc);
		}
		if($thumbnail_height !=null || $thumbnail_width != null){
			if($thumbnail_height==null){
				$thumbnail_height=0;
			}
			if($thumbnail_width==null){
				$thumbnail_width=0;
			}
		}else{
			$thumbnail_height=$height_orig;
			$thumbnail_width=$width_orig;
		}
		$ratio_orig = $width_orig/$height_orig;
		if($thumbnail_height !=0){
			if ($thumbnail_width/$thumbnail_height > $ratio_orig) {
			   $new_height = $thumbnail_width/$ratio_orig;
			   $new_width = $thumbnail_width;
			} else {
			   $new_width = $thumbnail_height*$ratio_orig;
			   $new_height = $thumbnail_height;
			}
		}else{
			$new_height = $thumbnail_width/$ratio_orig;
			$new_width = $thumbnail_width;
		}
		$x_mid = $new_width/2;  //horizontal middle
		$y_mid = $new_height/2; //vertical middle

		$process = imagecreatetruecolor(round($new_width), round($new_height)); 

		imagecopyresampled($process, $myImage, 0, 0, 0, 0, $new_width, $new_height, $width_orig, $height_orig);
		if($thumbnail_width !=0 && $thumbnail_height != 0){
			$thumb = imagecreatetruecolor($thumbnail_width, $thumbnail_height); 
			imagecopyresampled($thumb, $process, 0, 0, ($x_mid-($thumbnail_width/2)), ($y_mid-($thumbnail_height/2)), $thumbnail_width, $thumbnail_height, $thumbnail_width, $thumbnail_height);
		}else{
			$thumb = imagecreatetruecolor(round($new_width), round($new_height)); 
			imagecopyresampled($thumb, $process, 0, 0, ($x_mid-($new_width/2)), ($y_mid-($new_height/2)), $new_width, $new_height, $new_width, $new_height);
		}
		imagedestroy($process);
		imagedestroy($myImage);
		return $thumb;
	}
	function makeThumb( $filename , $thumbSize=100 ){
	  global $max_width, $max_height;
	 /* Set Filenames */
	  $srcFile = $filename;
	  $name=explode('/',$filename)[count(explode('/',$filename))-1];
	  $thumbFile = './cache/thumbs/'.$name;
	 /* Determine the File Type */
	  $type = substr( $filename , strrpos( $filename , '.' )+1 );
	 /* Create the Source Image */
	  switch( $type ){
		case 'jpg' : case 'jpeg' :
		  $src = imagecreatefromjpeg( $srcFile ); break;
		case 'png' :
		  $src = imagecreatefrompng( $srcFile ); break;
		case 'gif' :
		  $src = imagecreatefromgif( $srcFile ); break;
	  }
	 /* Determine the Image Dimensions */
	  $oldW = imagesx( $src );
	  $oldH = imagesy( $src );
	 /* Calculate the New Image Dimensions */
	  if( $oldH > $oldW ){
	   /* Portrait */
		$newW = $thumbSize;
		$newH = $oldH * ( $thumbSize / $newW );
	  }else{
	   /* Landscape */
		$newH = $thumbSize;
		$newW = $oldW * ( $thumbSize / $newH );
	  }
	 /* Create the New Image */
	  $new = imagecreatetruecolor( $thumbSize , $thumbSize );
	 /* Transcribe the Source Image into the New (Square) Image */
	  imagecopyresampled( $new , $src , 0 , 0 , ( $newW-$thumbSize )/2 , ( $newH-$thumbSize )/2 , $thumbSize , $thumbSize , $oldW , $oldH );
	  switch( $type ){
		case 'jpg' : case 'jpeg' :
		  $src = imagejpeg( $new , $thumbFile ); break;
		case 'png' :
		  $src = imagepng( $new , $thumbFile ); break;
		case 'gif' :
		  $src = imagegif( $new , $thumbFile ); break;
	  }
	  // echo $new;
	  // imagedestroy( $new );
	  // imagedestroy( $src );
	}
	public function notFound(){
		$height=null;
		$width=null;
		if(isset($_GET['h'])){
			$height=$_GET['h'];
		}
		if(isset($_GET['w'])){
			$width=$_GET['w'];
		}
		$file_url='./upload/NOT_FOUND.png';
		$newThumb = $this->CroppedThumbnail($file_url,$width,$height);
		header('Content-type: '.mime_content_type($file_url));
		imagejpeg($newThumb);
		header('Content-Disposition: inline; filename="NOT_FOUND.png"');
		exit;
	}
	function setCompressionQuality($imagePath, $quality,$type) {

		$backgroundImagick = new \Imagick(realpath($imagePath));
		$imagick = new \Imagick();
		$imagick->setCompressionQuality($quality);
		$imagick->newPseudoImage(
			$backgroundImagick->getImageWidth(),
			$backgroundImagick->getImageHeight(),
			'canvas:white'
		);

		$imagick->compositeImage(
			$backgroundImagick,
			\Imagick::COMPOSITE_ATOP,
			0,
			0
		);
		
		$imagick->setFormat($type);    
		//header("Content-Type: image/jpg");
		return $imagick->getImageBlob();
	}

	public function getIcon(){
		$file_url='./vendor/images/icon.png';
		 $newThumb = $this->CroppedThumbnail($file_url,30,30);
		header('Content-type: '.mime_content_type($file_url));
		imagepng($newThumb);
		header('Content-Disposition: inline; filename="icon.png"');
		exit;
	}
	public function index(){
		$folder=base64_decode($_GET['f']);
		$name=$_GET['n'];
		$height=null;
		$width=null;
		if(isset($_GET['h'])){
			$height=$_GET['h'];
		}
		if(isset($_GET['w'])){
			$width=$_GET['w'];
		}
		$file_url='./upload/file_manager/'.$folder.'/'.$name;
		$file_url=str_replace('//','/',$file_url);
		$arr_name=explode(".",$name);
		if (file_exists($file_url)) {
			$type=strtolower($arr_name[count($arr_name)-1]);
			if($type=='jpg' || $type=='jpeg' ||  $type=='png'||  $type=='gif'){
				$newThumb = $this->CroppedThumbnail($file_url,$width,$height);
				header('Content-type: '.mime_content_type($file_url));
				switch( $type ){
					case 'jpg' : case 'jpeg' :
					  $src = imagejpeg( $newThumb); break;
					case 'png' :
					  $src = imagepng( $newThumb); break;
					case 'gif' :
					  $src = imagegif( $newThumb); break;
				}
				header('Content-Disposition: inline; filename="'.$name.'"');
			}else{
				header('Content-Type: '.mime_content_type($file_url));//type
				header('Content-Disposition: inline; filename="'.$name.'"');
				header("Content-Length: ".filesize($file_url));
				$chunkSize = 1024 * 1024;
				$handle = fopen($file_url, 'rb');
				while (!feof($handle)){
					$buffer = fread($handle, $chunkSize);
					echo $buffer;
					ob_flush();
					flush();
				}
				fclose($handle);
				exit;
			}
		}else{
			$file_url='./upload/NOT_FOUND.png';
			$newThumb = $this->CroppedThumbnail($file_url,$width,$height);
			header('Content-type: '.mime_content_type($file_url));
			imagepng($newThumb);
			header('Content-Disposition: inline; filename="'.$name.'"');
		}
		exit;
	}
	public function upload(){
		set_time_limit(0);
		$directory=$_POST['directory'];
		$config['upload_path'] = './upload/file_manager/'.$directory;
		$config['allowed_types'] = '*';
		$config['max_size'] = 1024 * 10000;
		$config['encrypt_name'] = FALSE;
		$this->load->library('upload', $config);
		if (!$this->upload->do_upload('file')){
			$status = 'error';
			$result=$this->jsonresult;
			$result->setMessage($this->upload->display_errors('', ''))->end();
		}else{
			$result=$this->jsonresult;
			$result->end();
		}
	}
	public function uploadTinymce(){
		set_time_limit(0);
		$config['upload_path'] = './temp/';
		$config['allowed_types'] = '*';
		$config['max_size'] = 1024 * 10000;
		$config['encrypt_name'] = FALSE;
		$this->load->library('upload', $config);
		if (!$this->upload->do_upload('file')){
			$status = 'error';
			$result=$this->jsonresult;
			$result->setMessage($this->upload->display_errors('', ''))->end();
		}else{
			$data=$this->upload->data();
			$name=uniqid().$data['file_ext'];
			rename('./temp/'.$data['file_name'],'./temp/'.$name);
			$result=$this->jsonresult;
			$result->setData(array('name'=>$name,'type'=>$data['file_type'],'folder'=>'./temp/'));
			$result->end();
		}
	}
	public function renameFolder(){
		$child=$_POST['child'];
		$name=$_POST['name'];
		$before=$_POST['before'];
		rename('./upload/file_manager/'.$child.'/'.$before,'./upload/file_manager/'.$child.'/'.$name);
		$result=$this->jsonresult;
		$result->end();
	}
	public function newFolder(){
		$child=$_POST['child'];
		$name=$_POST['name'];
		if (!is_dir('./upload/file_manager/'.$child.'/'.$name)) {
			mkdir('./upload/file_manager/'.$child.'/'.$name, 0777, TRUE);
		}else{
			$no=1;
			$selesai=false;
			while($selesai==false){
				if(!is_dir('./upload/file_manager/'.$child.'/'.$name.'('.$no.')')){
					mkdir('./upload/file_manager/'.$child.'/'.$name.'('.$no.')', 0777, TRUE);
					$selesai=true;
				}else{
					$no++;
				}
			}
		}
		$result=$this->jsonresult;
		$result->end();
	}
	public function deleteFile(){
		$child=$_POST['child'];
		$name=$_POST['name'];
		if(substr($name,strlen($name)-1,1)=='/'){
			$name=substr($name,0,strlen($name)-1);
		}
		function delete_file($target){
			if(!is_link($target) && is_dir($target)){
				$files = array_diff( scandir($target), array('.', '..') );
				foreach($files as $file) {
					delete_file("$target/$file");
				}
				rmdir($target);
			}else{
				unlink($target);
			}
		}
		delete_file('./upload/file_manager/'.$child.'/'.$name);
		$result=$this->jsonresult;
		$result->end();
	}
 	public function getListFile(){
		$data=array();
		$user=$_GET['user'];
		$parent=$_GET['parent'];
		$loadtype=$_GET['loadtype'];
		if(isset($_GET['child']) && $_GET['child'] !='' && $_GET['child']!='false'){
			$this->load->helper('directory');
			if (!is_dir('./upload/file_manager/'.$_GET['child'])) {
				mkdir('./upload/file_manager/'.$_GET['child'], 0777, TRUE);
			}
			$map = directory_map('./upload/file_manager/'.$_GET['child'], 1);
			$split=explode("/",substr($parent,(strlen($parent)-1)));
			$obj=array(
					'parent'=>substr($parent,strlen($parent)-($split[count($split)-1])),
					'child'=>$parent,
					'type'=>'FOLDER',
					'name'=>'...',
				);
			$data[]=$obj;
			for($i=0,$iLen=count($map); $i<$iLen; $i++){
				$type='';
				if(substr($map[$i],strlen($map[$i])-1,1)=="\\" || substr($map[$i],strlen($map[$i])-1,1)=="/" ){
					$type='FOLDER';
				}else{
					$arr_name=explode(".",$map[$i]);
					$nameType=strtolower($arr_name[count($arr_name)-1]);
					if($nameType=='txt' || $nameType=='html' || $nameType=='htm' || $nameType=='js'|| $nameType=='css'|| $nameType=='crt'){
						$type='TEXT';
					}else if($nameType=='jpg' || $nameType=='jpeg' || $nameType=='gif'|| $nameType=='png'|| $nameType=='jpe'|| $nameType=='ico'|| $nameType=='bmp'){
						$type='IMAGE';
					}else if($nameType=='doc' || $nameType=='docs'|| $nameType=='docx'){
						$type='WORD';
					}else if($nameType=='xls' || $nameType=='xlsx'){
						$type='EXCEL';
					}else if($nameType=='pdf'){
						$type='PDF';
					}else if($nameType=='zip' || $nameType=='rar' || $nameType=='tar' || $nameType=='gz'  || $nameType=='iso'){
						$type='ZIP';
					}else if($nameType=='exe'){
						$type='APP';
					}else if($nameType=='mp3' || $nameType=='wav'){
						$type='AUDIO';
					}else if($nameType=='flv' || $nameType=='mp4'|| $nameType=='mov'|| $nameType=='movie'|| $nameType=='mkv'){
						$type='VIDEO';
					}else{
						$type='FILE';
					}
					
				}
				$obj=array(
					'parent'=>$_GET['child'],
					'child'=>$_GET['child'].'/'.$map[$i],
					'type'=>$type,
					'name'=>$map[$i],
				);
				$data[]=$obj;
			}
		}else{
			if($loadtype==1){
				$obj=array(
					'parent'=>'',
					'child'=>'admin/'.$user.'/',
					'type'=>'FOLDER',
					'name'=>'Document',
				);
				$data[]=$obj;
				// $obj=array(
					// 'parent'=>'',
					// 'child'=>'admin/all/',
					// 'type'=>'FOLDER',
					// 'name'=>'Admin',
				// );
				// $data[]=$obj;
			}else{
				$obj=array(
					'parent'=>'',
					'child'=>'user/'.$user.'/',
					'type'=>'FOLDER',
					'name'=>'Document',
				);
				$data[]=$obj;
				// $obj=array(
					// 'parent'=>'',
					// 'child'=>'user/all/',
					// 'type'=>'FOLDER',
					// 'name'=>'User',
				// );
				// $data[]=$obj;
			}
			// $obj=array(
				// 'parent'=>'',
				// 'child'=>'all',
				// 'type'=>'FOLDER',
				// 'name'=>'All',
			// );
			// $data[]=$obj;
		}
		// $this->load->helper('directory');
		// $map = directory_map('./upload/file_manager/all/', 1);
		$result=$this->jsonresult;
		$result->setData($data)->end();
	}
	private function getMimeType($type){
		$mime_types = array("323" => "text/h323",
			"acx" => "application/internet-property-stream",
			"ai" => "application/postscript",
			"aif" => "audio/x-aiff",
			"aifc" => "audio/x-aiff",
			"aiff" => "audio/x-aiff",
			"asf" => "video/x-ms-asf",
			"asr" => "video/x-ms-asf",
			"asx" => "video/x-ms-asf",
			"au" => "audio/basic",
			"avi" => "video/x-msvideo",
			"axs" => "application/olescript",
			"bas" => "text/plain",
			"bcpio" => "application/x-bcpio",
			"bin" => "application/octet-stream",
			"bmp" => "image/bmp",
			"c" => "text/plain",
			"cat" => "application/vnd.ms-pkiseccat",
			"cdf" => "application/x-cdf",
			"cer" => "application/x-x509-ca-cert",
			"class" => "application/octet-stream",
			"clp" => "application/x-msclip",
			"cmx" => "image/x-cmx",
			"cod" => "image/cis-cod",
			"cpio" => "application/x-cpio",
			"crd" => "application/x-mscardfile",
			"crl" => "application/pkix-crl",
			"crt" => "application/x-x509-ca-cert",
			"csh" => "application/x-csh",
			"css" => "text/css",
			"dcr" => "application/x-director",
			"der" => "application/x-x509-ca-cert",
			"dir" => "application/x-director",
			"dll" => "application/x-msdownload",
			"dms" => "application/octet-stream",
			"doc" => "application/msword",
			"docx" => "application/msword",
			"dot" => "application/msword",
			"dvi" => "application/x-dvi",
			"dxr" => "application/x-director",
			"eps" => "application/postscript",
			"etx" => "text/x-setext",
			"evy" => "application/envoy",
			"exe" => "application/octet-stream",
			"fif" => "application/fractals",
			"flr" => "x-world/x-vrml",
			"gif" => "image/gif",
			"gtar" => "application/x-gtar",
			"gz" => "application/x-gzip",
			"h" => "text/plain",
			"hdf" => "application/x-hdf",
			"hlp" => "application/winhlp",
			"hqx" => "application/mac-binhex40",
			"hta" => "application/hta",
			"htc" => "text/x-component",
			"htm" => "text/html",
			"html" => "text/html",
			"htt" => "text/webviewhtml",
			"ico" => "image/x-icon",
			"ief" => "image/ief",
			"iii" => "application/x-iphone",
			"ins" => "application/x-internet-signup",
			"isp" => "application/x-internet-signup",
			"jfif" => "image/pipeg",
			"jpe" => "image/jpeg",
			"jpeg" => "image/jpeg",
			"jpg" => "image/jpeg",
			"js" => "application/x-javascript",
			"latex" => "application/x-latex",
			"lha" => "application/octet-stream",
			"lsf" => "video/x-la-asf",
			"lsx" => "video/x-la-asf",
			"lzh" => "application/octet-stream",
			"m13" => "application/x-msmediaview",
			"m14" => "application/x-msmediaview",
			"m3u" => "audio/x-mpegurl",
			"man" => "application/x-troff-man",
			"mdb" => "application/x-msaccess",
			"me" => "application/x-troff-me",
			"mht" => "message/rfc822",
			"mhtml" => "message/rfc822",
			"mid" => "audio/mid",
			"mny" => "application/x-msmoney",
			"mov" => "video/quicktime",
			"movie" => "video/x-sgi-movie",
			"mp2" => "video/mpeg",
			"mp3" => "audio/mpeg",
			"mp4" => "video/mp4",
			"mpa" => "video/mpeg",
			"mpe" => "video/mpeg",
			"mpeg" => "video/mpeg",
			"mpg" => "video/mpeg",
			"mpp" => "application/vnd.ms-project",
			"mpv2" => "video/mpeg",
			"ms" => "application/x-troff-ms",
			"mvb" => "application/x-msmediaview",
			"nws" => "message/rfc822",
			"oda" => "application/oda",
			"p10" => "application/pkcs10",
			"p12" => "application/x-pkcs12",
			"p7b" => "application/x-pkcs7-certificates",
			"p7c" => "application/x-pkcs7-mime",
			"p7m" => "application/x-pkcs7-mime",
			"p7r" => "application/x-pkcs7-certreqresp",
			"p7s" => "application/x-pkcs7-signature",
			"pbm" => "image/x-portable-bitmap",
			"pdf" => "application/pdf",
			"pfx" => "application/x-pkcs12",
			"pgm" => "image/x-portable-graymap",
			"pko" => "application/ynd.ms-pkipko",
			"pma" => "application/x-perfmon",
			"pmc" => "application/x-perfmon",
			"pml" => "application/x-perfmon",
			"pmr" => "application/x-perfmon",
			"pmw" => "application/x-perfmon",
			"png" => "image/png",
			"pnm" => "image/x-portable-anymap",
			"pot" => "application/vnd.ms-powerpoint",
			"ppm" => "image/x-portable-pixmap",
			"pps" => "application/vnd.ms-powerpoint",
			"ppt" => "application/vnd.ms-powerpoint",
			"prf" => "application/pics-rules",
			"ps" => "application/postscript",
			"pub" => "application/x-mspublisher",
			"qt" => "video/quicktime",
			"ra" => "audio/x-pn-realaudio",
			"ram" => "audio/x-pn-realaudio",
			"rar" => "application/x-rar-compressed",
			"ras" => "image/x-cmu-raster",
			"rgb" => "image/x-rgb",
			"rmi" => "audio/mid",
			"roff" => "application/x-troff",
			"rtf" => "application/rtf",
			"rtx" => "text/richtext",
			"scd" => "application/x-msschedule",
			"sct" => "text/scriptlet",
			"setpay" => "application/set-payment-initiation",
			"setreg" => "application/set-registration-initiation",
			"sh" => "application/x-sh",
			"shar" => "application/x-shar",
			"sit" => "application/x-stuffit",
			"snd" => "audio/basic",
			"spc" => "application/x-pkcs7-certificates",
			"spl" => "application/futuresplash",
			"src" => "application/x-wais-source",
			"sst" => "application/vnd.ms-pkicertstore",
			"stl" => "application/vnd.ms-pkistl",
			"stm" => "text/html",
			"svg" => "image/svg+xml",
			"sv4cpio" => "application/x-sv4cpio",
			"sv4crc" => "application/x-sv4crc",
			"t" => "application/x-troff",
			"tar" => "application/x-tar",
			"tcl" => "application/x-tcl",
			"tex" => "application/x-tex",
			"texi" => "application/x-texinfo",
			"texinfo" => "application/x-texinfo",
			"tgz" => "application/x-compressed",
			"tif" => "image/tiff",
			"tiff" => "image/tiff",
			"tr" => "application/x-troff",
			"trm" => "application/x-msterminal",
			"tsv" => "text/tab-separated-values",
			"txt" => "text/plain",
			"uls" => "text/iuls",
			"ustar" => "application/x-ustar",
			"vcf" => "text/x-vcard",
			"vrml" => "x-world/x-vrml",
			"wav" => "audio/x-wav",
			"wcm" => "application/vnd.ms-works",
			"wdb" => "application/vnd.ms-works",
			"wks" => "application/vnd.ms-works",
			"wmf" => "application/x-msmetafile",
			"wps" => "application/vnd.ms-works",
			"wri" => "application/x-mswrite",
			"wrl" => "x-world/x-vrml",
			"wrz" => "x-world/x-vrml",
			"xaf" => "x-world/x-vrml",
			"xbm" => "image/x-xbitmap",
			"xla" => "application/vnd.ms-excel",
			"xlc" => "application/vnd.ms-excel",
			"xlm" => "application/vnd.ms-excel",
			"xls" => "application/vnd.ms-excel",
			"xlt" => "application/vnd.ms-excel",
			"xlw" => "application/vnd.ms-excel",
			"xof" => "x-world/x-vrml",
			"xpm" => "image/x-xpixmap",
			"xwd" => "image/x-xwindowdump",
			"z" => "application/x-compress",
			"zip" => "application/zip");
		return $mime_types[$type];
	}
}