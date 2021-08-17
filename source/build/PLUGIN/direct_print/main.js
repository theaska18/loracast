new Ext.Panel({
	id : 'SEQUENCE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'isetting',
			autoRefresh:true,
			level:3,
			code:[
				iif(_access('DIRECT_PRINT_config_IP_SERVER')==false,'IP_SERVER',null),
				iif(_access('DIRECT_PRINT_config_PORT_SERVER')==false,'PORT_SERVER',null)
			],
			role_id:null,
			menu_code:'DIRECT_PRINT',
			tenant_id:_tenant_id,
			user_id:_user_id
		}
	]
});