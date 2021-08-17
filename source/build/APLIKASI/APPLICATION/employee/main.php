<?php
function getEmployee(){
	$pid=_get('pid');
	$obj=_this()->query->row("SELECT id_number,foto,M.full_name AS f2,A.option_name AS f5,B.option_name AS f6,
		DATE_FORMAT(birth_date,'%d %b %Y') AS f3,birth_place AS f4,address AS f7,foto AS f11,email_address AS f8,phone_number1 AS f9,
		fax_number1 AS f10 FROM app_employee M INNER JOIN app_parameter_option A ON M.gender=A.option_code
		INNER JOIN app_parameter_option B ON M.religion=B.option_code WHERE employee_id=".$pid);
	$ses=_this()->pagesession->get();
	$html='
<link href="'.base_url().'vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<table border="1" width="100%">
		<tr>   
			<td width="120" style="text-align:center;padding: 5px;">
				<img src="'.base_url().'upload/'.$ses->tenant_logo.'" style="width: 110px;"/>
			</td>
			<td valign="top" style="text-align:center;padding: 5px;"><h4>'.$ses->tenant_name.'</h4></td>
			<td width="120" style="text-align:center;padding: 5px;"><img src="'.base_url().'upload/'.$obj->foto.'" style="width: 110px;"/></td>                   
		</tr>    
	</table> 
<script type="text/javascript" src="'.base_url().'vendor/jquery-2.1.4.min.js"></script>
<script src="'.base_url().'vendor/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
';

$html='
	<table border="1" width="100%">
		<tr>   
			<td width="120" style="text-align:center;padding: 5px;">
				<img src="'.base_url().'upload/'.$ses->tenant_logo.'" style="width: 110px;"/>
			</td>
			<td valign="top" style="text-align:center;padding: 5px;"><h4>'.$ses->tenant_name.'</h4></td>
			<td width="120" style="text-align:center;padding: 5px;"><img src="'.base_url().'upload/'.iif($obj->foto==NULL || $obj->foto=='','NO.GIF',$obj->foto).'" style="width: 110px;"/></td>                   
		</tr>    
	</table> 
';
	_this()->load->helper('pdf');
	pdf(array('html'=>$html));
}
function getById_allow(){
	$pid= _get('id');
	$res= _this()->query->row("SELECT CONCAT(first_name,' ',last_name) AS name FROM app_employee WHERE employee_id=".$pid);
	if ($res != null) {
		_data(array('employee_id'=>$pid,'name'=>$res->name));
	}else
		_not_found();
}
function delete(){
	$pid= _post('i');
	
	$code='';
	$res= _this()->query->row("SELECT id_number,foto,foto_ktp FROM app_employee WHERE employee_id=".$pid);
	$foto=null;
	if ($res != null) {
		$foto=$res->foto;
		$foto_ktp=$res->foto_ktp;
		$code=$res->id_number;
		_this()->query->set("DELETE FROM app_employee WHERE employee_id=".$pid);
		_load('lib/lib_image');
		_this()->lib_image->upload(null,'jpg',$foto);
		_this()->lib_image->upload(null,'jpg',$foto_ktp);
		_message_delete('ID Number', $code );
	}else
		_not_found();
}