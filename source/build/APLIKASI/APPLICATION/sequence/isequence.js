//	import cmp.iselect
Ext.define('ISequence', {
	alias:'widget.isequence',
	extend:'ISelect',
	width: 350,
	text:'Sequence',
	emptyText:'Sequence',
	valueField:'id',
	textField:'text',
	button:{
		urlData : url + 'cmd?m=SEQUENCE&f=get&a=t',
		windowWidth: 800,
		items:[
			{
				xtype:'itextfield',
				name:'f2',
				fieldLabel:'Kode Urut',
			},{
				xtype:'itextfield',
				name:'f1',
				fieldLabel:'Nama Urut',
			},{
				xtype:'ihiddenfield',
				name:'tenant_id',
				id:'isequence.tenant',
				value:_tenant_id
			}
		],
		columns:[
			{ hidden:true,dataIndex: 'id' },
			{ text: 'Urut',width: 320, dataIndex: 'text' },
			{ text: 'N Akhir',width: 60,dataIndex: 'f3' },
			{ text: 'Pengulangan',width: 100,dataIndex: 'f4' },
			{ text: 'Terakhir',width: 100,dataIndex: 'f6',xtype:'date' },
			{ text: 'Format',flex:1,sortable:false,minWidth: 200,dataIndex: 'f5' }
		]
	}
});