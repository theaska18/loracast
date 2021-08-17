<?php
function order_search($searchresults, $sortresults) {
    $searchhash = array();
    $returnresults = array();
    $count = 0;
	if($searchresults !=''){
	//	echo json_encode($sortresults);
		for ($i = 0; $i < count($searchresults); $i++) {
			$searchhash[$searchresults[$i]] = true;
		}
		for ($i = 0; $i < count($sortresults); $i++) {
			if (@$searchhash[$sortresults[$i]]) {
				$returnresults[$count] = $sortresults[$i];
				$count++;
			}
		}
	}
	//echo json_encode($returnresults);
    return $returnresults;
}
function getList(){
	$first=_get('page');
	$size=_get('pageSize');
	// $direction=_get('d',false);
	// $sorting=_get('s',false);
	$subject=_get('f1',false);
	$from=_get('f2',false);
	$start=_get('f3',false);
	$end=_get('f4',false);
	$read=_get('f5',false);
	$body=_get('f6',false);
	
	// if($direction == null){
		// $direction=1;
	// }else{
		// if($direction=='DESC'){
			// $direction=1;
		// }else{
			// $direction=0;
		// }
	// }
	$direction=0;
	// $sort=null;
	// switch ($sorting){
		// case "f2": 
			// $sort=SORTSUBJECT;
			// break;
		// case "f3":
			// $sort=SORTFROM;
			// break;
		// case "f4":
			// $sort=SORTSUBJECT;
			// break;
		// default:
			// $sort=SORTDATE;
			// break;
	// }
	$mbox = imap_open('{imap.hostinger.co.id:993/imap/ssl/novalidate-cert}INBOX','admin@siapp.net','45EP_kamaludin') or die('Cannot connect to example domain');
	$criteria='';
	if($subject != null && $subject!=''){
		$criteria.=' SUBJECT "'.$subject.'" ';
	}
	if($from != null && $from!=''){
		$criteria.=' FROM "'.$from.'" ';
	}
	if($start !== null && $start !==''){
		$criteria.=' SINCE "'. $start->format('d-M-Y') .'" ';
	}
	if($body !== null && $body !==''){
		$criteria.=' BODY "'. $body .'" ';
	}
	//echo ;
	if($end !== null && $end !==''){
		$criteria.=' BEFORE "'. date('d-M-Y',strtotime($end->format('d-M-Y') . "+1 days")) .'" ';
	}
	
	if($read != null && $read=='N'){
		$criteria.=' UNSEEN ';
	}else if($read != null && $read=='Y'){
		$criteria.=' SEEN ';
	}
	if($criteria==''){
		$criteria='ALL';
	}
	$sortresults = imap_sort($mbox , SORTDATE,1,SE_UID,$criteria, 'UTF-8');
    // $searchresults = imap_search($mbox,$criteria, SE_UID);
    // $results = order_search($searchresults, $sortresults);
	
	$msgs = array_chunk($sortresults, $size);
	
	if(count($msgs)>0){
		$msgs = $msgs[$first];
	}
	$MC = imap_check($mbox);
	
	$emails=imap_fetch_overview($mbox,implode($msgs, ','));
	$emails = array_reverse($emails);
	// echo json_encode($emails);
	// if($direction==1){
		// usort($emails, function($a1, $a2) {
			// $v1 = strtotime($a1->date);
			// $v2 = strtotime($a2->date);
			// //echo $v2.' '.$v1;
			// return ($v1) - ($v2);
		// });
	// }
	$arr=array();
	for($i=0,$iLen=count($emails); $i<$iLen;$i++){
		$head=$emails[$i];
		$styleBold='';
		if($head->seen==0){
			$styleBold='font-weight:bold;';
		}
		//echo json_encode($head);
		$o=array();
		$tgl=new DateTime($head->date);
		$o['i']=$head->uid;
		$o['f1']="<div style='width: 200px;font-size: 12px;".$styleBold."'>".$head->from."</div>";
		$o['f2']="<div style='".$styleBold."'>".$head->subject."</div>";
		$o['f3']="<div style='float:right;color:#7b7878;font-size:9px;".$styleBold."'>".timeago($tgl->format('Y-m-d H:i:s'))."</div>";
		$o['f4']=$head->seen;
		$arr[]=$o;
	}
	imap_close($mbox);
	_data($arr)->setTotal($MC->Nmsgs);
}
function timeago($date) {
   $timestamp = strtotime($date);	
   $strTime = array("Detik", "Menit", "Jam", "Hari", "Bulan", "Tahun");
   $length = array("60","60","24","30","12","10");
	$now=new DateTime();
   $currentTime = strtotime($now->format('Y-m-d H:i:s'));
   if($currentTime >= $timestamp) {
		$diff     = time()- $timestamp;
		for($i = 0; $diff >= $length[$i] && $i < count($length)-1; $i++) {
			$diff = $diff / $length[$i];
		}
		$diff = round($diff);
		return $diff . " " . $strTime[$i].' yang lalu';
   }
}
// function toExcel(){
	// $jobCode=_get('f1');
	// $jobName=_get('f2');
	// $active=_get('f3');
	
	// $entity='app_job';
	// $criteria=" WHERE tenant_id="._tenant_id();
	
	// if($jobCode != null && $jobCode !='')
		// $criteria.=" AND upper(job_code) like upper('%".$jobCode."%')";
	// if($jobName != null && $jobName !='')
		// $criteria.=" AND upper(job_name) like upper('%".$jobName."%')";
	// if($active != null && $active !=''){
		// if(trim($active)=='Y')
			// $criteria.=' AND active_flag=true ';
		// else
			// $criteria.=' AND active_flag=false ';
	// }
	// $orderBy=' ORDER BY job_code ASC ';
	// $res=_sql_result("SELECT job_code,job_name,active_flag FROM ".$entity." ".$criteria." ".$orderBy);
	// _excel(_function('generate_table',$res),_seq('EXPORT',_tenant_id()).'.xls');
	// return false;
