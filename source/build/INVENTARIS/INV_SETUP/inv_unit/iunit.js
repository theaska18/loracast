//	import cmp.iselect
Ext.define('IUnit', {
	alias:'widget.iunit',
	extend:'ISelect',
	width: 350,
	text:'Unit',
	emptyText:'Unit',
	valueField:'id',
	textField:'text',
	button:{
		urlData : url + 'cmd?m=INV_UNIT&f=get&a=t',
		windowWidth: 400,
		items:[
			{
				xtype:'itextfield',
				name:'f2',
				fieldLabel:'Kode Unit',
			},{
				xtype:'itextfield',
				name:'f1',
				fieldLabel:'Nama Unit',
			},{
				xtype:'ihiddenfield',
				name:'tenant_id',
				id:'iunit.tenant',
				value:_tenant_id
			}
		],
		columns:[
			{ hidden:true,dataIndex: 'id' },
			{ text: 'Unit',width: 320, dataIndex: 'text' },
			{ text: 'Jenis Unit',width: 80,dataIndex: 'f2' },
		]
	}
});