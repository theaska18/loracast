<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_html {
	function limit($string, $word_limit){
		$akhir='';
		if(strlen($string)>$word_limit){
			$akhir=' ....';
		}
		$words = explode(" ",$string);
		
		return implode(" ",array_splice($words,0,$word_limit)).$akhir;
	}
	public function convert($content,$before=null){
		$ci=& get_instance();
		$has=$content;
		if($before != null && $before != ''){
			preg_match_all('/<img[^>]+>/i',$before, $rBefore);
			preg_match_all('/<img[^>]+>/i',$content, $rContent);
			$imgBefore = array();
			$listBefore=array();
			foreach( $rBefore[0] as $img_tag){
				preg_match_all('/(src)=("[^"]*")/i',$img_tag,$imgBefore);
				if(count($imgBefore[0])>0){
					$sub=$imgBefore[0][0];
					$url=substr($sub,5,strlen($sub)-6);
					if (base64_decode($url, true) === false){
						$listBefore[]=$url;
					}
				}
			}
			$imgContent = array();
			$listContent=array();
			foreach( $rContent[0] as $img_tag){
				preg_match_all('/(src)=("[^"]*")/i',$img_tag,$imgContent);
				$sub=$imgContent[0][0];
				$url=substr($sub,5,strlen($sub)-6);
				if (base64_decode($url, true) === false)
					$listContent[]=$url;
			}
			for($i=0, $iLen=count($listBefore); $i<$iLen; $i++){
				$iUrl=$listBefore[$i];
				$iData=explode('/', $iUrl);
				$iName=$iData[count($iData)-1];
				$ada=false;
				for($j=0, $jLen=count($listContent); $j<$jLen; $j++){
					$jUrl=$listContent[$j];
					if($iUrl==$jUrl){
						$ada=true;
						break;
					}
				}
				if($ada==false)
					if (file_exists('upload/editor/'.$iName)) 
						unlink('upload/editor/'.$iName);
			}
		}
		if($content != null && $content != ''){
			function data_to_img($match) {
				list(, $img, $type, $base64, $end) = $match;
				$now=new DateTime();
				$bin = base64_decode($base64);
				$md5 = md5($bin).$now->format('Ymdhis');
				$fn = 'upload/editor/'."$md5.$type";
				file_exists($fn) or file_put_contents($fn, $bin);
				return $img.base_url().$fn.$end;
			}
 			$has=preg_replace_callback('#(<img\s(?>(?!src=)[^>])*?src=")data:image/(gif|png|jpeg);base64,([\w=+/]++)("[^>]*>)#', "data_to_img",$content);
			preg_match_all('/<img[^>]+>/i',$has, $imageList);
			$imgUrl=null;
			if(count($imageList[0])>0){
				for($i=0,$iLen=count($imageList[0]);$i<$iLen;$i++){
					$img=$imageList[0][$i];
					$s = explode('src="',$img);
					$t = explode('"',$s[1]);
					$imgUrl=$t[0];
					// echo $imgUrl.'--'.base_url().'temp/';
					if(((string)strpos($imgUrl,base_url().'temp/'))!==''){
						$splits=explode('/',$imgUrl);
						$imgName=$splits[count($splits)-1];
						copy($imgUrl, 'upload/editor/'.$imgName);
						unlink('temp/'.$imgName);
						$has=str_replace(base_url().'temp/'.$imgName, base_url().'upload/editor/'.$imgName, $has);
					}
				}
			}
		}	
		return $has;
	}
	public function save($has){
		preg_match_all('/<img[^>]+>/i',$has, $imageList);
		$imgUrl=null;
		if(count($imageList[0])>0){
			for($i=0,$iLen=count($imageList[0]);$i<$iLen;$i++){
				$img=$imageList[0][$i];
				$s = explode('src="',$img);
				$t = explode('"',$s[1]);
				$imgUrl=$t[0];
				$splits=explode('/',$imgUrl);
				$imgName=$splits[count($splits)-1];
				if(strpos($imgUrl,base_url().'temp/'.$imgName)>=0){
					$has=str_replace(base_url().'temp/'.$imgName, '##BASE_URL##temp/'.$imgName, $has);
				}
				if(strpos($imgUrl,base_url().'upload/editor/'.$imgName)>=0){
					$has=str_replace(base_url().'upload/editor/'.$imgName, '##BASE_URL##upload/editor/'.$imgName, $has);
				}
			}
		}
		return $has;
	}
	public function show($has){
		preg_match_all('/<img[^>]+>/i',$has, $imageList);
		$imgUrl=null;
		if(count($imageList[0])>0){
			//echo json_encode($imageList[0]);
			for($i=0,$iLen=count($imageList[0]);$i<$iLen;$i++){
				$img=$imageList[0][$i];
				$s = explode('src="',$img);
				$t = explode('"',$s[1]);
				$imgUrl=$t[0];
				
				$splits=explode('/',$imgUrl);
				$imgName=$splits[count($splits)-1];
				if(strpos($imgUrl,'##BASE_URL##temp/'.$imgName)>=0){
					$has=str_replace('##BASE_URL##temp/'.$imgName, base_url().'temp/'.$imgName, $has);
				}
				//echo $imgUrl;
				if(strpos($imgUrl,'##BASE_URL##upload/editor/'.$imgName)>=0){
					$has=str_replace('##BASE_URL##upload/editor/'.$imgName, base_url().'upload/editor/'.$imgName, $has);
				}
			}
		}
		return $has;
	}
}
?>