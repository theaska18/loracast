shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_STOK_MIN_INF.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_STOK_MIN_INF.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_STOK_MIN_INF.btnShowSearch');
			}
		}
	]
});
new Ext.Panel({
	id : 'INV_STOK_MIN_INF.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_STOK_MIN_INF.search',
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
									_click('INV_STOK_MIN_INF.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_STOK_MIN_INF.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_STOK_MIN_INF.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_STOK_MIN_INF.search.f1').focus();
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
					id:'INV_STOK_MIN_INF.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_STOK_MIN_INF.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_STOK_MIN_INF.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_STOK_MIN_INF.search.panel').qReset();
					}
				},{
					text:'Export',
					tooltip:'Export',
					id:'INV_STOK_MIN_INF.search.btnExport',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('INV_STOK_MIN_INF.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'INV_STOK_MIN_INF.export',
							onY : function() {
								window.open(url+'cmd?m=INV_STOK_MIN_INF&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_STOK_MIN_INF.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_STOK_MIN_INF.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_STOK_MIN_INF.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('INV_STOK_MIN_INF.search.btnSearch');
								}
							},
							id:'INV_STOK_MIN_INF.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('INV_STOK_MIN_INF.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('INV_STOK_MIN_INF.search.btnSearch');
								}
							}
						},
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_STOK_MIN_INF.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('INV_STOK_MIN_INF.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('INV_STOK_MIN_INF.dropdown').getValue()]=Ext.getCmp('INV_STOK_MIN_INF.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_STOK_MIN_INF&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'-',{
					xtype:'iconfig',
					code:[
						iif(_access('INV_STOK_MIN_INF_config_UNIT_ID')==false,'UNIT_ID',null),
					]
				},'-','->',
				{
					xtype:'idropdown',
					id : 'INV_STOK_MIN_INF.dropdown',
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
							_click('INV_STOK_MIN_INF.btnSearch');
						}
					}
				},{
					xtype:'itextfield',
					width: 200,
					emptyText:'Pencarian',
					margin:false,
					tooltip:'Pencarian [Ctrl+f]',
					id:'INV_STOK_MIN_INF.text',
					press:{
						enter:function(){
							_click('INV_STOK_MIN_INF.btnSearch');
						}
					}
				},{
					iconCls: 'fa fa-search',
					tooltip:'Pencarian [F5]',
					id:'INV_STOK_MIN_INF.btnSearch',
					handler : function(a) {
						Ext.getCmp('INV_STOK_MIN_INF.list').refresh(false);
					}
				},'-',{
					tooltip:'Export',
					iconCls: 'fa fa-file-excel-o',
					tooltip:'Export To Excel',
					id:'INV_STOK_MIN_INF.btnExport',
					handler:function(a){
						Ext.getCmp('INV_STOK_MIN_INF.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'INV_STOK_MIN_INF.export',
							onY : function() {
								window.open(url+'cmd?m=INV_STOK_MIN_INF&f=toExcel&session='+_session_id+'&'+Ext.getCmp('INV_STOK_MIN_INF.dropdown').getValue()+'='+Ext.getCmp('INV_STOK_MIN_INF.text').getValue());
							}
						})
					}
				},'-',{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_STOK_MIN_INF.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						Ext.getCmp('INV_STOK_MIN_INF.search').show();
						Ext.getCmp('INV_STOK_MIN_INF.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ text: 'Barang',width: 200, dataIndex: 'item' },
				{ text: 'Min. Stok',width: 120,dataIndex: 'min_stok',align:'right',
					renderer: function(value,a){
						return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.measurement_name;
					} 
				},{ text: 'Stok',width:120,dataIndex: 'stock',align:'right',
					renderer: function(value,a){
						return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.measurement_name;
					}  
				}
			]
		}
	]
});