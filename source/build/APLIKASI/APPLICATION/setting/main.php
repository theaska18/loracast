<?php
function getTenant(){
	$tenant=_this()->query->row("SELECT * FROM app_tenant WHERE tenant_id="._this()->pagesession->get()->tenant_id);
	if($tenant){
		_load('lib/lib_image');
		$tenant->logo=_this()->lib_image->get($tenant->logo);
		_data($tenant);
	}else
		_not_found();
}
function save(){
	$tenantName=_post('f2');
	$tenantDesc=_post('f3');
	$address=_post('f4');
	$city=_post('f5');
	$phoneNumber=_post('f6');
	_load('lib/lib_dynamic_option');
	_this()->lib_dynamic_option->set($city,'DYNAMIC_CITY');
	$faxNumber=_post('f7');
	$foto=_post('f8');
	
	$tenant= _this()->query->row("SELECT logo FROM app_tenant WHERE tenant_id="._this()->pagesession->get()->tenant_id);
	if ($tenant) {
		_load('lib/lib_image');
		$resFoto=_this()->lib_image->upload($foto,'jpg',$tenant->logo);
		_this()->query->set("UPDATE app_tenant SET tenant_name='".$tenantName."',tenant_desc='".$tenantDesc."',address='".$address."',city='".$city."',
				phone_number='".$phoneNumber."',fax_number='".$faxNumber."',logo='".$resFoto."' WHERE tenant_id="._this()->pagesession->get()->tenant_id);
		_message_update('Tenant Name', $tenantName );
	}else
		_not_found();
}