// }
function initUpdate(){
	$uid=_get('i');
	$mbox = imap_open('{imap.hostinger.co.id:993/imap/ssl/novalidate-cert}INBOX','admin@siapp.net','45EP_kamaludin') or die('Cannot connect to example domain');
	$header = imap_header($mbox, $uid);
	$from = $header->from;
	$cc =array();
	if(isset($header->cc)){
		$cc = $header->cc;
	}
	//echo json_encode($header);
	$arrayFrom=array();
	foreach ($from as $id => $object) {
		$objFrom=array();
		$objFrom['name']=$object->personal;
		$objFrom['email']=$object->mailbox . "@" . $object->host;
		$arrayFrom[]=$objFrom;
	}
	$arrayCc=array();
	foreach ($cc as $id => $object) {
		$arrayCc[]=$object->mailbox . "@" . $object->host;
	}
	echo json_encode($header);
	$header2='
		<b>Dari:<b> '.$arrayFrom[0]['name'].' <'.$arrayFrom[0]['email'].'><br>
		Kepada: Asep Kamaludin <the_aska@yahoo.com>
		Terkirim: Selasa, 31 Maret 2020 10.08.51 GMT+7
		Judul: struk maret 2020
	';
	_data(array(
		'body'=>'<div style="padding: 10px 10px 30px 10px;">'.getBody($uid,$mbox).'</div>',
		'from'=>$arrayFrom,
		'cc'=>$arrayCc,
		'date'=>$header->date,
		'subject'=>$header->subject,
	));
}
function getBody($uid, $imap)
{
    $body = get_part($imap, $uid, "TEXT/HTML");
    if ($body == "") {
        $body = get_part($imap, $uid, "TEXT/PLAIN");
    }
    return $body;
}
function get_part($imap, $uid, $mimetype, $structure = false, $partNumber = false){
    if (!$structure) {
        $structure = imap_fetchstructure($imap, $uid, FT_UID);
    }
    if ($structure) {
        if ($mimetype == get_mime_type($structure)) {
            if (!$partNumber) {
                $partNumber = 1;
            }
            $text = imap_fetchbody($imap, $uid, $partNumber, FT_UID);
            switch ($structure->encoding) {
                case 3:
                    return imap_base64($text);
                case 4:
                    return imap_qprint($text);
                default:
                    return $text;
            }
        }
        if ($structure->type == 1) {
            foreach ($structure->parts as $index => $subStruct) {
                $prefix = "";
                if ($partNumber) {
                    $prefix = $partNumber . ".";
                }
                $data = get_part($imap, $uid, $mimetype, $subStruct, $prefix . ($index + 1));
                if ($data) {
                    return $data;
                }
            }
        }
    }
    return false;
}
function get_mime_type($structure){
    $primaryMimetype = ["TEXT", "MULTIPART", "MESSAGE", "APPLICATION", "AUDIO", "IMAGE", "VIDEO", "OTHER"];
	
    if ($structure->subtype) {
        return $primaryMimetype[(int)$structure->type] . "/" . $structure->subtype;
    }
    return "TEXT/PLAIN";
}
function save(){
	$pageType=_post('p');
	$pid=_post('i');
	$jobCode=_post('f1');
	$jobName=_post('f2');
	$activeFlag=_post('f3');
	
	if($pageType=='ADD'){
		$res=_this()->query->row("SELECT job_id FROM app_job WHERE job_code='".$jobCode."' AND tenant_id="._session()->tenant_id);
		if (!$res){
			_load('lib/lib_table_sequence');
			$id=_this()->lib_table_sequence->get('app_job');
			_this()->query->set("INSERT INTO app_job(job_id,job_code,job_name,active_flag,tenant_id) VALUES(".$id.",'".$jobCode."','".$jobName."',".$activeFlag.","._session()->tenant_id.")");
			_message_save('Job Code',$jobCode);
		}else
			_message_exist('Job Code',$jobCode);
	}else if($pageType=='UPDATE'){
		$res=_this()->query->row("SELECT job_id FROM app_job WHERE job_id=".$pid);
		if($res){
			_this()->query->set("UPDATE app_job SET job_name='".$jobName."',active_flag=".$activeFlag." WHERE job_id=".$pid);
			_message_update('Job Code',$jobCode);
		}else
			_not_found();
	}
}
function delete(){
	$pid= _post('i');
	$res= _this()->query->row("SELECT job_code FROM app_job WHERE job_id=".$pid);
	if ($res) {
		_this()->query->set("DELETE FROM app_job WHERE job_id=".$pid);
		_message_delete('Job Code',$res->job_code);
	}else
		_not_found();
}