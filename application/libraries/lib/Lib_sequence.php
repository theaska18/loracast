<?php
if(!defined('BASEPATH')) exit('No direct script access allowed');
class Lib_sequence {
	public function get($code, $params=array(),$tenant=null) {
		$ci=& get_instance();
		$now=new DateTime();
		$arr=$this->getNext($code, $params,$tenant);
		$val=$arr['val'];
		$reset=$arr['reset'];
		$nextVal=$arr['nextVal'];
		$query='';
		if($tenant==null){
			$ci->pagesession->get();
			$tenant=$ci->pagesession->tenant_id;
		}
		$sub=' AND tenant_id='.$tenant;	
		if($reset==true)
			$query=",last_on='".$now->format('Y-m-d')."'";
		$ci->query->set("UPDATE app_sequence SET last_value=".$nextVal." ".$query." WHERE sequence_code='".$code."' ".$sub);
		return $arr;
	}
	public function getById($seq_id, $params=array()) {
		$ci=& get_instance();
		$now=new DateTime();
		$tenant=null;
		$res=$ci->query->row("SELECT sequence_code,tenant_id from app_sequence WHERE sequence_id=".$seq_id);
		if(!$res){
			$ci->query->back();
			$ci->jsonresult->error()->setMessage('Sequence Not Found.')->end();
		}else{
			return $this->get($res->sequence_code,$params,$res->tenant_id);
		}
	}
	private function getFormat($val, $format, $params=array()) {
		$digit=strlen((string)$val);
		$now=new DateTime();
		if(strpos($format,'(d)')!==false)
			$format=str_replace("(d)",$now->format('d'),$format);
		if(strpos($format,'(dr)')!==false)
			$format=str_replace("(dr)",$this->numberToRomanRepresentation((int)$now->format('d')),$format);
		if(strpos($format,'(D)')!==false)
			$format=str_replace("(D)",$now->format('D'),$format);
		if(strpos($format,'(m)')!==false)
			$format=str_replace("(m)",$now->format('m'),$format);
		if(strpos($format,'(mr)')!==false)
			$format=str_replace("(mr)",$this->numberToRomanRepresentation((int)$now->format('m')),$format);
		if(strpos($format,'(M)')!==false)
			$format=str_replace("(M)",$now->format('M'),$format);
		if(strpos($format,'(y)')!==false)
			$format=str_replace("(y)",$now->format('y'),$format);
		if(strpos($format,'(yr)')!==false)
			$format=str_replace("(yr)",$this->numberToRomanRepresentation((int)$now->format('y')),$format);
		if(strpos($format,'(Y)')!==false)
			$format=str_replace("(Y)",$now->format('Y'),$format);
		if(strpos($format,'(Yr)')!==false)
			$format=str_replace("(Yr)",$this->numberToRomanRepresentation((int)$now->format('Y')),$format);
		for($i=0;$i<$digit;$i++)
			$format=str_replace("(N".$i.")",substr($val,$i,1),$format);
		if($params !=null)
			for($i=0,$iLen=count($params);$i<$iLen;$i++)
				$format=str_replace("(S".$i.")",$params[$i],$format);
		return $format;
	}
	function numberToRomanRepresentation($number) {
		$map = array('M' => 1000, 'CM' => 900, 'D' => 500, 'CD' => 400, 'C' => 100, 'XC' => 90, 'L' => 50, 'XL' => 40, 'X' => 10, 'IX' => 9, 'V' => 5, 'IV' => 4, 'I' => 1);
		$returnValue = '';
		while ($number > 0) {
			foreach ($map as $roman => $int) {
				if($number >= $int) {
					$number -= $int;
					$returnValue .= $roman;
					break;
				}
			}
		}
		return $returnValue;
	}
	public function getNext($code,$params=array(),$tenant=null) {
		$ci=& get_instance();
		$now=new DateTime();
		$query='';
		$sub='';
		if($tenant==null){
			$ci->pagesession->get();
			$tenant=$ci->pagesession->tenant_id;
		}
		$sub=' AND tenant_id='.$tenant;	
		$sequence=$ci->query->row("SELECT repeat_type,last_value,digit,format,last_on FROM app_sequence WHERE sequence_code='".$code."'".$sub);
		if($sequence==null){
			$ci->query->set("INSERT INTO app_sequence(sequence_code,sequence_name,digit,last_value,last_on,format,repeat_type,tenant_id)values
						('".$code."','UNDEFINED',6,0,'".$now->format('Y-m-d')."','(y)(N0)(N1)(N2)(N3)(N4)(N5)','REPEAT_YEAR',".$tenant.")");
			$sequence=$ci->query->row("SELECT repeat_type,last_value,digit,format,last_on FROM app_sequence WHERE sequence_code='".$code."'".$sub);
		}
		if($sequence!=null){
			$repType=$sequence->repeat_type;
			if($repType=='REPEAT_NONE') {
				$nextVal=$sequence->last_value+1;
				$reset=false;
				$jumlahDigit=strlen((string)$nextVal);
				if($jumlahDigit>$sequence->digit) {
					$nextVal=1;
					$reset=true;
					$jumlahDigit=1;
				}
				$sisaDigit=$sequence->digit-$jumlahDigit;
				$val='';
				for($i=0;$i<$sisaDigit;$i++)
					$val.='0';
				$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
				$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
				return $arr;
			}else if($repType=='REPEAT_DAY'){
				$reset=false;
				$lastOn=new DateTime($sequence->last_on);
				if(strtotime($lastOn->format('Y-m-d'))!=strtotime($now->format('Y-m-d'))){
					$nextVal=1;
					$jumlahDigit=1;
					$reset=true;
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0;$i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
					return $arr;
				}else{
					$nextVal=$sequence->last_value+1;
					$jumlahDigit=strlen((string)$nextVal);
					if($jumlahDigit > $sequence->digit){
						$nextVal=1;
						$reset=true;
						$jumlahDigit=1;
					}
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0;$i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=> $hasil,'reset'=> $reset,'nextVal'=>$nextVal);
					return $arr;
				}
			}else if($repType=='REPEAT_WEEK'){
				$reset=false;
				$lastOn=new DateTime($sequence->last_on);
				if($now->format('YW')!==$lastOn->format('YW')) {
					$nextVal=1;
					$jumlahDigit=1;
					$reset=true;
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0;$i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
					return $arr;
				}else{
					$nextVal=$sequence->last_value+1;
					$jumlahDigit=strlen((string)$nextVal);
					if($jumlahDigit>$sequence->digit) {
						$nextVal=1;
						$reset=true;
						$jumlahDigit=1;
					}
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0; $i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
					return $arr;
				}
			}else if($repType=='REPEAT_MONTH'){
				$reset=false;
				$lastOn=new DateTime($sequence->last_on);
				if($now->format('Ym')!==$lastOn->format('Ym')) {
					$nextVal=1;
					$jumlahDigit=1;
					$reset=true;
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0;$i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
					return $arr;
				}else{
					$nextVal=$sequence->last_value+1;
					$jumlahDigit=strlen((string)$nextVal);
					if($jumlahDigit>$sequence->digit){
						$nextVal=1;
						$reset=true;
						$jumlahDigit=1;
					}
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0;$i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
					return $arr;
				}
			}else if($repType=='REPEAT_YEAR'){
				$reset=false;
				$lastOn=new DateTime($sequence->last_on);
				if($now->format('Y')!==$lastOn->format('Y')){
					$nextVal=1;
					$jumlahDigit=1;
					$reset=true;
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0;$i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
					return $arr;
				}else{
					$nextVal=$sequence->last_value+1;
					$jumlahDigit=strlen((string)$nextVal);
					if($jumlahDigit>$sequence->digit) {
						$nextVal=1;
						$reset=true;
						$jumlahDigit=1;
					}
					$sisaDigit=$sequence->digit-$jumlahDigit;
					$val='';
					for($i=0;$i<$sisaDigit;$i++)
						$val.='0';
					$hasil=$this->getFormat($val.$nextVal,$sequence->format,$params);
					$arr=array('val'=>$hasil,'reset'=>$reset,'nextVal'=>$nextVal);
					return $arr;
				}
			}
		}else{
			$ci->query->back();
			$ci->load->library('lib/lib_language');
			$ci->lib_language->load();
			$ci->jsonresult->error()->setMessage($ci->lib_language->line('MSG_SEQUENCE_CODE_NOT_FOUND',array('param'=>$code)))->end();
		}
	}
}
?>