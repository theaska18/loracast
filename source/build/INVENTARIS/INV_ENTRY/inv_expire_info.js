shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_EXPIRE_INFO.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_EXPIRE_INFO.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_EXPIRE_INFO.btnShowSearch');
			}
		}
	]
});
new Ext.Panel({
	id : 'INV_EXPIRE_INFO.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_EXPIRE_INFO.search',
			modal:false,
			title:'Barang - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_EXPIRE_INFO.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_EXPIRE_INFO.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_EXPIRE_INFO.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_EXPIRE_INFO.search.f1').focus();
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('search');
				}
			},
			fbar: [
				{
					text: 'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search',
					id:'INV_EXPIRE_INFO.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_EXPIRE_INFO.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_EXPIRE_INFO.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_EXPIRE_INFO.search.panel').qReset();
					}
				},{
					text:'Export',
					id:'INV_EXPIRE_INFO.search.btnExport',
					tooltip:'Export',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('INV_EXPIRE_INFO.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'INV_EXPIRE_INFO.export',
							onY : function() {
								window.open(url+'cmd?m=INV_EXPIRE_INFO&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_EXPIRE_INFO.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_EXPIRE_INFO.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_EXPIRE_INFO.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('INV_EXPIRE_INFO.search.btnSearch');
								}
							},
							id:'INV_EXPIRE_INFO.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('INV_EXPIRE_INFO.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('INV_EXPIRE_INFO.search.btnSearch');
								}
							}
						},
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_EXPIRE_INFO.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('INV_EXPIRE_INFO.search.panel').qParams();
					arr['unit_id']=Ext.getCmp('INV_EXPIRE_INFO.conf.unit_id').getValue();
					return arr;
				}else{
					var obj={};
					obj[Ext.getCmp('INV_EXPIRE_INFO.dropdown').getValue()]=Ext.getCmp('INV_EXPIRE_INFO.text').getValue();
					obj['unit_id']=Ext.getCmp('INV_EXPIRE_INFO.conf.unit_id').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_EXPIRE_INFO&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'-',{
					xtype:'iconfig',
					code:[
						iif(_access('INV_EXPIRE_INFO_config_UNIT_ID')==false,'UNIT_ID',null),
					]
				},'-','->',{
					xtype:'ihiddenfield',
					id:'INV_EXPIRE_INFO.conf.unit_id',
					value:1,
				},{
					xtype:'idropdown',
					id : 'INV_EXPIRE_INFO.dropdown',
					emptyText:'Pencarian',
					margin:false,
					value:'f2',
					data:[
						{id:'f2',text:'Nama Barang'},
						{id:'f1',text:'Kode Barang'},
						{id:'f3',text:'Deskripsi'},
					],
					width: 150,
					press:{
						enter:function(){
							_click('INV_EXPIRE_INFO.btnSearch');
						}
					}
				},{
					xtype:'itextfield',
					width: 200,
					emptyText:'Pencarian',
					margin:false,
					tooltip:'Pencarian [Ctrl+f]',
					id:'INV_EXPIRE_INFO.text',
					press:{
						enter:function(){
							_click('INV_EXPIRE_INFO.btnSearch');
						}
					}
				},{
					iconCls: 'fa fa-search',
					tooltip:'Pencarian [F5]',
					id:'INV_EXPIRE_INFO.btnSearch',
					handler : function(a) {
						Ext.getCmp('INV_EXPIRE_INFO.list').refresh(false);
					}
				},'-',{
					tooltip:'Export',
					iconCls: 'fa fa-file-excel-o',
					id:'INV_EXPIRE_INFO.btnExport',
					tooltip:'Export To Excel',
					handler:function(a){
						Ext.getCmp('INV_EXPIRE_INFO.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'INV_EXPIRE_INFO.export',
							onY : function() {
								window.open(url+'cmd?m=INV_EXPIRE_INFO&f=toExcel&session='+_session_id+'&'+Ext.getCmp('INV_EXPIRE_INFO.dropdown').getValue()+'='+Ext.getCmp('INV_EXPIRE_INFO.text').getValue());
							}
						})
					}
				},'-',{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_EXPIRE_INFO.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						Ext.getCmp('INV_EXPIRE_INFO.search').show();
						Ext.getCmp('INV_EXPIRE_INFO.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ text: 'Tgl. Terima',width: 100, dataIndex: 'receive_on',align:'center' },
				{ text: 'No. Terima',width: 100, dataIndex: 'receive_number',align:'center' },
				{ text: 'No. Gin',width: 100, dataIndex: 'gin_code',align:'center' },
				{ text: 'Barang',width: 200, dataIndex: 'item' },
				{ text: 'Stok',width: 120,dataIndex: 'jum',align:'right',
					renderer: function(value,a){
						return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.measurement_name;
					} 
				},
				{ text: 'Tgl. Expire',width: 100,align:'center', dataIndex: 'expire_date' },
				{ text: 'Status',width: 200, dataIndex: 'hari' },
			]
		}
	]
});