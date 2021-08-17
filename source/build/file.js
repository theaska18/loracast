new Ext.Panel({
	id : 'FILE.main',
	layout:'fit',
	border:false,
	items:[
		new Ext.create('App.cmp.FileManager',{user:_employee_id})
	]
});